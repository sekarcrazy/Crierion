angular.module("asweb.directives").directive("bnSlideShow", function() {
  var link;
  link = function($scope, element, attributes) {
    var duration, expression;
    expression = attributes.bnSlideShow;
    duration = attributes.slideShowDuration || "fast";
    if (!$scope.$eval(expression)) {
      element.hide();
    }
    $scope.$watch(expression, function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      if (newValue) {
        element.stop(true, true).slideDown(duration);
      } else {
        element.stop(true, true).slideUp(duration);
      }
    });
  };
  return {
    link: link,
    restrict: "A"
  };
});
