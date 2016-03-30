(function () {
    angular.module("metrics.layout.controller", []);
    angular.module("metrics.layout.directive", []);
    angular.module("metrics.layout.services", []);

    angular.module("metrics.layout", [
    'metrics.layout.controller',
    'metrics.layout.directive',
    'metrics.layout.services'
    ]);
})();