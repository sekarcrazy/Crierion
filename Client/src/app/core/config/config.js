(function () {
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
})();