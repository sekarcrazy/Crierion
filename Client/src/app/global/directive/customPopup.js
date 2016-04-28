angular.module('metrics.global.directive').directive("tooltipTemplate", ['$compile','constant',function ($compile, constant) {
    var contentContainer;
    return {
        restrict: "A",
        scope: {
            tooltipScope: "=",
            tooltipAppendElement: '@'
        },
        link: function (scope, element, attrs) {
            var templateUrl = attrs.tooltipTemplate;
            var scopeObjAttached, porkingArrowHeight = 25;
            var tooltipElement = angular.element("<div custom-popup ng-style='{top: tooltip.pos.y, left: tooltip.pos.x}' ng-hide='tooltip.hidden' style='position:absolute;width:100%;'></div>");
            tooltipElement.append("<div custom-popup-template style='position:absolute;width:100%;' ng-include='\"" + templateUrl + "\"'></div>");
            var tooltipAppendElement;
            //add popup to parent container always . otherwise need to change the pos
            if (attrs.tooltipAppendElement) {
                tooltipAppendElement = angular.element($(attrs.tooltipAppendElement));
            } else {
                tooltipAppendElement = element.parent();
            }
            var popUp = angular.element($("[custom-popup]"));
            if (!popUp || popUp.length == 0) {
                tooltipAppendElement.append(tooltipElement);
                scopeObjAttached = scope;
                var newScope = scope.$new(true);
                newScope.tooltip = {};
                newScope.tooltip.constant = constant;
                newScope.tooltip.hidden = true;
                $compile(tooltipElement.contents())(newScope);
                $compile(tooltipElement)(newScope);
            }

            popUp = null;

            var toggleVisible = function (hidden, pos) {
                var targetScope = angular.element($("[custom-popup]")).scope();
                if (targetScope) {
                    targetScope.tooltip.hidden = hidden;
                    if (!hidden) {                        
                        targetScope.tooltip.tooltipDataContext = angular.copy(scope.tooltipScope);
                        targetScope.tooltip.pos = pos;
                    }
                }
                if (!scope.$$phase) {
                    scope.$apply();
                }
            }
            var onMouseEnter = function (ev) {
                var pos = { x: ev.pageX - (ev.offsetX || 0) + ev.currentTarget.offsetWidth, y: ev.pageY - (ev.offsetY || 0) - ev.currentTarget.offsetHeight - porkingArrowHeight };
                toggleVisible(false, pos);
            };

            var onMouseLeave = function (ev) {                
                toggleVisible(true);
            };

            element.bind('mouseenter', onMouseEnter);
            element.bind('mouseleave', onMouseLeave);

            scope.$on('$destroy', function () {
                if (angular.equals(scope, scopeObjAttached)) {
                    if (tooltipElement) {
                        tooltipElement.remove();
                    }
                }
                element.unbind('mouseenter', onMouseEnter);
                element.unbind('mouseleave', onMouseLeave);
            });
            //unbind while destory
        }
    };

}]);