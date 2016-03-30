(function () {
    angular.module('metrics.layout.services')
        .factory('metricsMetadataService', ['$resource', 'apiUrlConfig', function ($resource, apiUrlConfig) {
            var baseUrl = apiUrlConfig.nisApiBaseUrl + '/:controller/:dest/:action/:storyId';
            return $resource(baseUrl, {}, {
                getNavigationList: {
                    method: 'GET', params: { controller: 'getNavigationList'},
                    isArray: true
                }
            });
        }]);
})();