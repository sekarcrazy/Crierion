(function () {
    angular.module('metrics.global.service', []);
    angular.module('metrics.global.directive', []);
    angular.module('metrics.global.utility', []);
    angular.module('metrics.global.filter', []);

    angular.module('metrics.global', [
    'metrics.global.service',
    'metrics.global.directive',
    'metrics.global.filter',
    'metrics.global.utility'
    ]);
})();