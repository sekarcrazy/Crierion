(function() {
    angular.module('metrics.details.controller')
        .controller('issueCodeDetailsCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings', 'routehelper', '$route', '$document',
            'metricsDetailsService', '$q', 'metricsDashboardService', 'modalService','sharedService',
            function($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document,
                metricsDetailsService, $q, metricsDashboardService, modalService, sharedService) {
                
                console.log("into issue ctrl")

            }]);
})();