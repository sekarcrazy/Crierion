angular.module('appsettings', []).constant('appsettingsConstant',
    {
        metricsApiBaseUrl: 'http://localhost:1337',
        //metricsApiBaseUrl: 'http://172.16.25.6:1337',

        coreBaseUrl: 'https://core.rackspace.com/py/core',

        metricsSecurityApiBaseUrl: '',
        
        appBaseUrl: '/',
        logging_url: '',
        appContextPath: '',
        isLoggerEnabled: true,
        showHeader: true
    }
);