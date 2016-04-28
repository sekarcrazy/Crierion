(function () {
    angular.module('metrics.security.service', []);
    angular.module('metrics.security.privilege', []);
    angular.module('metrics.security.routePermission', []);

    angular.module('metrics.security', [
    'metrics.security.service',
    'metrics.security.privilege',
    'metrics.security.routePermission'
    ]);
})();