(function () {
    angular.module('metrics.details.service')
        .factory('metricsDetailsService', ['$resource', 'apiUrlConfig', function ($resource, apiUrlConfig) {
            var baseUrl = apiUrlConfig.nisApiBaseUrl + '/:lang/:controller/:dest/:action/:story_Id';
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
})();