(function () {
    angular.module('metrics.dashboard.controller', []);
    angular.module('metrics.dashboard.service', []);
    angular.module('metrics.dashboard.directive', []);
    angular.module('metrics.dashboard.filter', []);
    angular.module('metrics.dashboard', [
    'metrics.dashboard.controller',
    'metrics.dashboard.service',
    'metrics.dashboard.directive',
    'metrics.dashboard.filter'
    ]);
})();