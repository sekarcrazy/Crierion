'use strict';
(function () {
    angular.module('metrics.details')
        .run(['routehelper', 'constant', 'routeAccessPermission', '$state',
            function (routehelper, constant, routeAccessPermission) {

            var duplicationDetails = {
                name: constant.details.DUPLICATION_DETAILS_ROUTER_NAME,
                url: constant.details.DUPLICATION_DETAILS_ROUTER_URL,
                templateUrl: 'app/details/templates/duplication-details.tpl.html',
                controller: 'duplicationCodeDetailsCtrl',
                controllerAs: 'duplicationCodeDetailsVM'                    
            };
            var states = [duplicationDetails];

            routehelper.configureStates(states);
            return;

        }]);
})();