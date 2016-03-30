(function () {
    angular.module('nis.core').config(['apiUrlConfigProvider', '$urlRouterProvider', '$stateProvider',
        'routehelperConfigProvider', '$routeProvider', '$httpProvider', function (apiUrlConfigProvider,
            $urlRouterProvider, $stateProvider,
            routehelperConfigProvider, $routeProvider, $httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
            $httpProvider.interceptors.push('authTokenInterceptor');
            $urlRouterProvider.otherwise('/');

            if (window.location.hash && (window.location.hash.indexOf('?sample') >= 0 || window.location.hash.indexOf('&sample') >= 0)) {
                apiUrlConfigProvider.setNisApiBaseUrl('\sample');
            }

            return;

        }]).value('config', function () {
            var config = {
                restApiFrameworkName: ''
            };
            return config;
        });
})();