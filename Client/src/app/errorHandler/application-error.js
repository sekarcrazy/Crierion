(function () {
   
    angular.module("rx.exception.directive", []);

    angular.module("rx.exceptionHandlerModule", ['rx.exception.directive'])
        .config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler',
            ['$delegate', '$injector', extendExceptionHandler]);
        return;
    }]);

    // Extend the $exceptionHandler service to also display a toast.
    function extendExceptionHandler($delegate, $injector) {        
        return function (exception, cause) {            
            //customize
            var es = $injector.get('exceptionService');
            if (es) {
                es.addNotification(exception);
            }
            $delegate(exception, cause);
        };
    }

})();