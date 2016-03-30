(function () {
    angular.module('nis.security.service')
        .factory('securityApi', ['$resource', 'apiUrlConfig', function ($resource, apiUrlConfig) {
            var baseUrl = apiUrlConfig.nisSecurityApiBaseUrl + '/:dest/:userId';
            return $resource(baseUrl, {}, {
                retrieveUser1: { method: 'GET', params: { dest: "retrieveUser" }},
                retrieveUser: { method: 'GET', params: { dest: "54a7f12f0f6c612900354fc6" }},
                retrieveRole: { method: 'GET', params: { dest: "user" }}
            });
        }]);
})();