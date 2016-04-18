(function () {
    angular.module('metrics.details.controller', []);
    angular.module('metrics.details.service', []);
    angular.module('metrics.details.directive', []);
    angular.module('metrics.details.filter', []);
    angular.module('metrics.details', [
    'metrics.details.controller',
    'metrics.details.service',
    'metrics.details.directive',
    'metrics.details.filter'
    ]);
})();