'use strict';
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
            return;

        }]);
})();