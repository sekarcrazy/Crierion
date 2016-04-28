(function () {
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
