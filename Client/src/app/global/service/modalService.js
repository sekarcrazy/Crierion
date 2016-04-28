(function () {

    //need to extend $modal using decorator. as of now it is not required.

    angular.module('metrics.global.service').factory('modalService', ['$modal', function ($modal) {
        //This is used to handle closing modal, and creating a controller if not available globally. Added to that create a consistent dialog modal

        //global config
        var defaults = {
            backdrop: 'static',
            keyboard: false,
            modalFade: true,
            templateUrl: '',
            controller: ''
        };

        
        var show = function (option) {
            var tempModalDefaults = {};
            angular.extend(tempModalDefaults, defaults, option);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalDefaults;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');                       
                    };

                    return;
                }];
            }

            return $modal.open(tempModalDefaults).result;
        };

        var messageBox = function () {
            var modalOption = {}, messageInformation = arguments;
            angular.extend(modalOption, defaults);
            modalOption.templateUrl = 'app/global/templates/msgDialog.tpl.html';
            modalOption.controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                var vm = this;
                vm.header = messageInformation[0];
                vm.msg = messageInformation[1];
                vm.buttons = messageInformation[2];//{ label: 'Ok', result: 'yes', cssClass: 'savebutton' }
                vm.resolvedData = messageInformation[3];
                vm.onButtonClick = function (result) {
                    $modalInstance.close(angular.extend({}, { result: result }, vm.resolvedData));
                };
                vm.close = function () {
                    $modalInstance.dismiss(angular.extend({}, { result: 'cancel' }, vm.resolvedData));
                };
                return;
            }];
            modalOption.controllerAs = 'msgDialog';
            //modalOption.windowClass = 'fluid-Modal';
            return $modal.open(modalOption).result;
        }

        return {
            showModal: show,
            messageBox: messageBox
        };
    }]);
})();