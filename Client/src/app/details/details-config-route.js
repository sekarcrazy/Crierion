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
            var issue = {
                name: constant.issue.ISSUE_DETAILS_ROUTER_NAME,
                url: constant.issue.ISSUE_DETAILS_ROUTER_URL,
                templateUrl: 'app/details/templates/issue-details.tpl.html',
                controller: 'issueCodeDetailsCtrl',
                controllerAs: 'issueCodeDetailsVM'                    
            };
            var states = [issue,duplicationDetails];

            routehelper.configureStates(states);
            return;

        }]);
})();