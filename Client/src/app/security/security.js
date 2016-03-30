(function () {
    angular.module('nis.security.service', []);
    angular.module('nis.security.privilege', []);
    angular.module('nis.security.routePermission', []);

    angular.module('nis.security', [
    'nis.security.service',
    'nis.security.privilege',
    'nis.security.routePermission'
    ]);
})();