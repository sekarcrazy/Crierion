(function () {
    angular.module('nis.core')
        .provider('logger', ['appSettingsProvider', function (appSettings) {

            var appConfig = appSettings.getAppSettings(),
                isEnabled = appConfig.isLoggerEnabled && true;

            return {
                setEnabled: function (_isEnabled) {
                    if (appConfig.isLoggerEnabled) {
                        isEnabled = !!_isEnabled;
                    }
                },
                getEnabled: function () {
                    return isEnabled;
                },

                $get: ['$log', function ($log) {

                    var Logger = function (module) {
                        this.context = module;
                    }

                    Logger.prototype = {
                        log: enhanceLogging($log.log),
                        info: enhanceLogging($log.info),
                        warn: enhanceLogging($log.warn),
                        debug: enhanceLogging($log.debug),
                        error: enhanceLogging($log.error)
                    };

                    Logger.getInstance = function (module) {
                        return new Logger(module);
                    };

                    function _log(loggingFunc, context, args) {
                        var modifiedArguments = [].slice.call(args);
                        modifiedArguments[0] = [moment().format("dddd h:mm:ss a") + '::[' + context + ']> '] + modifiedArguments[0];
                        loggingFunc.apply(null, modifiedArguments);

                        // we can log all the message to server, if we want. need to implement a queue
                    }

                    function enhanceLogging(loggingFunc) {
                        return function () {
                            if (!isEnabled) {
                                return;
                            }
                            _log.call(null, loggingFunc, this.context, arguments);
                        };
                    }

                    return { getInstance: Logger.getInstance }
                }]
            }
        }]);
})();