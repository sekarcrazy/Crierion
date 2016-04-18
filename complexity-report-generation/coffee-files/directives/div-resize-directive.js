angular.module('asweb.directives').directive("resize", function($window) {
  return function(scope, element) {
    var w;
    w = angular.element($window);
    scope.getWindowDimensions = function() {
      return {
        h: w.height(),
        w: w.width()
      };
    };
    scope.CalcHeight = function() {
      scope.propName = element.attr("prop-name");
      if ($('body').hasClass("main-nav-closed")) {
        return scope.temp = scope.windowHeight - 132;
      } else {
        return scope.temp = scope.windowHeight - 172;
      }
    };
    scope.$watch(scope.getWindowDimensions, (function(newValue, oldValue) {
      scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;
      scope.propName = element.attr("prop-name");
      if ($('body').hasClass("main-nav-closed")) {
        scope.temp = scope.windowHeight - 132;
      } else {
        scope.temp = scope.windowHeight - 172;
      }
      if (scope.propName === "setnavheight") {
        $(".setnavheight").css({
          height: (scope.temp + 28) + "px"
        });
      } else if (scope.propName === "setleftheight") {
        $(".setleftheight").css({
          height: (scope.temp - 32) + "px"
        });
      } else if (scope.propName === "setnvheight") {
        $(".setnvheight").css({
          height: (scope.temp + 25) + "px"
        });
      }
      scope.style = function() {
        return {
          height: (scope.temp + 28) + "px"
        };
      };
    }), true);
    w.bind("resize", function() {
      scope.$apply();
    });
    scope.$watch((function() {
      return angular.element('body').attr("class");
    }), function(newValue) {
      if (newValue === 'main-nav-closed') {
        scope.CalcHeight();
        if (scope.propName === "setnavheight") {
          $(".setnavheight").css({
            height: (scope.temp + 28) + "px"
          });
        }
        scope.style = function() {
          return {
            height: (scope.temp + 28) + "px"
          };
        };
        return scope.$apply();
      }
    });
  };
});
