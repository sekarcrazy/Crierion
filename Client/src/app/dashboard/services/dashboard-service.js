(function () {
    angular.module('metrics.dashboard.service')
        .factory('metricsDashboardService', ['$resource', 'apiUrlConfig', function ($resource, apiUrlConfig) {
            var baseUrl = apiUrlConfig.nisApiBaseUrl + '/:lang/:controller/:dest/:action/:story_Id';
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
                    method: 'GET', params: { controller: 'violationsCount'},
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
})();