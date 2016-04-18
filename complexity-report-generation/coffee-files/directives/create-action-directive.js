angular.module('asweb.directives').directive('abDragabble', function($rootScope, ActionBuilderService) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return $(element).draggable({
        start: function() {
          return $rootScope.$emit("drag-start");
        },
        stop: function() {
          return $rootScope.$emit("drag-end");
        }
      }, {
        cursor: "move",
        helper: "clone"
      });
    }
  };
}).directive('abDroppable', function($rootScope, $http, $templateCache, $compile, $parse, ActionBuilderService) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var colNum, item, rowNum;
      $rootScope.$on("drag-start", function() {
        return angular.element(element).addClass("drag-target");
      });
      $rootScope.$on("drag-end", function() {
        return angular.element(element).removeClass("drag-target");
      });
      item = $parse(attrs.abDroppable);
      rowNum = scope.$eval(attrs.rowId);
      colNum = scope.$eval(attrs.colId);
      rowNum -= 1;
      colNum -= 1;
      return $(element).droppable({
        hoverClass: "lvl-hover",
        drop: function(event, ui) {
          angular.forEach(ActionBuilderService.action.formTypes, (function(formType) {
            if (formType.value === ui.draggable[0].id.trim()) {
              scope.col.properties = [];
              return angular.forEach(formType.properties, (function(prop) {
                var abc, efg;
                abc = {};
                abc.value = [];
                abc.key = prop.key;
                if (prop.key === "List Item") {
                  angular.forEach(prop.value, (function(val) {
                    var efg;
                    efg = [];
                    efg.text = val.text;
                    efg.value = val.value;
                    return abc.value.push(efg);
                  }));
                } else if (prop.key === 'Rules') {
                  efg = void 0;
                  efg = [];
                  efg.Event = '';
                  efg.Name = '';
                  abc.value.push(efg);
                } else {
                  abc.value = prop.value;
                }
                return scope.col.properties.push(abc);
              }));
            }
          }));
          item.assign(scope, ui.draggable[0].id.trim());
          return scope.$apply();
        }
      });
    }
  };
}).directive('changeTrackerFixedProps', function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs) {
      scope.selectedModel = null;
      scope.validateDupes = function() {
        var param;
        param = scope.fixedPropControl;
        scope.fixedPropControls.forEach(function(prop) {
          if (prop.$$hashKey !== param.$$hashKey) {
            if (prop.key && (prop.key.params === param.key.params)) {
              scope.selectedModel = scope.fixedPropControl;
              return AricMessage.showMessage('failure', "Selected property has already been mapped. Please choose another property.", null, null, null, scope.reset);
            }
          }
        });
      };
      scope.reset = function() {
        scope.selectedModel.key = '';
      };
      element.bind('change', scope.validateDupes);
    }
  };
});
