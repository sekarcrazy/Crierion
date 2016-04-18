(function () {
    angular.module('metrics.details.controller')
        .controller('duplicatedByModalCtrl', ['constant','modalService',
    'routehelper', 'rx.exceptionHandler', '$timeout', '$rootScope','$modalInstance','modalParam',
    function (constant, modalService,
        routehelper, exceptionHandler, $timeout, $rootScope, $modalInstance, modalParam) {
        var self = this;

        self.buttons = [{ label: 'Submit', result: 'submit', cssClass: 'savebutton' }, { label: 'Cancel', result: 'no' }];
                
        self.onButtonClick = function (result) {
            
            self.close();
        };
        self.close = function () {
            $modalInstance.dismiss();
        };        
    }]);
})();