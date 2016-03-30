(function () {
    angular.module('nis.global.service', []);
    angular.module('nis.global.directive', []);
    angular.module('nis.global.utility', []);

    angular.module('nis.global', [
    'nis.global.service',
    'nis.global.directive',
    'nis.global.utility'
    ]);
})();