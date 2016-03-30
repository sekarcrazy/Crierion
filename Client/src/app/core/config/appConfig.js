(function () {
    'use strict';
    angular.module('nis.core')
        .provider('apiUrlConfig', ['appsettingsConstant', function (appsettings) {
            var environment = {
                nisApiBaseUrl: appsettings.nisApiBaseUrl,
                nisSecurityApiBaseUrl: appsettings.nisSecurityApiBaseUrl,
                appBaseUrl: appsettings.appBaseUrl,
                logging_url: appsettings.logging_url
            };

            this.setNisApiBaseUrl = function (url) {
                environment.nisApiBaseUrl = url;
            };
            this.getEnvironment = function () {
                return environment;
            };
            this.$get = [function () {
                return environment;
            }];

            return;
        }]);
})();

(function () {
    'use strict';
    angular.module('nis.core')
        .provider('appSettings', ['appsettingsConstant', function (appsettingsConstant) {
            var appSettings = {                
                appContextPath: appsettingsConstant.appContextPath,
                isLoggerEnabled: appsettingsConstant.isLoggerEnabled,
                showHeader: appsettingsConstant.showHeader
            };

            this.setIsLoggerEnabled = function (_isLoggerEnabled) {
                appSettings.isLoggerEnabled = _isLoggerEnabled;
            };

            this.getAppSettings = function () {
                return appSettings;
            };

            this.$get = [function () {
                return appSettings;
            }];

            return;
        }]);
})();