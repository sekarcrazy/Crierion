(function () {
    angular.module('rx.exception.directive').directive('rxExceptionBlock', ['$compile', '$timeout', 'exceptionService', function ($compile, $timeout, exceptionService) {
        return {
            restrict: "A",
            scope: {
                showerror: '@',
                ondelete: '&'
            },
            templateUrl: "app/errorHandler/exception.tpl.html",
            link: function (scope, elm, attrs, exceptionService) {

                var config = { 'time-out': 5000 },
                    mergedConfig, timerObj;

                mergedConfig = angular.extend({}, config, scope.$eval(attrs.options));

                scope.configureTimer = function configureTimer(timerObj) {
                    var timeout = mergedConfig['time-out'];
                    if (timeout > 0)
                        setTimeout(timerObj, timeout);
                };

                function setTimeout(timerObj, time) {
                    if (timerObj) {
                        scope.stopTimer();
                    }
                    timerObj = $timeout(function () {
                        if (scope.errors && scope.errors.length > 0) {
                            scope.deleteError();
                        }
                        scope.stopTimer();
                    }, time);
                };

                scope.stopTimer = function () {
                    if (timerObj) {
                        $timeout.cancel(timerObj);
                        timerObj = null;
                    }
                };

                scope.restartTimer = function () {
                    if (!timerObj)
                        scope.configureTimer(timerObj);
                };

                scope.getClassName = function () {

                    var className = "", moreThanOneLineClassName = scope.isMoreThanOneLine() ? "exception-moreThenoneLine" : "";
                    if (scope.errors.length > 0) {
                        if (scope.errors[0].type) {
                            className = scope.errors[0].type.toLowerCase() + " " + moreThanOneLineClassName;
                        }
                    }
                    return className;
                }

            },
            controller: ['$scope', '$element', '$attrs', 'exceptionService', function ($scope, $element, $attrs, exceptionService) {

                $scope.errors = exceptionService.errors();
                $scope.isMoreThanOneLine = function () {
                    var isMoreThanOneLine = false;
                    if ($scope.errors.length > 1) {
                        return true;
                    }
                    return false;
                };
                $scope.deleteError = function (index) {
                    exceptionService.clear();
                    if ($scope.ondelete) {
                        $scope.ondelete();
                    }
                };
                $scope.onErrorAdded = function () {
                    if ($scope.errors) {

                        if ($scope.errors.length > 0) {
                            $scope.configureTimer();
                        }
                        else {
                            $scope.restartTimer();
                        }
                    }
                };
                return;
            }]
        };
    }]);
})();
