'use strict';
(function () {
    angular.module('nis.security.routePermission').provider('routeAccessPermission', [function () {
        return {

            $get: ['security', 'securityAuthPrivilege', '$state', function (security, securityAuthPrivilege, $state) {
                return {
                    requireEditRole: function () {
                        var promise = security.requireEditRoleUser().then(function (isEdit) {
                            if (!isEdit) {
                                var access;
                                //$state.go('error');
                            }
                            return isEdit;
                        });
                        return promise;
                    },
                    requireAdminRole: function () {
                        var promise = security.requireAdminRoleUser().then(function (isAdmin) {
                            if (!isAdmin) { //$state.go('error'); 
                                var access;
                            }
                            return isAdmin;
                        });

                        return promise;
                    }
                };
            }]
        };

    }]);

})();