(function () {
    
    angular.module("rx.exceptionHandlerModule").
        service('exceptionService', ['$rootScope', '$window', 'rx.exceptionHandler', function ($rootScope,
            $window, exceptionHandler) {

        //To make independent module, constant variables are declared over.
            var err = [], rootContext = this,
                constant = {
                    SERVICE_INVOCATION_ERR : 'Server Error. ',
                    publisherEventPayLoad: { SHOW_NOTIFY_COMMAND: 'notificationStart' },
                    UNHANDLED_EX: 'Unhandled exception.'
                };

        this.errors = function () {
            return err;
        };

        this.pushNotification = function (ex) {
            if (!this.isExist(ex)) {
                err.push(ex);
            }
        };

        this.isExist = function (ex) {
            for (var i = 0, j = err.length; i < j; i++) {
                if (JSON.stringify(err[i].message) == JSON.stringify(ex.message)) {
                    return true;
                }
            }
            return false;
        }

        this.deleteError = function (index) {
            err.splice(index, 1);
        };

        this.clear = function () { //it should use same instance then only it reflect in UI whenever u change the coll
            var len = err.length - 1;
            for (var i = len; i >= 0; i--) {
                this.deleteError(i);
            }
        };

        this.clearWithType = function (type) { //it should use same instance then only it reflect in UI whenever u change the coll
            var len = err.length - 1;
            for (var i = len; i >= 0; i--) {
                if (err[i].type == type) {
                    this.deleteError(i);
                }
            }
        };

        
        this.addNotification = function (exception) {
            if (exception instanceof exceptionHandler.CustomError) {
                this.pushNotification(exception);
            }
            else if (exception instanceof exceptionHandler.ValidationError) {
                this.pushNotification(exception);
            }
            else if (exception instanceof exceptionHandler.WarningError) {
                this.pushNotification(exception);
            }
            else if (exception instanceof exceptionHandler.SuccessAlert) {
                this.pushNotification(exception);
            }
            else if (exception instanceof exceptionHandler.ServerError) {
                //add more information if required.
                //Add 'server error' string  prefix to message.
                exception.message = constant.SERVICE_INVOCATION_ERR + exception.message;
                this.pushNotification(exception);
            }
            else {
                this.pushNotification(new exceptionHandler.CustomError(exception.toString()));
            }
        };

        var formatExceptionMessage = function (ex) {
            if (!ex) {
                return constant.UNHANDLED_EX;
            }
            else if (typeof ex === 'string') {
                return ex;
            }
            else {
                return ex.error && ex.error.stack || constant.UNHANDLED_EX;
            }

        }

        this.unhandledError = function (ex) {
            rootContext.addNotification(new exceptionHandler.CustomError(formatExceptionMessage(ex)));
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        angular.element(window).on('error', this.unhandledError); // To handle unhandle exception.

        $rootScope.$on(constant.publisherEventPayLoad.SHOW_NOTIFY_COMMAND, function (event, exception) {
            rootContext.addNotification(exception);
        });
       
        if (window && window.unhandledErrorFun) {
            if (window.onerror == window.unhandledErrorFun) {
                window.onerror = '';
            }
        }

        return;

    }]);

})();