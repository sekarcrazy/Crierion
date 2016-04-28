'use strict';
(function () {
    angular.module('metrics.global')
        .run(['routehelper', 'constant', function (routehelper, constant) {

            var error = {
                name: 'error',
                url: '/error',
                template: '<div>Error occured.</div>'
            };
            var home = {
                name: constant.dashboard.HOME_ROUTER_NAME,
                url: constant.dashboard.HOME_ROUTER_URL,
                template: '<div></div>'
            };
            var states = [home, error];

            routehelper.configureStates(states);

            //while page loads, if no router url matches, the below router is being set.
            routehelper.configureRoutes([{ url: '/', redirectTo: constant.dashboard.DEFAULT_ROUTER_URL }]);

            return;

        }]);
})();