(function () {
    angular.module('metrics.security.service').provider('security', [function () {
        return {

            //this will be used to call in config phase
            requireEditRoleUser: ['security', function (security) {
                return security.requireEditRoleUser();
            }],

            requireReadRoleUser: ['security', function (security) {
                return security.requireReadRoleUser();
            }],

            requireAdminRoleUser: ['security', function (security) {
                return security.requireAdminRoleUser();
            }],

            $get: ['securityAuthPrivilege', function (securityAuthPrivilege) {
                return {
                    requireEditRoleUser: function () {
                        var promise = securityAuthPrivilege.requestLoggedUser().then(function () {
                            return securityAuthPrivilege.isEditRole();
                        });
                        return promise;
                    },
                    requireReadRoleUser: function () {
                        var promise = securityAuthPrivilege.requestLoggedUser().then(function () {
                            return securityAuthPrivilege.isReadRole();
                        });

                        return promise;
                    },
                    requireAdminRoleUser: function () {
                        var promise = securityAuthPrivilege.requestLoggedUser().then(function () {
                            var isAdmin = securityAuthPrivilege.isAdmin();
                            //if (!isAdmin) { $state.go('error'); }
                            return isAdmin;
                        });

                        return promise;
                    },
                    requireAuthorizedUser: function () {
                        var promise = securityAuthPrivilege.requestLoggedUser().then(function () {
                            return securityAuthPrivilege.isLoggedUsrAvailable();
                        });

                        return promise;
                    }
                };
            }]
        };

    }]);

})();