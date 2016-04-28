(function () {
    'use strict';
    angular.module('metrics.core')
        .provider('apiUrlConfig', ['appsettingsConstant', function (appsettings) {
            var environment = {
                metricsApiBaseUrl: appsettings.metricsApiBaseUrl,
                metricsSecurityApiBaseUrl: appsettings.metricsSecurityApiBaseUrl,
                appBaseUrl: appsettings.appBaseUrl,
                logging_url: appsettings.logging_url
            };

            this.setmetricsApiBaseUrl = function (url) {
                environment.metricsApiBaseUrl = url;
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
    angular.module('metrics.core')
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