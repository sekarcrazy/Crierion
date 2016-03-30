(function(){angular.module('nis.global.directive').directive('checkboxList', ['$interpolate', '$parse', function ($interpolate, $parse) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {

            // model -> view
            ngModel.$render = function () {
                //Inital load, in case if filter already has the value, need to update in UI.
                var values = ngModel.$modelValue || [];
                angular.forEach(elm.find('input'), function (input) {
                    var exp = $interpolate(input.getAttribute('value')),
                        context = angular.element(input).scope(), value = exp(context);
                    if (exp.exp) { //version doesnt support exp.expressions && exp.expressions.length > 0
                        var getter = $parse(input.getAttribute('ng-model')), setter = getter.assign;
                        setter(context, values.indexOf(value) !== -1);
                    }                    
                    
                    //input.checked = values.indexOf(value) !== -1;
                });
            };

            // view -> model
            elm.bind('click', function (e) {
                if (angular.lowercase(e.target.nodeName) === 'input') {
                    var values = [], $modelValue = ngModel.$modelValue || [];
                    angular.forEach(elm.find('input'), function (input) {
                        if (input.checked) {
                            values.push(input.getAttribute('value'));
                        }
                        else {
                            var unChkIndex = $modelValue.indexOf(input.getAttribute('value'));
                            if (unChkIndex >= 0) {
                                $modelValue.splice(unChkIndex, 1);
                            }
                        }
                    });

                    ngModel.$setViewValue(values);
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                }
            });

            function onUpdatelayout(oldValue, newValue) {
                ngModel.$render();
                watchModelValue(); //detach
            };

            //need to check it is not firing
            var watchModelValue = scope.$watch(ngModel.$modelValue, onUpdatelayout);
        }
    };
}]);
})();