(function () {
    window.unhandledErrorFun = function (message) {
        //You can add a message into DOM by creating an element on the fly.
        alert(message);
        return;
    }
    window.onerror = unhandledErrorFun;

})();;(function () {
   
    angular.module("rx.exception.directive", []);

    angular.module("rx.exceptionHandlerModule", ['rx.exception.directive'])
        .config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler',
            ['$delegate', '$injector', extendExceptionHandler]);
        return;
    }]);

    // Extend the $exceptionHandler service to also display a toast.
    function extendExceptionHandler($delegate, $injector) {        
        return function (exception, cause) {            
            //customize
            var es = $injector.get('exceptionService');
            if (es) {
                es.addNotification(exception);
            }
            $delegate(exception, cause);
        };
    }

})();;(function () {
    angular.module('metrics.core', [
            'ngResource',
            'ui.router',
            'ngRoute',
            'ngCookies',
            'rx.exceptionHandlerModule',
            'ui.bootstrap',
            'appsettings',
            'nvd3'
    ]);
})();;(function () {
    'use strict';
    angular.module('metrics.core')
        .provider('apiUrlConfig', ['appsettingsConstant', function (appsettings) {
            var environment = {
                metricsApiBaseUrl: appsettings.metricsApiBaseUrl,
                metricsSecurityApiBaseUrl: appsettings.metricsSecurityApiBaseUrl,
                appBaseUrl: appsettings.appBaseUrl,
                logging_url: appsettings.logging_url
            };

            this.setmetricsApiBaseUrl = function (url) {
                environment.metricsApiBaseUrl = url;
            };
            this.getEnvironment = function () {
                return environment;
            };
            this.$get = [function () {
                return environment;
            }];

            return;
        }]);
})();

(function () {
    'use strict';
    angular.module('metrics.core')
        .provider('appSettings', ['appsettingsConstant', function (appsettingsConstant) {
            var appSettings = {                
                appContextPath: appsettingsConstant.appContextPath,
                isLoggerEnabled: appsettingsConstant.isLoggerEnabled,
                showHeader: appsettingsConstant.showHeader
            };

            this.setIsLoggerEnabled = function (_isLoggerEnabled) {
                appSettings.isLoggerEnabled = _isLoggerEnabled;
            };

            this.getAppSettings = function () {
                return appSettings;
            };

            this.$get = [function () {
                return appSettings;
            }];

            return;
        }]);
})();;(function () {
    angular.module('metrics.core')
        .provider('logger', ['appSettingsProvider', function (appSettings) {

            var appConfig = appSettings.getAppSettings(),
                isEnabled = appConfig.isLoggerEnabled && true;

            return {
                setEnabled: function (_isEnabled) {
                    if (appConfig.isLoggerEnabled) {
                        isEnabled = !!_isEnabled;
                    }
                },
                getEnabled: function () {
                    return isEnabled;
                },

                $get: ['$log', function ($log) {

                    var Logger = function (module) {
                        this.context = module;
                    }

                    Logger.prototype = {
                        log: enhanceLogging($log.log),
                        info: enhanceLogging($log.info),
                        warn: enhanceLogging($log.warn),
                        debug: enhanceLogging($log.debug),
                        error: enhanceLogging($log.error)
                    };

                    Logger.getInstance = function (module) {
                        return new Logger(module);
                    };

                    function _log(loggingFunc, context, args) {
                        var modifiedArguments = [].slice.call(args);
                        modifiedArguments[0] = [moment().format("dddd h:mm:ss a") + '::[' + context + ']> '] + modifiedArguments[0];
                        loggingFunc.apply(null, modifiedArguments);

                        // we can log all the message to server, if we want. need to implement a queue
                    }

                    function enhanceLogging(loggingFunc) {
                        return function () {
                            if (!isEnabled) {
                                return;
                            }
                            _log.call(null, loggingFunc, this.context, arguments);
                        };
                    }

                    return { getInstance: Logger.getInstance }
                }]
            }
        }]);
})();;(function () {
    angular.module('metrics.core').config(['apiUrlConfigProvider', '$urlRouterProvider', '$stateProvider',
        'routehelperConfigProvider', '$routeProvider', '$httpProvider', function (apiUrlConfigProvider,
            $urlRouterProvider, $stateProvider,
            routehelperConfigProvider, $routeProvider, $httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
            $httpProvider.interceptors.push('authTokenInterceptor');
            $urlRouterProvider.otherwise('/');

        }]).value('config', function () {
            var config = {
                restApiFrameworkName: ''
            };
            return config;
        });
})();;(function () {
    angular.module('metrics.core').factory('httpInterceptor', ['$q', 'constant', 'rx.exceptionHandler', 'logger', '$window', function ($q, constant, exceptionHandler, logger, $window) {

        var requestCB = [], responseCB = [], responseErrorCB = [];
        var unsubscribe = function (handlers, fn) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === fn) {
                    handlers.splice(i, 1);
                }
            }
        }

        var notify = function (handlers, args) {
            var returnValue;
            for (var i = 0; i < handlers.length; i++) {
                returnValue = handlers[i].apply(null, [].slice.call(args));
            }

            return returnValue;
        };

        var validateErrorOccurred = function (response) {
            if (response && response.config && response.config.url.search('.html') == -1) {
                var responseObj = response.data;
                if (responseObj && (responseObj.hasOwnProperty('error') ||
                    (responseObj.data && responseObj.data.hasOwnProperty('responseStatus') && responseObj.data.responseStatus === constant.common.RESPONSE_FAILED))) {
                    //throw new exceptionHandler.ServerError(constant.CommonErrorConstant.SERVICE_INVOCATION_ERR);
                    var msg = responseObj.error || responseObj.data.hasOwnProperty('msg') && responseObj.data.msg || constant.CommonErrorConstant.SERVICE_INVOCATION_ERR;
                    throw new exceptionHandler.ServerError(msg, response.data || response);
                }
            }
        };

        var handleResponseError = function (response) {
            var status = response.status;
            if (response && response.config && response.config.url.search('.html') == -1) {
                if (status == 0) { //handle 302 code
                    //$window.location.href = constant.common.LOGGIN_REDIRECT_PATH + $window.location.pathname + $window.location.hash;
                }
                else if (status === 404) {
                    throw new exceptionHandler.ServerError(constant.CommonErrorConstant.SERVICE_UNAVAILABLE, response.data || response);
                } else if (response.status == 401) {
                    throw new exceptionHandler.ServerError(constant.CommonErrorConstant.UNAUTHORIZED, response.data || response);
                } else {
                    throw new exceptionHandler.ServerError(constant.CommonErrorConstant.SERVICE_INVOCATION_ERR, response.data || response);
                }
            }
        };

        return {
            request: function (config) {
                notify(requestCB, arguments); // have to extend the return data with config
                return config || $q.when(config);
            },
            response: function (response) {
                notify(responseCB, arguments);

                //handling eception globally.
                //need to capture error in case API failed.
                validateErrorOccurred(response);

                return response || $q.when(response);
            },
            responseError: function (response) {
                notify(responseErrorCB, arguments);

                //need to capture error in case API failed.
                validateErrorOccurred(response);
                handleResponseError(response);
                return $q.reject(response);
            },
            requestSubscribe: function (fn) {
                requestCB.push(fn);
            },
            responseSubscribe: function (fn) {
                responseCB.push(fn);
            },
            responseErrorSubscribe: function (fn) {
                responseErrorCB.push(fn);
            },
            requestUnSubscribe: function (fn) {
                unsubscribe(requestCB, fn);
            },
            responseUnSubscribe: function (fn) {
                unsubscribe(responseCB, fn);
            },
            responseErrorUnSubscribe: function (fn) {
                unsubscribe(responseErrorCB, fn);
            }
        }
    }]);
})();;(function () {
    angular.module('metrics.core').factory('authTokenInterceptor', ['$cookies', '$window',
        function ($cookies, $window) {
            return {
                request: function (config) {
                    config.headers["Content-Type"] = "application/json";
                    //config.headers["X-Auth-Token"] = "AAA41e660i2vUPjP8R6kLxVl1XjmnwtWZ5sYoLm0SHk_i-q0XzpHqTbg4Nr_dfGps0YvHD-t0F3ydT6JPiqMSsLk27IM5q7i9EwhUytyHaviKlqzs5d-JFRQ";
                    if (!$cookies.rax_auth_token) {
                        if (!angular.isDefined($cookies.rax_auth_token)) {
                            var path = "unauthorized.html";
                            //$window.location.href = '/identity/?ref=/control-panel/metrics/#/';
                        }
                    }
                    else {
                        var token = $cookies.rax_auth_token;
                        //config.headers['rax_auth_token'] = $cookies.rax_auth_token;
                    }
                    return config;
                }
            }
        }]);
})();;(function () {
    'use strict';
    angular.module('metrics.core')
        .provider('constant', [function () {
            var constant = {};
            this.configureConstant = function (constantDef) {
                angular.extend(constant, constantDef);
            };

            function getConstants() {
                return constant;
            };

            this.$get = [function () {
                return getConstants();
            }];
            return;
        }]);
})();
;(function () {
    angular.module('metrics.global.service', []);
    angular.module('metrics.global.directive', []);
    angular.module('metrics.global.utility', []);
    angular.module('metrics.global.filter', []);

    angular.module('metrics.global', [
    'metrics.global.service',
    'metrics.global.directive',
    'metrics.global.filter',
    'metrics.global.utility'
    ]);
})();;angular.module('metrics.global.directive').directive('wcOverlay', ['$q', '$timeout', '$window', 'httpInterceptor', function ($q, $timeout, $window, httpInterceptor) {

    var link = function (scope, element, attrs) {
        var overlayContainer = null,
            timerPromise = null,
            timerPromiseHide = null,
            inSession = false,
            queue = [];

        init();

        function init() {
            wireUpHttpInterceptor();
            scope.show = false;
        }

        //Hook into httpInterceptor factory request/response/responseError functions                
        function wireUpHttpInterceptor() {

            httpInterceptor.requestSubscribe(function (config) {
                processRequest(config);
            });

            httpInterceptor.responseSubscribe(function (response) {
                processResponse(response);
            });

            httpInterceptor.responseErrorSubscribe(function (rejection) {
                processResponse(rejection);
            });
        }

        function processRequest() {
            queue.push({});
            if (queue.length == 1) {
                timerPromise = $timeout(function () {
                    if (queue.length) showOverlay();
                }, scope.wcOverlayDelay ? scope.wcOverlayDelay : 100); //Delay showing for 100 millis to avoid flicker
            }
        }

        function processResponse() {
            queue.pop();
            if (queue.length == 0) {
                //Since we don't know if another XHR request will be made, pause before
                //hiding the overlay. If another XHR request comes in then the overlay
                //will stay visible which prevents a flicker
                timerPromiseHide = $timeout(function () {
                    //Make sure queue is still 0 since a new XHR request may have come in
                    //while timer was running
                    if (queue.length == 0) {
                        hideOverlay();
                        if (timerPromiseHide) $timeout.cancel(timerPromiseHide);
                    }
                }, scope.wcOverlayDelay ? scope.wcOverlayDelay : 100);
            }
        }

        function showOverlay() {
            scope.show = true;
        }

        function hideOverlay() {
            if (timerPromise) $timeout.cancel(timerPromise);
            scope.show = false;
                
        }
    }
    return {
        restrict: 'EA',
        transclude: true,
        priority: 2000,
        scope: {
            wcOverlayDelay: "@"
        },
        template: '<div class="loader-backdrop" ng-show="show">' +
                        '<div class="overlayBackground"></div>' +
                        '<div class="overlayContent" data-ng-transclude>' +
                        '</div>' +
                    '</div>',        
        compile: function ( tElement, tAttributes) {
                tElement.removeClass("hide");
                return( link );

            }
    }
}]);
;(function(){angular.module('metrics.global.directive').directive('checkboxList', ['$interpolate', '$parse', function ($interpolate, $parse) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {

            // model -> view
            ngModel.$render = function () {
                //Inital load, in case if filter already has the value, need to update in UI.
                var values = ngModel.$modelValue || [];
                angular.forEach(elm.find('input'), function (input) {
                    var exp = $interpolate(input.getAttribute('value')),
                        context = angular.element(input).scope(), value = exp(context);
                    if (exp.exp) { //version doesnt support exp.expressions && exp.expressions.length > 0
                        var getter = $parse(input.getAttribute('ng-model')), setter = getter.assign;
                        setter(context, values.indexOf(value) !== -1);
                    }                    
                    
                    //input.checked = values.indexOf(value) !== -1;
                });
            };

            // view -> model
            elm.bind('click', function (e) {
                if (angular.lowercase(e.target.nodeName) === 'input') {
                    var values = [], $modelValue = ngModel.$modelValue || [];
                    angular.forEach(elm.find('input'), function (input) {
                        if (input.checked) {
                            values.push(input.getAttribute('value'));
                        }
                        else {
                            var unChkIndex = $modelValue.indexOf(input.getAttribute('value'));
                            if (unChkIndex >= 0) {
                                $modelValue.splice(unChkIndex, 1);
                            }
                        }
                    });

                    ngModel.$setViewValue(values);
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                }
            });

            function onUpdatelayout(oldValue, newValue) {
                ngModel.$render();
                watchModelValue(); //detach
            };

            //need to check it is not firing
            var watchModelValue = scope.$watch(ngModel.$modelValue, onUpdatelayout);
        }
    };
}]);
})();;angular.module('metrics.global.directive').directive("tooltipTemplate", ['$compile','constant',function ($compile, constant) {
    var contentContainer;
    return {
        restrict: "A",
        scope: {
            tooltipScope: "=",
            tooltipAppendElement: '@'
        },
        link: function (scope, element, attrs) {
            var templateUrl = attrs.tooltipTemplate;
            var scopeObjAttached, porkingArrowHeight = 25;
            var tooltipElement = angular.element("<div custom-popup ng-style='{top: tooltip.pos.y, left: tooltip.pos.x}' ng-hide='tooltip.hidden' style='position:absolute;width:100%;'></div>");
            tooltipElement.append("<div custom-popup-template style='position:absolute;width:100%;' ng-include='\"" + templateUrl + "\"'></div>");
            var tooltipAppendElement;
            //add popup to parent container always . otherwise need to change the pos
            if (attrs.tooltipAppendElement) {
                tooltipAppendElement = angular.element($(attrs.tooltipAppendElement));
            } else {
                tooltipAppendElement = element.parent();
            }
            var popUp = angular.element($("[custom-popup]"));
            if (!popUp || popUp.length == 0) {
                tooltipAppendElement.append(tooltipElement);
                scopeObjAttached = scope;
                var newScope = scope.$new(true);
                newScope.tooltip = {};
                newScope.tooltip.constant = constant;
                newScope.tooltip.hidden = true;
                $compile(tooltipElement.contents())(newScope);
                $compile(tooltipElement)(newScope);
            }

            popUp = null;

            var toggleVisible = function (hidden, pos) {
                var targetScope = angular.element($("[custom-popup]")).scope();
                if (targetScope) {
                    targetScope.tooltip.hidden = hidden;
                    if (!hidden) {                        
                        targetScope.tooltip.tooltipDataContext = angular.copy(scope.tooltipScope);
                        targetScope.tooltip.pos = pos;
                    }
                }
                if (!scope.$$phase) {
                    scope.$apply();
                }
            }
            var onMouseEnter = function (ev) {
                var pos = { x: ev.pageX - (ev.offsetX || 0) + ev.currentTarget.offsetWidth, y: ev.pageY - (ev.offsetY || 0) - ev.currentTarget.offsetHeight - porkingArrowHeight };
                toggleVisible(false, pos);
            };

            var onMouseLeave = function (ev) {                
                toggleVisible(true);
            };

            element.bind('mouseenter', onMouseEnter);
            element.bind('mouseleave', onMouseLeave);

            scope.$on('$destroy', function () {
                if (angular.equals(scope, scopeObjAttached)) {
                    if (tooltipElement) {
                        tooltipElement.remove();
                    }
                }
                element.unbind('mouseenter', onMouseEnter);
                element.unbind('mouseleave', onMouseLeave);
            });
            //unbind while destory
        }
    };

}]);;(function () {
    angular.module("metrics.global").config(['constantProvider', function (constantProvider) {

        var error = {};

        //Common error code starts from 1000 to 1500    
        //UI error code starts from 1500 to 2000
        error.ErrorCode = {
            //defaut error code
            '404': 'Service unavailable. Please contact administrator.',
            '401': 'Unauthorized. Request denied',

            //Common error code starts from 1000 to 1500 
            '1000': 'Data invalid',
            '1001': 'Unhandled exception occured.',
            '1002': 'Error occured in service invocation.',

            //UI Constants
            '5001': 'Error occured while saving the product'
        };

        error.CommonErrorConstant = {
            'UNAUTHORIZED': error.ErrorCode['401'],
            'SERVICE_UNAVAILABLE': error.ErrorCode['404'],
            'DATA_INVALID': error.ErrorCode['1000'],
            'UNHANDLED_EXP': error.ErrorCode['1001'],
            'SERVICE_INVOCATION_ERR': error.ErrorCode['1002']
        };

        constantProvider.configureConstant(error);
        return;

    }]);
})();;(function () {
    angular.module("metrics.global").config(['constantProvider', 'apiUrlConfigProvider','appsettingsConstant', function (constantProvider, apiUrlConfigProvider, appsettingsConstant) {

        var constant = {}, apiUrlConfig = apiUrlConfigProvider.getEnvironment();

        constant.common = {
            DATE_FORMAT: 'date:\'MM/dd/yyyy HH:mm:ss\'',
            CONFIRMATION: 'Confirmation', //dialog header
            BAD_RESPONSE_FORMAT: 'Response format is wrong.',
            BAD_REQUEST_FORMAT: 'Request format is wrong.',
            RESPONSE_SUCCESS: 'SUCCESS',
            RESPONSE_FAILED: 'FAILED',
            FILTER_TITLE: 'Filter',
            UNDEFINED: 'Object is undefined',
            LOGGIN_REDIRECT_PATH: '/identity/?ref='
        };

        constant.dashboard = {            
            //Router config
            DASHBOARD_ROUTER_NAME: 'dashboard',
            DASHBOARD_ROUTER_URL: apiUrlConfig.appBaseUrl + 'lang/:lang/:storyType/:projectName/dashboard/:story_id',
            HOME_ROUTER_NAME: 'home',
            HOME_ROUTER_URL:apiUrlConfig.appBaseUrl + 'home',
            DEFAULT_ROUTER_URL:apiUrlConfig.appBaseUrl + 'home'
        };
        
        constant.details = {            
            //Router config
            DUPLICATION_DETAILS_ROUTER_NAME: 'duplication-details',
            DUPLICATION_DETAILS_ROUTER_URL: apiUrlConfig.appBaseUrl + 'lang/:lang/:storyType/:projectName/details/duplication/:story_id'
        };

        constant.issue = {            
            //Router config
            ISSUE_DETAILS_ROUTER_NAME: 'issue-details',
            ISSUE_DETAILS_ROUTER_URL: apiUrlConfig.appBaseUrl + 'lang/:lang/:storyType/:projectName/details/issue/:story_id'
        };

        constant.publisherEventPayLoad = {
            SHOW_NOTIFY_COMMAND: 'notificationStart',
            TRIGGER_DEVICE_FILTER: 'applyDeviceFilter',
            REFRESH_DEVICE_DETAIL: 'statusChanged'
        };

        constantProvider.configureConstant(constant);
    }]);
})();;'use strict';
(function () {
    angular.module('metrics.global')
        .run(['routehelper', 'constant', function (routehelper, constant) {

            var error = {
                name: 'error',
                url: '/error',
                template: '<div>Error occured.</div>'
            };
            var home = {
                name: constant.dashboard.HOME_ROUTER_NAME,
                url: constant.dashboard.HOME_ROUTER_URL,
                template: '<div></div>'
            };
            var states = [home, error];

            routehelper.configureStates(states);

            //while page loads, if no router url matches, the below router is being set.
            routehelper.configureRoutes([{ url: '/', redirectTo: constant.dashboard.DEFAULT_ROUTER_URL }]);

            return;

        }]);
})();;(function () {
    angular.module('metrics.global.utility').factory('appUtility', function () {

        //Adding trim function
        if (typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            }
        }

        var showHideOverlay = function (value) {
            var overlayScope = angular.element($(".loader-backdrop")).scope();
            if (overlayScope) {
                overlayScope.show = value;
            }
        };
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        return {
            showHideOverlay:showHideOverlay,
            getRandomColor:getRandomColor
        };
    });
})();;(function () {
    angular.module('metrics.security.service', []);
    angular.module('metrics.security.privilege', []);
    angular.module('metrics.security.routePermission', []);

    angular.module('metrics.security', [
    'metrics.security.service',
    'metrics.security.privilege',
    'metrics.security.routePermission'
    ]);
})();;(function () {
    angular.module('metrics.security.service')
        .factory('securityApi', ['$resource', 'apiUrlConfig', function ($resource, apiUrlConfig) {
            var baseUrl = apiUrlConfig.metricsSecurityApiBaseUrl + '/:dest/:userId';
            return $resource(baseUrl, {}, {
                retrieveUser1: { method: 'GET', params: { dest: "retrieveUser" }},
                retrieveUser: { method: 'GET', params: { dest: "54a7f12f0f6c612900354fc6" }},
                retrieveRole: { method: 'GET', params: { dest: "user" }}
            });
        }]);
})();;(function () {
    angular.module("metrics.security.privilege").factory("securityAuthPrivilege", [
      "securityApi", "$q", function (securityApi, $q) {
          var promiseQueue, requestInProgress, service, triggerCallBackQueue;
          promiseQueue = [];
          requestInProgress = false;
          triggerCallBackQueue = function () {
              var len;
              requestInProgress = false;
              len = promiseQueue.length;
              while (len--) {
                  if (service.loggedUser) {
                      promiseQueue[len].resolve(service.loggedUser);
                  } else {
                      promiseQueue[len].reject();
                  }
              }
              promiseQueue = [];
          };
          service = {
              loggedUser: null,
              requestLoggedUser: function () {
                  var defer, loggedUserReq;
                  if (service.isLoggedUsrAvailable()) {
                      return $q.when(service.loggedUser);
                  } else {
                      if (requestInProgress) {
                          defer = $q.defer();
                          promiseQueue.push(defer);
                          return defer.promise;
                      }
                      requestInProgress = true;
                      loggedUserReq = securityApi.retrieveUser.apply(null, [].slice.call(arguments));

                      //coffee script didnt allow
                      loggedUserReq.$promise["catch"](function () {
                          triggerCallBackQueue();
                      });
                      return loggedUserReq.$promise.then(function (response) {
                          service.loggedUser = response.data.user;
                          triggerCallBackQueue();
                      });
                  }
              },
              isLoggedUsrAvailable: function () {
                  return !!service.loggedUser;
              },
              isEditRole: function () {
                  return !!(service.loggedUser && service.loggedUser.role && service.loggedUser.role.isEdit);
              },
              isReadRole: function () {
                  return !!(service.loggedUser && service.loggedUser.role && service.loggedUser.role.isRead);
              },
              isAdmin: function () {
                  return !!(service.loggedUser && service.loggedUser.isAdmin);
              },
              getLoginFailedReason: function () { }
          };
          return service;
      }
    ]);
})();
;(function () {
    angular.module('metrics.security.service').provider('security', [function () {
        return {

            //this will be used to call in config phase
            requireEditRoleUser: ['security', function (security) {
                return security.requireEditRoleUser();
            }],

            requireReadRoleUser: ['security', function (security) {
                return security.requireReadRoleUser();
            }],

            requireAdminRoleUser: ['security', function (security) {
                return security.requireAdminRoleUser();
            }],

            $get: ['securityAuthPrivilege', function (securityAuthPrivilege) {
                return {
                    requireEditRoleUser: function () {
                        var promise = securityAuthPrivilege.requestLoggedUser().then(function () {
                            return securityAuthPrivilege.isEditRole();
                        });
                        return promise;
                    },
                    requireReadRoleUser: function () {
                        var promise = securityAuthPrivilege.requestLoggedUser().then(function () {
                            return securityAuthPrivilege.isReadRole();
                        });

                        return promise;
                    },
                    requireAdminRoleUser: function () {
                        var promise = securityAuthPrivilege.requestLoggedUser().then(function () {
                            var isAdmin = securityAuthPrivilege.isAdmin();
                            //if (!isAdmin) { $state.go('error'); }
                            return isAdmin;
                        });

                        return promise;
                    },
                    requireAuthorizedUser: function () {
                        var promise = securityAuthPrivilege.requestLoggedUser().then(function () {
                            return securityAuthPrivilege.isLoggedUsrAvailable();
                        });

                        return promise;
                    }
                };
            }]
        };

    }]);

})();;'use strict';
(function () {
    angular.module('metrics.security.routePermission').provider('routeAccessPermission', [function () {
        return {

            $get: ['security', 'securityAuthPrivilege', '$state', function (security, securityAuthPrivilege, $state) {
                return {
                    requireEditRole: function () {
                        var promise = security.requireEditRoleUser().then(function (isEdit) {
                            if (!isEdit) {
                                var access;
                                //$state.go('error');
                            }
                            return isEdit;
                        });
                        return promise;
                    },
                    requireAdminRole: function () {
                        var promise = security.requireAdminRoleUser().then(function (isAdmin) {
                            if (!isAdmin) { //$state.go('error'); 
                                var access;
                            }
                            return isAdmin;
                        });

                        return promise;
                    }
                };
            }]
        };

    }]);

})();;(function () {
    angular.module("metrics.layout.controller", []);
    angular.module("metrics.layout.directive", []);
    angular.module("metrics.layout.services", []);

    angular.module("metrics.layout", [
    'metrics.layout.controller',
    'metrics.layout.directive',
    'metrics.layout.services'
    ]);
})();;(function () {
    angular.module('metrics.layout.controller')
        .controller('shellCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings','routehelper','$route', '$document','metricsMetadataService', '$state',
            function ($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document, metricsMetadataService, $state) {
                var vm =this, log = logger.getInstance('Shell Control');
                log.log('Initializing shell control');
                                
                vm.CONST = constant;
                vm.showNav = true;
                vm.getCurrentRouterState = function () {
                    var value = routehelper.getCurrentState();
                    return value;
                };
                vm.isSpecificPage = function(specificPages, path) {
                    var path, ref;
                    path = path || $location.path();                    
                    return (ref = specificPages.indexOf(path) >= 0) != null ? ref : {
                    1: -1
                    };
                };
                
                vm.visibleNavRouterStateLst = [constant.dashboard.DASHBOARD_ROUTER_NAME, constant.dashboard.HOME_ROUTER_NAME];
                vm.visibleHeaderRouterLst = ['/404', '/page/404', '/page/500', '/page/login', '/page/signin', '/page/signin1', '/page/signin2', '/page/signup', '/page/signup1', '/page/signup2', '/page/lock-screen'];
                
                vm.main = {
                    brand: 'CRITERION',
                    name: 'Lisa Doe'
                };
                vm.getNavigationList = function () {
                    metricsMetadataService.getNavigationList({}, function (response) {
                        if (response && response.length > 0) {
                            vm.navList = response;
                        }
                    });
                }

                vm.onStateChange = function (routerName, stateParam, $event) {
                    $event && $event.preventDefault();
                    routehelper.goToState(routerName, stateParam);
                }

                vm.getNavigationList();
                
                $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                    vm.showNav = vm.isSpecificPage(vm.visibleNavRouterStateLst, toState.name);
                 });
                
                $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
                    //default route
                    if(currentRoute && currentRoute.$$route && currentRoute.$$route.url == '/'){
                        vm.showNav = true;
                    }
                    else{
                        var currentState = vm.getCurrentRouterState()
                        if(currentState)
                        {
                            vm.showNav = vm.isSpecificPage(vm.visibleNavRouterStateLst, currentState.name);
                        }
                    }
                    if ($document && $document.scrollTo) {
                        return $document.scrollTo(0, 0);
                    }
                });
                
                //throw new exceptionHandler.WarningError('Unhandled exception');
                //$rootScope.$broadcast(constant.publisherEventPayLoad.SHOW_NOTIFY_COMMAND, new exceptionHandler.SuccessAlert('success '));
                //$rootScope.$broadcast(constant.publisherEventPayLoad.SHOW_NOTIFY_COMMAND, new exceptionHandler.SuccessAlert('dfsdfsd  sdf sdf sdf sdf sd '));
                
            }]).controller('NavCtrl', ['$scope', function($scope) {
                
                
            }]);
})();;(function () {
    angular.module('metrics.layout.directive').directive('imgHolder', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return Holder.run({
            images: ele[0]
          });
        }
      };
    }
  ]).directive('customBackground', function() {
    return {
      restrict: "A",
      controller: [
        '$scope', '$element', '$location', function($scope, $element, $location) {
          var addBg, path;
          path = function() {
            return $location.path();
          };
          addBg = function(path) {
            $element.removeClass('body-home body-special body-tasks body-lock');
            switch (path) {
              case '/':
                return $element.addClass('body-home');
              case '/404':
              case '/page/404':
              case '/page/500':
              case '/page/signin':
              case '/page/signup':
                return $element.addClass('body-special');
              case '/page/lock-screen':
                return $element.addClass('body-special body-lock');
              case '/tasks':
                return $element.addClass('body-tasks');
            }
          };
          addBg($location.path());
          return $scope.$watch(path, function(newVal, oldVal) {
            if (newVal === oldVal) {
              return;
            }
            return addBg($location.path());
          });
        }
      ]
    };
  }).directive('uiColorSwitch', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.find('.color-option').on('click', function(event) {
            var $this, hrefUrl, style;
            $this = $(this);
            hrefUrl = void 0;
            style = $this.data('style');
            if (style === 'loulou') {
              hrefUrl = 'styles/main.css';
              $('link[href^="styles/main"]').attr('href', hrefUrl);
            } else if (style) {
              style = '-' + style;
              hrefUrl = 'styles/main' + style + '.css';
              $('link[href^="styles/main"]').attr('href', hrefUrl);
            } else {
              return false;
            }
            return event.preventDefault();
          });
        }
      };
    }
  ]).directive('toggleMinNav', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var $window, Timer, app, updateClass;
          app = $('#app');
          $window = $(window);
          ele.on('click', function(e) {
            if (app.hasClass('nav-min')) {
              app.removeClass('nav-min');
            } else {
              app.addClass('nav-min');
              $rootScope.$broadcast('minNav:enabled');
            }
            return e.preventDefault();
          });
          Timer = void 0;
          updateClass = function() {
            var width;
            width = $window.width();
            if (width < 768) {
              return app.removeClass('nav-min');
            }
          };
          return $window.resize(function() {
            var t;
            clearTimeout(t);
            return t = setTimeout(updateClass, 300);
          });
        }
      };
    }
  ]).directive('collapseNav', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var $a, $aRest, $lists, $listsRest, app;
          $lists = ele.find('ul').parent('li');
          $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>');
          $a = $lists.children('a');
          $listsRest = ele.children('li').not($lists);
          $aRest = $listsRest.children('a');
          app = $('#app');
          $a.on('click', function(event) {
            var $parent, $this;
            if (app.hasClass('nav-min')) {
              return false;
            }
            $this = $(this);
            $parent = $this.parent('li');
            $lists.not($parent).removeClass('open').find('ul').slideUp();
            $parent.toggleClass('open').find('ul').slideToggle();
            return event.preventDefault();
          });
          $aRest.on('click', function(event) {
            return $lists.removeClass('open').find('ul').slideUp();
          });
          return scope.$on('minNav:enabled', function(event) {
            return $lists.removeClass('open').find('ul').slideUp();
          });
        }
      };
    }
  ]).directive('highlightActive', [
    function() {
      return {
        restrict: "A",
        controller: [
          '$scope', '$element', '$attrs', '$location', function($scope, $element, $attrs, $location) {
            var highlightActive, links, path;
            links = $element.find('a');
            path = function() {
              return $location.path();
            };
            highlightActive = function(links, path) {
              path = '#' + path;
              return angular.forEach(links, function(link) {
                var $li, $link, href;
                $link = angular.element(link);
                $li = $link.parent('li');
                href = $link.attr('href');
                if ($li.hasClass('active')) {
                  $li.removeClass('active');
                }
                if (path.indexOf(href) === 0) {
                  return $li.addClass('active');
                }
              });
            };
            highlightActive(links, $location.path());
            return $scope.$watch(path, function(newVal, oldVal) {
              if (newVal === oldVal) {
                return;
              }
              return highlightActive(links, $location.path());
            });
          }
        ]
      };
    }
  ]).directive('toggleOffCanvas', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.on('click', function() {
            return $('#app').toggleClass('on-canvas');
          });
        }
      };
    }
  ]).directive('slimScroll', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.slimScroll({
            height: '100%'
          });
        }
      };
    }
  ]).directive('goBack', [
    function() {
      return {
        restrict: "A",
        controller: [
          '$scope', '$element', '$window', function($scope, $element, $window) {
            return $element.on('click', function() {
              return $window.history.back();
            });
          }
        ]
      };
    }
  ]);
})(); 

;(function () {
    angular.module('metrics.layout.services')
        .factory('metricsMetadataService', ['$resource', 'apiUrlConfig', function ($resource, apiUrlConfig) {
            var baseUrl = apiUrlConfig.metricsApiBaseUrl + '/:controller/:dest/:action/:storyId';
            return $resource(baseUrl, {}, {
                getNavigationList: {
                    method: 'GET', params: { controller: 'getNavigationList'},
                    isArray: true
                }
            });
        }]);
})();;(function () {
    angular.module('metrics.dashboard.controller', []);
    angular.module('metrics.dashboard.service', []);
    angular.module('metrics.dashboard.directive', []);
    angular.module('metrics.dashboard.filter', []);
    angular.module('metrics.dashboard', [
    'metrics.dashboard.controller',
    'metrics.dashboard.service',
    'metrics.dashboard.directive',
    'metrics.dashboard.filter'
    ]);
})();;'use strict';
(function () {
    angular.module('metrics.dashboard')
        .run(['routehelper', 'constant', 'routeAccessPermission', '$state',
            function (routehelper, constant, routeAccessPermission) {

            var dashboard = {
                name: constant.dashboard.DASHBOARD_ROUTER_NAME,
                url: constant.dashboard.DASHBOARD_ROUTER_URL,
                templateUrl: 'app/dashboard/templates/dashboard.tpl.html',
                controller: 'dashboardCtrl',
                controllerAs: 'dashboardVM'
            };
            
            var states = [dashboard];

            routehelper.configureStates(states);
        }]);
})();;(function () {
    angular.module('metrics.dashboard.controller')
        .controller('dashboardCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document','metricsDashboardService','sharedService',
            function ($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document, metricsDashboardService, sharedService) {
                var vm = this, log = logger.getInstance('Dashboard Control');
                log.log('Initializing shell control');
                var story_id = routehelper.getStateParams('story_id'), lang = routehelper.getStateParams('lang');
                if (!story_id) {
                    return;
                }
                vm.routeParams = { 
                    storyType: routehelper.getStateParams('storyType'), 
                    projectName: routehelper.getStateParams('projectName'), 
                    story_id: routehelper.getStateParams('story_id'), 
                    lang: routehelper.getStateParams('lang') };
                var seriesCollection = [
                    { key: "LineOfCode", value:"loc", values: [] },
                    { key: "Function",value:'totalFunction', values: [] },
                    { key: "Cyclomatic", value: 'cyclomatic', values: [] }];
                vm.kFormatter= function(num) {
                    return num > 999 ? (num/1000).toFixed(1) + ' K' : num
                }
                vm.options = {
                    chart: {
                        type: 'multiBarChart',
                        height: 450,
                        margin: {
                            top: 20,
                            right: 20,
                            bottom: 50,
                            left: 45
                        },
                        clipEdge: true,
                        duration: 500,
                        showValues:true,
                        stacked: true,
                        color: ['#176799', '#42a4bb', '#78d6c7'], //'#1f77b4', 
                        useInteractiveGuideline: true,
                        /*reduceXTicks:false,*/
                        xAxis: {
                            axisLabel: 'Files',
                            showMaxMin: false,
                            tickFormat: function (d, index) {
                            return '';
                            }
                            //rotateLabels: 5
                        },
                        yAxis: {
                            axisLabel: 'LOC',
                            axisLabelDistance: -20,
                            tickFormat: function (d) {
                                return d3.format('d')(d);
                            }
                        }
                    }
                };

               
            

                    vm.getChartData = function () {
                    metricsDashboardService.retrieveLOCChartData({ story_Id: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            vm.data = generateData(response);
                        }
                    });
                    //retrieveRedundantChartData
                }


                vm.getDashboardData = function () {
                    metricsDashboardService.retrieveDashboardInfo({ story_Id: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            vm.dashboard = response[0];
                        }
                    });
                }
                /*Pie Chart */
                vm.violations = {};
                vm.totalViolationCount=0;
                vm.retrieveViolationCount = function () {
                    metricsDashboardService.retrieveViolationCount({ story_Id: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            var violation = [];  
                             vm.totalViolationCount=0;                          
                            response.map(function (d, i) {
                                vm.totalViolationCount += d.count;
                                vm.violations[d._id] = d.count;
                                violation.push({
                                    label: d._id,
                                    value: d.count
                                });
                            });
                            
                            vm.violationData = violation;
                        }
                    });
                };

                
                vm.getViolationDataByType = function (type) {
                    type = type || '';
                    if (!type) {
                        return;
                    }
                    if (vm.violationData && vm.violationData.length > 0) {
                        var len = vm.violationData.length;
                        while (len--) {
                            if (vm.violationData[len].label.toLowerCase() == type.toLowerCase()) {
                                return vm.violationData[len].value;
                            }
                        }
                    }
                }

                vm.issuesCount = function () {
                    metricsDashboardService.retrieveIssuesListCount({ story_Id: story_id, lang: lang }, function (response) {
                        var issueObj = { blocker: 0, critical: 0, major: 0, minor: 0 };
                        if (response && response.length > 0) {
                            response.map(function (issue, i) {
                                if (issue.cyclomatic > 20) {
                                    issueObj.blocker += issue.count;
                                }
                                else if (issue.cyclomatic > 10 && issue.cyclomatic <= 20) {
                                    issueObj.critical += issue.count;
                                }
                                else if (issue.cyclomatic > 4 && issue.cyclomatic <= 10) {
                                    issueObj.major += issue.count;
                                }
                                else if (issue.cyclomatic > 0 && issue.cyclomatic <= 4) {
                                    issueObj.minor += issue.count;
                                }                               
                            });
                            vm.issuesCountInfo = issueObj;
                        }
                    });
                };

                

                vm.pieChartoptions = {
                    chart: {
                        type: 'pieChart',
                        height: 300,
                        width:400,
                        donut: false,
                        showLabels: true,
                        labelType: 'none',
                        showLegend: true,
                        transitionDuration: 500,
                        labelThreshold: 0,
                        color: ['#ffb61c', '#e94b3b', '#2ec1cc'], //'#1f77b4',                         
                        duration: 500,
                        tooltip: {
                  enabled: true,
                  valueFormatter:(function (key) {
                              return '<p>' +   (key*100/ vm.totalViolationCount).toFixed(0)+ '%</p>';
                          })
                },
                        x:function(d){
                            return d.label.charAt(0).toUpperCase() + d.label.slice(1);
                        },
                        y:function(d){
                            return d.value;
                        },
                        legend: {
                            updateState:false,
                            margin: {
                                top: 5,
                                right: 80,
                                bottom: 5,
                                left: 10
                            }
                        },
                        callback: function(chart) {
                            chart.pie.dispatch.on('elementClick', function(e){
                             $scope.shellVM.onStateChange(constant.issue.ISSUE_DETAILS_ROUTER_NAME, vm.routeParams, null);

                        });
                       }
                    }
                };

                /* ------------- */


                /* ------------ Duplication  -------------- */

                vm.redundantDataOptions = {
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 500,
                        showControls: false,
                        showValues: true,
                        valueFormat:(d3.format('f')),
                        duration: 500,
                        color: ['#176799', '#42a4bb', '#78d6c7'],
                        showXAxis:false,
                        showLegend:false,
                        xAxis: {
                            showMaxMin: false,
                            tickFormat: function (d) {
                                return d;
                            }
                        },
                        yAxis: {
                            axisLabel: 'Duplication block count',
                            tickFormat: function (d) {
                                 return d3.format('d')(d);//d3.format(',.2f')(d);
                            }
                        },callback: function(chart) {
                            chart.multibar.dispatch.on('elementClick', function(e){
                                console.log('element: ' + e.data);
                             sharedService.setActivePath(e.data.x);
                             $scope.shellVM.onStateChange(constant.details.DUPLICATION_DETAILS_ROUTER_NAME, vm.routeParams, null);

                        });
                       }
                        
                    }
                };
                vm.getDuplicationCodeData = function () {
                    metricsDashboardService.retrieveRedundantChartData({ story_Id: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {
                            var series = [{ key: "Duplication", value: "duplication", values: [] }];
                            response.map(function (d, i) {
                                series[0].values.push({
                                    x: d._id,
                                    y:d.count
                                });
                            });

                            vm.sortObject(series[0].values);
                            vm.redundantData = series;
                        }
                    });
                }
                    vm.sortObject = function sortObject(arr) {
                    arr.sort(function(a, b) {
                        return a.y- b.y;
                    });
                    return arr; 
                };

               


                vm.getTestSummary = function () {
                    metricsDashboardService.retrieveTestSummary({ storyId: story_id }, function (response) {
                        if (response && response.length > 0) {
                            vm.testSummary = response[0].data.lastResult;
                        }
                    });
                    //retrieveRedundantChartData
                };
                vm.getTestReport = function () {
                    vm.testReportChart = {
                        "chart": {
                            "type": "lineChart",
                            "height": 450,
                            "margin": {
                                "top": 20,
                                "right": 20,
                                "bottom": 40,
                                "left": 55
                            },
                            "useInteractiveGuideline": true,
                            "dispatch": {},
                            "xAxis": {
                                "axisLabel": "Time (ms)"
                            },
                            "yAxis": {
                                "axisLabel": "Voltage (v)",
                                "axisLabelDistance": -10
                            }
                        }
                    };
                    //metricsDashboardService.retrieveTestReport({ storyId: story_id}, function (response) {
                    //    if (response && response.length > 0) {
                    //        vm.data = generateData(response);
                    //    }
                    //});
                    //retrieveRedundantChartData
                }
                /* ----------------------------------------- */
                vm.getDashboardData();
                vm.getChartData();
                vm.retrieveViolationCount();
                vm.getDuplicationCodeData();
                vm.issuesCount();
                vm.getTestSummary();
                function generateData(response) {                    
                   response[0].data.map(function (d, i) {
                       seriesCollection.map(function (item, index) {
                            item.values.push({
                                x: d.file.name,
                                y: item.value == "loc" ? d.file.aggregate.sloc.physical : d.file.aggregate[item.value]
                            });
                        });                       
                    });
                   return seriesCollection;
                }

            }]);
})();;(function () {
    angular.module('metrics.dashboard.service')
        .factory('metricsDashboardService', ['$resource', 'apiUrlConfig', function ($resource, apiUrlConfig) {
            var baseUrl = apiUrlConfig.metricsApiBaseUrl + '/:lang/:controller/:dest/:action/:story_Id';
            return $resource(baseUrl, {}, {
                retrieveLOCChartData: {
                    method: 'GET', params: { controller: 'loc', dest: 'chartData'},
                    isArray: true
                },
                retrieveDashboardInfo: {
                    method: 'GET', params: { controller: 'loc', dest: 'dashboard' },
                    isArray: true
                },
                retrieveRedundantChartData: {
                    method: 'GET', params: { controller: 'redundant', dest: 'chartData' },
                    isArray: true
                },
                retrieveViolationCount: {
                    method: 'GET', params: { controller: 'violationsCount', dest: 'chartData'},
                    isArray: true
                },
                retrieveIssuesListCount: {
                    method: 'GET', params: { controller: 'getIssuesListCount' },
                    isArray: true
                },
                retrieveTestSummary: {
                    method: 'GET', params: { controller: 'TestReport' },
                    isArray: true
                },
                retrieveTestReport: {
                    method: 'GET', params: { controller: 'TestReport' },
                    isArray: true
                }
                
            });
        }]);
})();;(function () {
    angular.module('metrics.details.controller', []);
    angular.module('metrics.details.service', []);
    angular.module('metrics.details.directive', []);
    angular.module('metrics.details.filter', []);
    angular.module('metrics.details', [
    'metrics.details.controller',
    'metrics.details.service',
    'metrics.details.directive',
    'metrics.details.filter'
    ]);
})();;'use strict';
(function () {
    angular.module('metrics.details')
        .run(['routehelper', 'constant', 'routeAccessPermission', '$state',
            function (routehelper, constant, routeAccessPermission) {

            var duplicationDetails = {
                name: constant.details.DUPLICATION_DETAILS_ROUTER_NAME,
                url: constant.details.DUPLICATION_DETAILS_ROUTER_URL,
                templateUrl: 'app/details/templates/duplication-details.tpl.html',
                controller: 'duplicationCodeDetailsCtrl',
                controllerAs: 'duplicationCodeDetailsVM'
            };
            var issue = {
                name: constant.issue.ISSUE_DETAILS_ROUTER_NAME,
                url: constant.issue.ISSUE_DETAILS_ROUTER_URL,
                templateUrl: 'app/details/templates/issue-details.tpl.html',
                controller: 'issueCodeDetailsCtrl',
                controllerAs: 'issueCodeDetailsVM'
            };
            var states = [issue,duplicationDetails];

            routehelper.configureStates(states);
            return;

        }]);
})();;(function() {
    angular.module('metrics.details.controller')
        .controller('duplicationCodeDetailsCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document',
            'metricsDetailsService', '$q', 'metricsDashboardService', 'modalService','sharedService', 'appUtility',
            function($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document,
                metricsDetailsService, $q, 
                metricsDashboardService, modalService, sharedService, appUtility) {
                var vm = this, log = logger.getInstance('Details Control'),
                story_id = routehelper.getStateParams('story_id'), 
                lang = routehelper.getStateParams('lang');
                vm.CONST = constant;
                vm.story_Type = routehelper.getStateParams('storyType');
                vm.project_Name = routehelper.getStateParams('projectName');                
                vm.duplicatedDiff = {};
                vm.parseInt = parseInt;
                vm.selectedIndex=null;
                if (!story_id) {
                    return;
                }
                vm.activePath=sharedService.getActivePath();
                
                var duration = 500,
                    transition = 200;
                vm.slimScrollOptions={
                    height: '300px',
                     }
                 
                vm.colorCode = [];
                getRandomColor = function(){
                // var color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
                 var color = 'rgb(' + (Math.floor((256-200)*Math.random()) + 200) + ',' + 
                                    (Math.floor((256-200)*Math.random()) + 200) + ',' + 
                                    (Math.floor((256-200)*Math.random()) + 200) + ')';
                    // var color = appUtility.getRandomColor();
                    if(vm.colorCode.indexOf(color) == -1)
                    {
                        return color;
                    }
                    else
                    {
                       return getRandomColor();
                    }
                }
               // vm.selectedFiles = 
           // var duplicationCodeDetailsVM.selectedIndex=duplicationCodeDetailsVM.duplicatedDiff[duplicationCodeDetailsVM.activePath][compareFile].src[key].dataIndex;
                vm.showDuplicatedModal = function(diffInstance, lineNo, lineObj) {
                    var modalInstance = modalService.showModal({
                        templateUrl: 'app/details/templates/duplicated-by-modal-window.tpl.html',
                        controller: 'duplicatedByModalCtrl',
                        controllerAs: 'duplicatedByModalVM',
                        windowClass: 'action-modal',
                        resolve: { modalParam: function () { return { diffInstance: diffInstance,
                            activePath:vm.activePath,
                            lineNo:lineNo,
                            lineObj:lineObj,
                            selectedFiles:vm.selectedFiles
                        } } }
                    });

                    modalInstance.then(function(selectedFiles) {
                        vm.selectedFiles = selectedFiles;
                    });
                }
                $q.all([
                    metricsDetailsService.retrieveRedundantDetailsLOCData({ story_Id: story_id, lang: lang }).$promise,
                    metricsDashboardService.retrieveDashboardInfo({ story_Id: story_id, lang: lang }).$promise
                ]).then(function(values) {
                    vm.duplicateLOCDetails = values[0];
                    vm.overallLOCDetails = values[1];
                    vm.totalDuplicatedLOC = 0, percentage = 0;
                    vm.duplicateLOCDetails.map(function(item, index) {
                        vm.totalDuplicatedLOC += item.totalDuplicatedLines;
                    })
                    percentage = vm.totalDuplicatedLOC / vm.overallLOCDetails[0].loc * 100;

                    drawDonutChart(
                        '#donut1',
                        percentage,
                        150,
                        150,
                        ".35em"
                    );
                }, function(reason) {

                });

                vm.retrieveDuplicationDiff = function() {
                    metricsDetailsService.retrieveRedundantDetailsDiff({ storyId: story_id }, function(response) {
                        if (response && response.length > 0) {
                            vm.dulpicationResource = response[0];
                            if(vm.activePath)
                            {
                                vm.getDuplicatedByWithDiff(vm.activePath);
                            }
                        }
                    });
                }

                vm.lineIntendation = function(stringValue){
                 
                  return stringValue.replace(/.{80}/g, "$&" + "\n" + "\t"+"\t");

                }
                
               
                /*vm.duplicatedDiff = function(stringValue){
                 
                  return stringValue.replace(/.{200}/g, "$&" + "\n" + "\t"+"\t");

                }*/


                vm.getDuplicatedByWithDiff = function(activePath) {
                    if(!activePath){
                        return;
                    }
                    vm.activePath = activePath;
                    if (!vm.duplicatedDiff[activePath]) {
                        vm.duplicatedDiff[activePath] = { diffs: [] };
                        var sourceInstance = vm.duplicatedDiff[activePath];
                        if (!activePath) { return; }
                        if (vm.dulpicationResource) {
                            vm.dulpicationResource.data.map(function(data, dataIndex) {
                                if(vm.dulpicationResource.data.length >= vm.colorCode.length){
                                    vm.colorCode.push(getRandomColor());
                                }
                                if (isduplicated(activePath, data.instances)) {                                    
                                    data.instances.map(function(instance, instanceIndex) {
                                        if (!sourceInstance.hasOwnProperty(instance.path)) {
                                            sourceInstance[instance.path] = {};
                                            sourceInstance[instance.path].lines = [];
                                            sourceInstance[instance.path].src = {};
                                            sourceInstance[instance.path].duplicatedBy = {};
                                        }
                                        sourceInstance[instance.path].lines.push(instance.lines);
                                    });
                                    data.diffs.map(function(diff, index) {
                                        var extractedSrc = extractSourceFromDiff(diff, sourceInstance, dataIndex, index);
                                        for (var key in extractedSrc) {
                                            angular.extend(sourceInstance[key].src, extractedSrc[key]);
                                        }
                                        if (diff['-'].path == diff['+'].path) {
                                            sourceInstance[activePath].duplicationOccuredInSameFile = true;
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
                
                function extractSourceFromDiff(diffInstance,sourceInstance, dataIndex, diffIndex) {
                    var extractedSource = {};
                    extractedSource[diffInstance['-'].path] = extractedSource[diffInstance['-'].path] || {};
                    extractedSource[diffInstance['+'].path] = extractedSource[diffInstance['+'].path] || {};
                    var srcLns = diffInstance.diff.split(/\r\n|\r|\n/g), minusStart = diffInstance['-'].lines[0],
                        plusStart = diffInstance['+'].lines[0], 
                        minusBlockName = diffInstance['-'].lines[0] + '-' + diffInstance['-'].lines[1] + '-' + diffIndex, 
                        plusBlockName = diffInstance['+'].lines[0] + '-' +  diffInstance['+'].lines[1] + '-' + diffIndex;
                    srcLns.map(function(ln, index) {                        
                        var lineObj = {statement: ln, duplicatedBy:{}};
                        if (ln.startsWith('-') || !ln.startsWith('+')) {
                            createLnObj(minusStart,ln,diffInstance['-'], diffInstance['+'], 
                            extractedSource, sourceInstance, dataIndex, minusBlockName);
                            ++minusStart;
                        }
                        if (ln.startsWith('+') || !ln.startsWith('-')) {
                            createLnObj(plusStart,ln,diffInstance['+'], diffInstance['-'], 
                            extractedSource, sourceInstance, dataIndex, plusBlockName);
                            ++plusStart;
                        }

                    });
                    return extractedSource;
                }
                function createLnObj(lnNo,lnStatement, diffInstance1, diffInstance2, 
                extractedSource, sourceInstance, dataIndex, blockName)
                {
                    if(lnStatement.startsWith('-') || lnStatement.startsWith('+')) {
                        lnStatement = lnStatement.substring(1, lnStatement.length);

                    }
                    lineObj = {statement: lnStatement, duplicatedBy:{}, blockName:blockName, dataIndex:dataIndex};
                    lineObj.duplicatedBy[diffInstance2.lines[0]+ '-' + diffInstance2.lines[1]+ '-' + diffInstance1.path] = diffInstance2;
                    sourceInstance[diffInstance1.path].src[lnNo] && angular.extend(lineObj.duplicatedBy,sourceInstance[diffInstance1.path].src[lnNo].duplicatedBy);
                    sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path] = sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path] || {};
                    sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path][diffInstance2.lines[0] + '-' + diffInstance2.lines[1]] = 0;
                    extractedSource[diffInstance1.path][lnNo] = lineObj;
                }
                function isduplicated(lookUpPath, instances) {
                    var duplicatedArr = instances.filter(function(instance) {
                        if (instance.path == lookUpPath) {
                            return true;
                        }
                        return false;
                    });
                    var result = duplicatedArr.length > 0 ? true : false;
                    return result;
                }

                function drawDonutChart(element, percent, width, height, text_y) {
                    width = typeof width !== 'undefined' ? width : 290;
                    height = typeof height !== 'undefined' ? height : 290;
                    text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

                    var dataset = {
                        lower: calcPercent(0),
                        upper: calcPercent(percent)
                    },
                        radius = Math.min(width, height) / 2,
                        pie = d3.layout.pie().sort(null),
                        format = d3.format(".0%");

                    var arc = d3.svg.arc()
                        .innerRadius(radius - 30)
                        .outerRadius(radius);

                    var svg = d3.select(element).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    var path = svg.selectAll("path")
                        .data(pie(dataset.lower))
                        .enter().append("path")
                        .attr("class", function(d, i) { return "color" + i })
                        .attr("d", arc)
                        .each(function(d) { this._current = d; }); // store the initial values

                    var text = svg.append("text")
                        .attr("text-anchor", "middle")
                        .attr("dy", text_y);

                    if (typeof (percent) === "string") {
                        text.text(percent);
                    }
                    else {
                        var progress = 0;
                        var timeout = setTimeout(function() {
                            clearTimeout(timeout);
                            path = path.data(pie(dataset.upper)); // update the data
                            path.transition().duration(duration).attrTween("d", function(a) {
                                // Store the displayed angles in _current.
                                // Then, interpolate from _current to the new angles.
                                // During the transition, _current is updated in-place by d3.interpolate.
                                var i = d3.interpolate(this._current, a);
                                var i2 = d3.interpolate(progress, percent)
                                this._current = i(0);
                                return function(t) {
                                    text.text(format(i2(t) / 100));
                                    return arc(i(t));
                                };
                            }); // redraw the arcs
                        }, 200);
                    }
                };

                function calcPercent(percent) {
                    return [percent, 100 - percent];
                };
                $scope.$on('$destroy', function(){
                    sharedService.setActivePath('');
                });

              vm.onStateChange = function (routerName) {
                    var stateParam={ storyType: vm.story_Type,
                     projectName: vm.project_Name, story_id: story_id, lang:lang};
                    routehelper.goToState(routerName, stateParam);
                }
                
                 
                    /*vm.closeDiv = function hide(target) {
    document.getElementById(target).style.display = 'none';
}*/
               
                

        /*vm.genpdf= function(){
                html2canvas(document.body,{
                onrendered:function(canvas){
                var img=canvas.toDataURL('image/png');
                var doc=new jsPDF('l', 'mm', [350, 250]);
                doc.addImage(img,'JPEG',20,20);
                doc.save("details.pdf");
                }
                });
                };*/

                vm.retrieveDuplicationDiff();
              


            }]);
})();;(function() {
    angular.module('metrics.details.controller')
        .controller('issueCodeDetailsCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document',
            'metricsDetailsService', '$q', 'metricsDashboardService', 'modalService','sharedService','$compile',
            function($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document,
                metricsDetailsService, $q, metricsDashboardService, modalService, sharedService,$compile) {
                var vm = this, log = logger.getInstance('Details Control'),
                story_id = routehelper.getStateParams('story_id'), 
                lang = routehelper.getStateParams('lang');
                vm.CONST = constant;
                vm.story_Type = routehelper.getStateParams('storyType');
                vm.project_Name = routehelper.getStateParams('projectName');  
                vm.violations={};
                var duration = 500,
                    transition = 200;
                vm.slimScrollOptions={
                    height:'290px'
                };
               

               vm.retrieveViolationCount = function () {
                    metricsDashboardService.retrieveViolationCount({ story_Id: story_id, lang: lang }, function (response) {
                        if (response && response.length > 0) {                           
                            response.map(function (d, i) {
                                vm.violations[d._id] = d.count;                               
                            });
                            var percentage=vm.violations.error/(vm.violations.info+vm.violations.warning+vm.violations.error)*100;

                            drawDonutChart(
                                    '#donut1',
                                    percentage,
                                    150,
                                    150,
                                    ".35em"
                                );
                        }
                    });

                };

                vm.pmdreport = function () {
                    metricsDetailsService.pmdreport({ storyId: story_id}, function (response) {
                            vm.pmdinfo = [];
                            if (response && response.length > 0) {
                            vm.pmdlist = response[0];
                          //  var filename  =issue.file.name;
                            //    var  fileConvert=filename.replace("coffee-files/","")                             
                             //    pmdobj.name = fileConvert;


                             vm.pmdlist.data.map(function (issue, i) {
                                
                               var pmdobj = {blockers:0,critical:0,major:0,minor:0,info:0,warning:0};
                               if (issue.file.violations.length > 0) {
                                 pmdobj.name = issue.file.name;
                                  issue.file.violations.map(function (violationitem, i) {
                                if (violationitem.priority === "info") {
                                    pmdobj.info +=1;
                                }

                                else if (violationitem.priority === "warning") {
                                    pmdobj.warning +=1;
                                }
                                    
                                else if (violationitem.complexityCyclomatic >20) {
                                    pmdobj.blockers +=1;
                                }
                                 else if (violationitem.complexityCyclomatic >10 && violationitem.complexityCyclomatic<=20 ) {
                                    pmdobj.critical +=1;
                                }
                                else if (violationitem.complexityCyclomatic >4 && violationitem.complexityCyclomatic<=10 ) {
                                    pmdobj.major +=1;
                                }
                                else if (violationitem.complexityCyclomatic >0 && violationitem.complexityCyclomatic<=4 ) {
                                    pmdobj.minor +=1;
                                }
                                  });
                                  
                                vm.pmdinfo.push(pmdobj);
                                }                      
                                 
                            });
                        }
                        /*if (vm.pmdinfo.length >6) {
                            vm.slimScrollOptions={
                                height: ". !important",
                                size: "7px",
                                alwaysVisible: true
                            }
                        }
                         else{
                                vm.slimScrollOptions={
                                height: "500px !important",
                                size: "7px",
                                alwaysVisible: true
                            } 
                        }*/
                        
                    });
                };

                


                function drawDonutChart(element, percent, width, height, text_y) {
                    width = typeof width !== 'undefined' ? width : 290;
                    height = typeof height !== 'undefined' ? height : 290;
                    text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

                    var dataset = {
                        lower: calcPercent(0),
                        upper: calcPercent(percent)
                    },
                        radius = Math.min(width, height) / 2,
                        pie = d3.layout.pie().sort(null),
                        format = d3.format(".0%");

                    var arc = d3.svg.arc()
                        .innerRadius(radius - 30)
                        .outerRadius(radius);

                    var svg = d3.select(element).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    var path = svg.selectAll("path")
                        .data(pie(dataset.lower))
                        .enter().append("path")
                        .attr("class", function(d, i) { return "color" + i })
                        .attr("d", arc)
                        .each(function(d) { this._current = d; }); // store the initial values

                    var text = svg.append("text")
                        .attr("text-anchor", "middle")
                        .attr("dy", text_y);

                    if (typeof (percent) === "string") {
                        text.text(percent);
                    }
                    else {
                        var progress = 0;
                        var timeout = setTimeout(function() {
                            clearTimeout(timeout);
                            path = path.data(pie(dataset.upper)); // update the data
                            path.transition().duration(duration).attrTween("d", function(a) {
                                // Store the displayed angles in _current.
                                // Then, interpolate from _current to the new angles.
                                // During the transition, _current is updated in-place by d3.interpolate.
                                var i = d3.interpolate(this._current, a);
                                var i2 = d3.interpolate(progress, percent)
                                this._current = i(0);
                                return function(t) {
                                    text.text(format(i2(t) / 100));
                                    return arc(i(t));
                                };
                            }); // redraw the arcs
                        }, 200);
                    }
                };
     
                function calcPercent(percent) {
                    return [percent, 100 - percent];
                };

                $scope.selectedRow = null;  // initialize our variable to null
                

                vm.expandIssue=function(event,index, filName){   
                    vm.issueElement= true;
                    $scope.selectedRow = index;
                    $scope.fileName = filName;
                    //$scope.fileName = filName.substr(filName.lastIndexOf('/') + 1);                  
                    var pmd=angular.element(event.target).scope();
                     vm.pmdlist.data.map(function (issue, i) {
                         if(issue.file.name==pmd.file.name)
                           vm.pmdIssue=issue.file.violations;
                     });                
                        
                    };

                    vm.onStateChange = function (routerName) {
                    var stateParam={ storyType: vm.story_Type,
                     projectName: vm.project_Name, story_id: story_id, lang:lang};
                    routehelper.goToState(routerName, stateParam);
                }


                    /*vm.genpdf= function(){
                html2canvas(document.body,{
                onrendered:function(canvas){
                var img=canvas.toDataURL('image/png');
                var doc=new jsPDF('l', 'mm', [350, 250]);
                doc.addImage(img,'JPEG',20,20);
                doc.save("issue.pdf");
                }
                });
                };*/
                
              

                vm.retrieveViolationCount();
                vm.pmdreport();

            }]);
})();;(function () {
    angular.module('metrics.details.controller')
        .controller('duplicatedByModalCtrl', ['constant','modalService',
    'routehelper', 'rx.exceptionHandler', '$timeout', '$rootScope','$modalInstance','modalParam',
    function (constant, modalService,
        routehelper, exceptionHandler, $timeout, $rootScope, $modalInstance, modalParam) {
        var self = this;
        self.lineNo = modalParam.lineNo;
        self.header = "Duplicated By";
        self.selectedFiles = angular.copy(modalParam.selectedFiles) || [];
        if(!modalParam && modalParam.diffInstance){
            return; 
        }
        self.duplicationOccuredInSameFile = modalParam.diffInstance.duplicationOccuredInSameFile;
        self.activePath = modalParam.activePath;
        self.buttons = [{ label: 'Compare', result: 'compare', cssClass: 'btn-primary' }, { label: 'Cancel', result: 'no', cssClass: 'btn-warning' }];
                
        self.onButtonClick = function (result) {
            if(result == "compare"){
                $modalInstance.close(this.selectedFiles);
            }
            else{
                this.close();
            }
        };
        self.selectAll = function(isSelectAll){
            this.selectedFiles = [];
            if(isSelectAll)
            {           
                for(var key in this.duplicatedBy){
                    this.selectedFiles.push(key);
                }
            }
        }
        self.onFileChckChange = function(){
            for(var key in this.copyOfDuplicatedBy){
                if(!this.copyOfDuplicatedBy[key].isSelected)
                {
                    this.isSelectAll = false;
                    return;
                }
            }
            this.isSelectAll = true;
        }
        self.setSelectAll = function(){            
            for(var i in self.selectedFiles)
            {
                if(self.copyOfDuplicatedBy[self.selectedFiles[i]])
                {
                    self.copyOfDuplicatedBy[self.selectedFiles[i]].isSelected =true;
                }
            }
            if(self.selectedFiles.length > 0){
                self.isSelectAll = Object.keys(self.duplicatedBy).length == self.selectedFiles.length
            }
        }
        self.close = function () {
            $modalInstance.dismiss();
        };
        self.extractDuplicatedFiles  = function(diffInstance){
            self.duplicatedBy =  diffInstance.duplicatedBy; 
            self.copyOfDuplicatedBy = angular.copy(self.duplicatedBy);
            self.setSelectAll();
        }
        
        self.extractDuplicatedFileFromLineObj  = function(duplicatedLinesInstance){
            var obj ={};
            for(var key in duplicatedLinesInstance)
            {
                var encodedLine = duplicatedLinesInstance[key].lines[0] + '-' + duplicatedLinesInstance[key].lines[1];
                if(!obj.hasOwnProperty(duplicatedLinesInstance[key].path))
                {
                    obj[duplicatedLinesInstance[key].path] = {};
                }
                obj[duplicatedLinesInstance[key].path][encodedLine]=0;
            }
            self.duplicatedBy = obj;
            self.copyOfDuplicatedBy = angular.copy(self.duplicatedBy);
            self.setSelectAll();    
        }
        if(self.lineNo)
        {
            blockNameSplit = modalParam.lineObj.blockName.split('-');
            self.selectedBlockName =  blockNameSplit[0] + '-' + blockNameSplit[1];
            self.extractDuplicatedFileFromLineObj(modalParam.lineObj.duplicatedBy);
        }
        else{
        self.extractDuplicatedFiles(modalParam.diffInstance);
        }
    }]);
})();;(function () {
    angular.module('metrics.details.service')
        .factory('metricsDetailsService', ['$resource', 'apiUrlConfig', function ($resource, apiUrlConfig) {
            var baseUrl = apiUrlConfig.metricsApiBaseUrl + '/:lang/:controller/:dest/:action/:story_Id';
            return $resource(baseUrl, {}, {
                retrieveRedundantDetailsLOCData: {
                    method: 'GET', params: { controller: 'redundant', dest: 'details', action:'loc' },
                    isArray: true
                },
                retrieveRedundantDetailsDiff: {
                    method: 'GET', params: { controller: 'redundantcodemetrics'},
                    isArray: true
                },
                pmdreport: {
                    method: 'GET', params: { controller: 'pmdreport' },
                    isArray: true
                }
            });
        }]);
})();;(function () {
    angular.module('metrics.shared.service', []);
    angular.module('metrics.shared', [
    'metrics.shared.service'
    ]);
})();;(function () {
    angular.module('metrics.shared.service')
        .factory('sharedService',['$rootScope', function ($rootScope) {
            var sharedService = {};

            setActivePath = function(path) {
                sharedService.activePath = path;                
            };
            getActivePath = function() {
                return sharedService.activePath;
            };

            return {
                setActivePath:setActivePath,
                getActivePath:getActivePath
            };
        }]);
})();;(function () {
    angular.module('app', [
    'metrics.core',
    'metrics.global',
    'metrics.security',
    'metrics.layout',
    'metrics.dashboard',
    'metrics.details',
    'metrics.shared',
    //'templates-metrics_ui'
    ]);
})();
;(function () {
    'use strict';
    angular.module('metrics.core').provider('routehelperConfig', [function() {
            var config = {
                //To avoid writtig authentcation for each route.
                resolveAlways: (function () {
                    return {
                        isUserAuthenticate: function () {
                            return true;
                        }
                    };
                })(),
                isAdmin:false
            };           

            this.$get = function () {
                return config;
            };
            return;
        }])
        .provider('routehelper', ['$routeProvider', 'routehelperConfigProvider', '$stateProvider', function ($urlRouterProvider, routehelperConfig, $stateProvider) {
            
            var configureDefaultRouter = function configureDefaultRouter(url) {                
                $urlRouterProvider.otherwise({ redirectTo: url });
            };            

            var iterateItemToConfigure = function (source, provider) {
                if (angular.isUndefined(provider) || provider === null) {
                    //throw an excpetion
                    return;
                }

                source.forEach(function (src) {
                    src.resolve = angular.extend(src.resolve || {}, routehelperConfig.$get().resolveAlways || {});
                    if ($urlRouterProvider === provider) {
                        $urlRouterProvider.when(src.url, src);
                    }
                    else if($stateProvider === provider) {
                        $stateProvider.state(src);
                    };
                });
            }

            var configureRoutes = function (routes) {
                iterateItemToConfigure.apply(null, [routes, $urlRouterProvider]);                
            };

            var configureStates = function (states) {
                iterateItemToConfigure.apply(null, [states, $stateProvider]);
            };

            function getRoutes($route) {
                return function () { return iterateItem($route.routes) };
            }

            var iterateItem = function (iterateSource) {
                var routes = [];
                for (var prop in iterateSource) {
                    if (iterateSource.hasOwnProperty(prop)) {
                        var route = iterateSource[prop];
                        var isRoute = !!route.name;
                        if (isRoute) {
                            routes.push(route);
                        }
                    }
                }
                return routes;
            }

            function getStates($state) {
                return function () { return iterateItem($state.get()); }
            }

            function getStateParams($state) {
                return function (key) {
                    return $state.params[key] || "";
                }
            }
            function getCurrentState($state) {
                return function (key) {
                    return $state.current || "";
                }
            }
            
            function goToState($state) {
                return function () {
                    $state.go.apply(null, [].slice.call(arguments));
                }
            }

            this.$get = ['$route', '$state', function ($route, $state) {
                return {
                    configureRoutes: configureRoutes,
                    getRoutesList: getRoutes($route),
                    getStatesList: getStates($state),
                    configureStates: configureStates,
                    getStateParams: getStateParams($state),
                    goToState: goToState($state),
                    getCurrentState :getCurrentState($state)
                }
            }];
            return;
        }]);
})();
;(function() {
    angular.module('metrics.details.controller')
        .controller('duplicationCodeDetailsCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document',
            'metricsDetailsService', '$q', 'metricsDashboardService', 'modalService','sharedService', 'appUtility',
            function($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document,
                metricsDetailsService, $q, 
                metricsDashboardService, modalService, sharedService, appUtility) {
                var vm = this, log = logger.getInstance('Details Control'),
                story_id = routehelper.getStateParams('story_id'), lang = routehelper.getStateParams('lang');
                
                vm.duplicatedDiff = {};
                vm.parseInt = parseInt;
                vm.selectedIndex=null;
                if (!story_id) {
                    return;
                }
                vm.activePath=sharedService.getActivePath();
                
                var duration = 500,
                    transition = 200;
                vm.slimScrollOptions={
                    height: '300px',
                     }
                 
                vm.colorCode = [];
                getRandomColor = function(){
                // var color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
                 var color = 'rgb(' + (Math.floor((256-200)*Math.random()) + 200) + ',' + 
                                    (Math.floor((256-200)*Math.random()) + 200) + ',' + 
                                    (Math.floor((256-200)*Math.random()) + 200) + ')';
                    // var color = appUtility.getRandomColor();
                    if(vm.colorCode.indexOf(color) == -1)
                    {
                        return color;
                    }
                    else
                    {
                       return getRandomColor();
                    }
                }
           
                vm.showDuplicatedModal = function(diffInstance, lineNo, lineObj) {
                    var modalInstance = modalService.showModal({
                        templateUrl: 'app/details/templates/duplicated-by-modal-window.tpl.html',
                        controller: 'duplicatedByModalCtrl',
                        controllerAs: 'duplicatedByModalVM',
                        windowClass: 'action-modal',
                        resolve: { modalParam: function () { return { diffInstance: diffInstance,
                            activePath:vm.activePath,
                            lineNo:lineNo,
                            lineObj:lineObj,
                            selectedFiles:vm.selectedFiles
                        } } }
                    });

                    modalInstance.then(function(selectedFiles) {
                        vm.selectedFiles = selectedFiles;
                    });
                }
                $q.all([
                    metricsDetailsService.retrieveRedundantDetailsLOCData({ story_Id: story_id, lang: lang }).$promise,
                    metricsDashboardService.retrieveDashboardInfo({ story_Id: story_id, lang: lang }).$promise
                ]).then(function(values) {
                    vm.duplicateLOCDetails = values[0];
                    vm.overallLOCDetails = values[1];
                    vm.totalDuplicatedLOC = 0, percentage = 0;
                    vm.duplicateLOCDetails.map(function(item, index) {
                        vm.totalDuplicatedLOC += item.totalDuplicatedLines;
                    })
                    percentage = vm.totalDuplicatedLOC / vm.overallLOCDetails[0].loc * 100;

                    drawDonutChart(
                        '#donut1',
                        percentage,
                        150,
                        150,
                        ".35em"
                    );
                }, function(reason) {

                });

                vm.retrieveDuplicationDiff = function() {
                    metricsDetailsService.retrieveRedundantDetailsDiff({ storyId: story_id }, function(response) {
                        if (response && response.length > 0) {
                            vm.dulpicationResource = response[0];
                            if(vm.activePath)
                            {
                                vm.getDuplicatedByWithDiff(vm.activePath);
                            }
                        }
                    });
                }

                vm.lineIntendation = function(stringValue){
                 
                  return stringValue.replace(/.{80}/g, "$&" + "\n" + "\t"+"\t");

                }
                
                $scope.update=function(fileName){
                    console.log(fileName);
                }
                
                /*vm.duplicatedDiff = function(stringValue){
                 
                  return stringValue.replace(/.{200}/g, "$&" + "\n" + "\t"+"\t");

                }*/


                vm.getDuplicatedByWithDiff = function(activePath) {
                    if(!activePath){
                        return;
                    }
                    vm.activePath = activePath;
                    if (!vm.duplicatedDiff[activePath]) {
                        vm.duplicatedDiff[activePath] = { diffs: [] };
                        var sourceInstance = vm.duplicatedDiff[activePath];
                        if (!activePath) { return; }
                        if (vm.dulpicationResource) {
                            vm.dulpicationResource.data.map(function(data, dataIndex) {
                                if(vm.dulpicationResource.data.length >= vm.colorCode.length){
                                    vm.colorCode.push(getRandomColor());
                                }
                                if (isduplicated(activePath, data.instances)) {                                    
                                    data.instances.map(function(instance, instanceIndex) {
                                        if (!sourceInstance.hasOwnProperty(instance.path)) {
                                            sourceInstance[instance.path] = {};
                                            sourceInstance[instance.path].lines = [];
                                            sourceInstance[instance.path].src = {};
                                            sourceInstance[instance.path].duplicatedBy = {};
                                        }
                                        sourceInstance[instance.path].lines.push(instance.lines);
                                    });
                                    data.diffs.map(function(diff, index) {
                                        var extractedSrc = extractSourceFromDiff(diff, sourceInstance, dataIndex, index);
                                        for (var key in extractedSrc) {
                                            angular.extend(sourceInstance[key].src, extractedSrc[key]);
                                        }
                                        if (diff['-'].path == diff['+'].path) {
                                            sourceInstance[activePath].duplicationOccuredInSameFile = true;
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
                
                function extractSourceFromDiff(diffInstance,sourceInstance, dataIndex, diffIndex) {
                    var extractedSource = {};
                    extractedSource[diffInstance['-'].path] = extractedSource[diffInstance['-'].path] || {};
                    extractedSource[diffInstance['+'].path] = extractedSource[diffInstance['+'].path] || {};
                    var srcLns = diffInstance.diff.split(/\r\n|\r|\n/g), minusStart = diffInstance['-'].lines[0],
                        plusStart = diffInstance['+'].lines[0], 
                        minusBlockName = diffInstance['-'].lines[0] + '-' + diffInstance['-'].lines[1] + '-' + diffIndex, 
                        plusBlockName = diffInstance['+'].lines[0] + '-' +  diffInstance['+'].lines[1] + '-' + diffIndex;
                    srcLns.map(function(ln, index) {                        
                        var lineObj = {statement: ln, duplicatedBy:{}};
                        if (ln.startsWith('-') || !ln.startsWith('+')) {
                            createLnObj(minusStart,ln,diffInstance['-'], diffInstance['+'], 
                            extractedSource, sourceInstance, dataIndex, minusBlockName);
                            ++minusStart;
                        }
                        if (ln.startsWith('+') || !ln.startsWith('-')) {
                            createLnObj(plusStart,ln,diffInstance['+'], diffInstance['-'], 
                            extractedSource, sourceInstance, dataIndex, plusBlockName);
                            ++plusStart;
                        }

                    });
                    return extractedSource;
                }
                function createLnObj(lnNo,lnStatement, diffInstance1, diffInstance2, 
                extractedSource, sourceInstance, dataIndex, blockName)
                {
                    if(lnStatement.startsWith('-') || lnStatement.startsWith('+')) {
                        lnStatement = lnStatement.substring(1, lnStatement.length);

                    }
                    lineObj = {statement: lnStatement, duplicatedBy:{}, blockName:blockName, dataIndex:dataIndex};
                    lineObj.duplicatedBy[diffInstance2.lines[0]+ '-' + diffInstance2.lines[1]+ '-' + diffInstance1.path] = diffInstance2;
                    sourceInstance[diffInstance1.path].src[lnNo] && angular.extend(lineObj.duplicatedBy,sourceInstance[diffInstance1.path].src[lnNo].duplicatedBy);
                    sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path] = sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path] || {};
                    sourceInstance[diffInstance1.path].duplicatedBy[diffInstance2.path][diffInstance2.lines[0] + '-' + diffInstance2.lines[1]] = 0;
                    extractedSource[diffInstance1.path][lnNo] = lineObj;
                }
                function isduplicated(lookUpPath, instances) {
                    var duplicatedArr = instances.filter(function(instance) {
                        if (instance.path == lookUpPath) {
                            return true;
                        }
                        return false;
                    });
                    var result = duplicatedArr.length > 0 ? true : false;
                    return result;
                }

                function drawDonutChart(element, percent, width, height, text_y) {
                    width = typeof width !== 'undefined' ? width : 290;
                    height = typeof height !== 'undefined' ? height : 290;
                    text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

                    var dataset = {
                        lower: calcPercent(0),
                        upper: calcPercent(percent)
                    },
                        radius = Math.min(width, height) / 2,
                        pie = d3.layout.pie().sort(null),
                        format = d3.format(".0%");

                    var arc = d3.svg.arc()
                        .innerRadius(radius - 30)
                        .outerRadius(radius);

                    var svg = d3.select(element).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    var path = svg.selectAll("path")
                        .data(pie(dataset.lower))
                        .enter().append("path")
                        .attr("class", function(d, i) { return "color" + i })
                        .attr("d", arc)
                        .each(function(d) { this._current = d; }); // store the initial values

                    var text = svg.append("text")
                        .attr("text-anchor", "middle")
                        .attr("dy", text_y);

                    if (typeof (percent) === "string") {
                        text.text(percent);
                    }
                    else {
                        var progress = 0;
                        var timeout = setTimeout(function() {
                            clearTimeout(timeout);
                            path = path.data(pie(dataset.upper)); // update the data
                            path.transition().duration(duration).attrTween("d", function(a) {
                                // Store the displayed angles in _current.
                                // Then, interpolate from _current to the new angles.
                                // During the transition, _current is updated in-place by d3.interpolate.
                                var i = d3.interpolate(this._current, a);
                                var i2 = d3.interpolate(progress, percent)
                                this._current = i(0);
                                return function(t) {
                                    text.text(format(i2(t) / 100));
                                    return arc(i(t));
                                };
                            }); // redraw the arcs
                        }, 200);
                    }
                };

                function calcPercent(percent) {
                    return [percent, 100 - percent];
                };
                $scope.$on('$destroy', function(){
                    sharedService.setActivePath('');
                });

                

        /*vm.genpdf= function(){
                html2canvas(document.body,{
                onrendered:function(canvas){
                var img=canvas.toDataURL('image/png');
                var doc=new jsPDF('l', 'mm', [350, 250]);
                doc.addImage(img,'JPEG',20,20);
                doc.save("details.pdf");
                }
                });
                };*/

                vm.retrieveDuplicationDiff();
              


            }]);
})();;(function () {
    angular.module('rx.exception.directive').directive('rxExceptionBlock', ['$compile', '$timeout', 'exceptionService', function ($compile, $timeout, exceptionService) {
        return {
            restrict: "A",
            scope: {
                showerror: '@',
                ondelete: '&'
            },
            templateUrl: "app/errorHandler/exception.tpl.html",
            link: function (scope, elm, attrs, exceptionService) {

                var config = { 'time-out': 5000 },
                    mergedConfig, timerObj;

                mergedConfig = angular.extend({}, config, scope.$eval(attrs.options));

                scope.configureTimer = function configureTimer(timerObj) {
                    var timeout = mergedConfig['time-out'];
                    if (timeout > 0)
                        setTimeout(timerObj, timeout);
                };

                function setTimeout(timerObj, time) {
                    if (timerObj) {
                        scope.stopTimer();
                    }
                    timerObj = $timeout(function () {
                        if (scope.errors && scope.errors.length > 0) {
                            scope.deleteError();
                        }
                        scope.stopTimer();
                    }, time);
                };

                scope.stopTimer = function () {
                    if (timerObj) {
                        $timeout.cancel(timerObj);
                        timerObj = null;
                    }
                };

                scope.restartTimer = function () {
                    if (!timerObj)
                        scope.configureTimer(timerObj);
                };

                scope.getClassName = function () {

                    var className = "", moreThanOneLineClassName = scope.isMoreThanOneLine() ? "exception-moreThenoneLine" : "";
                    if (scope.errors.length > 0) {
                        if (scope.errors[0].type) {
                            className = scope.errors[0].type.toLowerCase() + " " + moreThanOneLineClassName;
                        }
                    }
                    return className;
                }

            },
            controller: ['$scope', '$element', '$attrs', 'exceptionService', function ($scope, $element, $attrs, exceptionService) {

                $scope.errors = exceptionService.errors();
                $scope.isMoreThanOneLine = function () {
                    var isMoreThanOneLine = false;
                    if ($scope.errors.length > 1) {
                        return true;
                    }
                    return false;
                };
                $scope.deleteError = function (index) {
                    exceptionService.clear();
                    if ($scope.ondelete) {
                        $scope.ondelete();
                    }
                };
                $scope.onErrorAdded = function () {
                    if ($scope.errors) {

                        if ($scope.errors.length > 0) {
                            $scope.configureTimer();
                        }
                        else {
                            $scope.restartTimer();
                        }
                    }
                };
                return;
            }]
        };
    }]);
})();
;'use strict';
(function (rx) {
    angular.module("rx.exceptionHandlerModule").factory('rx.exceptionHandler', function () {

        var notificationType = {
            WARNING: "WARNING",
            ERROR: "ERROR",
            VALIDATION: "VALIDATION",
            SUCCESS: "SUCCESS"
        };

        var getNotificationType = function () {
            return notificationType;
        };

        var toString = function () {
            return this.message;
        }

        var CustomError = (function () {
            function CustomError(message, severity) {
                this.message = message;
                this.severity = severity;
                this.type = notificationType.ERROR;
            }

            CustomError.prototype.toString = toString;

            angular.extend(Error, CustomError);
            return CustomError;

        })();
        
        var  ServerError = (function () {
            function ServerError(message, serverResponse, erroCode, severity) {
                CustomError.call(this, message, severity);
                this.errorCode = erroCode;
                this.serverResponse = serverResponse;
            }
            angular.extend(CustomError, ServerError);

            return ServerError;

        })();

        var ValidationError = (function () {
            function ValidationError(message, erroCode, severity) {
                CustomError.call(this, message, severity);
                this.errorCode = erroCode;
                this.type = notificationType.VALIDATION;
            }
            angular.extend(CustomError, ValidationError);

            return ValidationError;

        })();

        var WarningError = (function () {
            function WarningError(message, erroCode, severity) {
                CustomError.call(this, message, severity);
                this.errorCode = erroCode;
                this.type = notificationType.WARNING;
            }
            angular.extend(CustomError, WarningError);

            return WarningError;

        })();

        /* Throw success alert to add into notification queue.
        This class help you to prevent further exceution once thrown.
        */
        var SuccessAlert = (function () {
            function SuccessAlert(message) {
                CustomError.call(this, message);
                this.type = notificationType.SUCCESS;
            }
            angular.extend(CustomError, SuccessAlert);

            return SuccessAlert;

        })();

        return {
            notificationType: getNotificationType(),
            CustomError: CustomError,
            ServerError: ServerError,
            ValidationError: ValidationError,
            WarningError: WarningError,
            SuccessAlert: SuccessAlert
        };

    });   
})();;(function () {
    
    angular.module("rx.exceptionHandlerModule").
        service('exceptionService', ['$rootScope', '$window', 'rx.exceptionHandler', function ($rootScope,
            $window, exceptionHandler) {

        //To make independent module, constant variables are declared over.
            var err = [], rootContext = this,
                constant = {
                    SERVICE_INVOCATION_ERR : 'Server Error. ',
                    publisherEventPayLoad: { SHOW_NOTIFY_COMMAND: 'notificationStart' },
                    UNHANDLED_EX: 'Unhandled exception.'
                };

        this.errors = function () {
            return err;
        };

        this.pushNotification = function (ex) {
            if (!this.isExist(ex)) {
                err.push(ex);
            }
        };

        this.isExist = function (ex) {
            for (var i = 0, j = err.length; i < j; i++) {
                if (JSON.stringify(err[i].message) == JSON.stringify(ex.message)) {
                    return true;
                }
            }
            return false;
        }

        this.deleteError = function (index) {
            err.splice(index, 1);
        };

        this.clear = function () { //it should use same instance then only it reflect in UI whenever u change the coll
            var len = err.length - 1;
            for (var i = len; i >= 0; i--) {
                this.deleteError(i);
            }
        };

        this.clearWithType = function (type) { //it should use same instance then only it reflect in UI whenever u change the coll
            var len = err.length - 1;
            for (var i = len; i >= 0; i--) {
                if (err[i].type == type) {
                    this.deleteError(i);
                }
            }
        };

        
        this.addNotification = function (exception) {
            if (exception instanceof exceptionHandler.CustomError) {
                this.pushNotification(exception);
            }
            else if (exception instanceof exceptionHandler.ValidationError) {
                this.pushNotification(exception);
            }
            else if (exception instanceof exceptionHandler.WarningError) {
                this.pushNotification(exception);
            }
            else if (exception instanceof exceptionHandler.SuccessAlert) {
                this.pushNotification(exception);
            }
            else if (exception instanceof exceptionHandler.ServerError) {
                //add more information if required.
                //Add 'server error' string  prefix to message.
                exception.message = constant.SERVICE_INVOCATION_ERR + exception.message;
                this.pushNotification(exception);
            }
            else {
                this.pushNotification(new exceptionHandler.CustomError(exception.toString()));
            }
        };

        var formatExceptionMessage = function (ex) {
            if (!ex) {
                return constant.UNHANDLED_EX;
            }
            else if (typeof ex === 'string') {
                return ex;
            }
            else {
                return ex.error && ex.error.stack || constant.UNHANDLED_EX;
            }

        }

        this.unhandledError = function (ex) {
            rootContext.addNotification(new exceptionHandler.CustomError(formatExceptionMessage(ex)));
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        angular.element(window).on('error', this.unhandledError); // To handle unhandle exception.

        $rootScope.$on(constant.publisherEventPayLoad.SHOW_NOTIFY_COMMAND, function (event, exception) {
            rootContext.addNotification(exception);
        });
       
        if (window && window.unhandledErrorFun) {
            if (window.onerror == window.unhandledErrorFun) {
                window.onerror = '';
            }
        }

        return;

    }]);

})();;angular.module('metrics.global.directive').directive('jqSlimScroll', ['$q', '$timeout', '$window', function ($q, $timeout, $window, httpInterceptor) {

    var link = function (scope, element, attrs) {
       
        init();

        function init() {
           $(element).slimScroll(JSON.parse(scope.slimScrollOption)); 
            $(element).slimscrollH(JSON.parse(scope.slimScrollOption)); 
        }
        scope.$on('$destroy', function () {
            //$(".slimScrollBar,.slimScrollRail").remove();
            //$(".slimScrollDiv").contents().unwrap();
            $(element).slimScroll({destroy: true});
            $(element).slimScrollH({destroy: true});
        })
        
    }
    return {
        restrict: 'EA',
        scope: {
            slimScrollOption: "@"
        },
        link:link
    }
}]);
;(function() {
    angular.module('metrics.global.filter').filter('transformObjKeysToArr',
        [function() {
            return function(object) {
                var result = [];
                angular.forEach(object, function(value, key) {
                    result.push(key);
                });
                return result;
            }
        }]);
})();;(function () {

    //need to extend $modal using decorator. as of now it is not required.

    angular.module('metrics.global.service').factory('modalService', ['$modal', function ($modal) {
        //This is used to handle closing modal, and creating a controller if not available globally. Added to that create a consistent dialog modal

        //global config
        var defaults = {
            backdrop: 'static',
            keyboard: false,
            modalFade: true,
            templateUrl: '',
            controller: ''
        };

        
        var show = function (option) {
            var tempModalDefaults = {};
            angular.extend(tempModalDefaults, defaults, option);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalDefaults;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');                       
                    };

                    return;
                }];
            }

            return $modal.open(tempModalDefaults).result;
        };

        var messageBox = function () {
            var modalOption = {}, messageInformation = arguments;
            angular.extend(modalOption, defaults);
            modalOption.templateUrl = 'app/global/templates/msgDialog.tpl.html';
            modalOption.controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                var vm = this;
                vm.header = messageInformation[0];
                vm.msg = messageInformation[1];
                vm.buttons = messageInformation[2];//{ label: 'Ok', result: 'yes', cssClass: 'savebutton' }
                vm.resolvedData = messageInformation[3];
                vm.onButtonClick = function (result) {
                    $modalInstance.close(angular.extend({}, { result: result }, vm.resolvedData));
                };
                vm.close = function () {
                    $modalInstance.dismiss(angular.extend({}, { result: 'cancel' }, vm.resolvedData));
                };
                return;
            }];
            modalOption.controllerAs = 'msgDialog';
            //modalOption.windowClass = 'fluid-Modal';
            return $modal.open(modalOption).result;
        }

        return {
            showModal: show,
            messageBox: messageBox
        };
    }]);
})();