(function () {
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
})();