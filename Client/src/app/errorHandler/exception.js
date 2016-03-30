'use strict';
(function (rx) {
    angular.module("rx.exceptionHandlerModule").factory('rx.exceptionHandler', function () {

        var notificationType = {
            WARNING: "WARNING",
            ERROR: "ERROR",
            VALIDATION: "VALIDATION",
            SUCCESS: "SUCCESS"
        };

        var getNotificationType = function () {
            return notificationType;
        };

        var toString = function () {
            return this.message;
        }

        var CustomError = (function () {
            function CustomError(message, severity) {
                this.message = message;
                this.severity = severity;
                this.type = notificationType.ERROR;
            }

            CustomError.prototype.toString = toString;

            angular.extend(Error, CustomError);
            return CustomError;

        })();
        
        var  ServerError = (function () {
            function ServerError(message, serverResponse, erroCode, severity) {
                CustomError.call(this, message, severity);
                this.errorCode = erroCode;
                this.serverResponse = serverResponse;
            }
            angular.extend(CustomError, ServerError);

            return ServerError;

        })();

        var ValidationError = (function () {
            function ValidationError(message, erroCode, severity) {
                CustomError.call(this, message, severity);
                this.errorCode = erroCode;
                this.type = notificationType.VALIDATION;
            }
            angular.extend(CustomError, ValidationError);

            return ValidationError;

        })();

        var WarningError = (function () {
            function WarningError(message, erroCode, severity) {
                CustomError.call(this, message, severity);
                this.errorCode = erroCode;
                this.type = notificationType.WARNING;
            }
            angular.extend(CustomError, WarningError);

            return WarningError;

        })();

        /* Throw success alert to add into notification queue.
        This class help you to prevent further exceution once thrown.
        */
        var SuccessAlert = (function () {
            function SuccessAlert(message) {
                CustomError.call(this, message);
                this.type = notificationType.SUCCESS;
            }
            angular.extend(CustomError, SuccessAlert);

            return SuccessAlert;

        })();

        return {
            notificationType: getNotificationType(),
            CustomError: CustomError,
            ServerError: ServerError,
            ValidationError: ValidationError,
            WarningError: WarningError,
            SuccessAlert: SuccessAlert
        };

    });   
})();