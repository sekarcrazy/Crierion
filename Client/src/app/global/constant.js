(function () {
    angular.module("nis.global").config(['constantProvider', 'apiUrlConfigProvider','appsettingsConstant', function (constantProvider, apiUrlConfigProvider, appsettingsConstant) {

        var constant = {}, apiUrlConfig = apiUrlConfigProvider.getEnvironment();

        constant.common = {
            DATE_FORMAT: 'date:\'MM/dd/yyyy HH:mm:ss\'',
            CONFIRMATION: 'Confirmation', //dialog header
            BAD_RESPONSE_FORMAT: 'Response format is wrong.',
            BAD_REQUEST_FORMAT: 'Request format is wrong.',
            RESPONSE_SUCCESS: 'SUCCESS',
            RESPONSE_FAILED: 'FAILED',
            FILTER_TITLE: 'Filter',
            UNDEFINED: 'Object is undefined',
            LOGGIN_REDIRECT_PATH: '/identity/?ref='
        };

        constant.dashboard = {            
            //Router config
            DASHBOARD_ROUTER_NAME: 'dashboard',
            DASHBOARD_ROUTER_URL: apiUrlConfig.appBaseUrl + 'lang/:lang/:storyType/:projectName/dashboard/:story_id',
            HOME_ROUTER_NAME: 'home',
            HOME_ROUTER_URL:apiUrlConfig.appBaseUrl + 'home',
            DEFAULT_ROUTER_URL:apiUrlConfig.appBaseUrl + 'home'
        };
        
        constant.details = {            
            //Router config
            DUPLICATION_DETAILS_ROUTER_NAME: 'duplication-details',
            DUPLICATION_DETAILS_ROUTER_URL: apiUrlConfig.appBaseUrl + 'lang/:lang/:storyType/:projectName/details/duplication/:story_id'
        };

        constant.publisherEventPayLoad = {
            SHOW_NOTIFY_COMMAND: 'notificationStart',
            TRIGGER_DEVICE_FILTER: 'applyDeviceFilter',
            REFRESH_DEVICE_DETAIL: 'statusChanged'
        };

        constantProvider.configureConstant(constant);
    }]);
})();