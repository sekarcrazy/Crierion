angular.module('nis.global.directive').directive('jqSlimScroll', ['$q', '$timeout', '$window', function ($q, $timeout, $window, httpInterceptor) {

    var link = function (scope, element, attrs) {
       
        init();

        function init() {
           $(element).slimScroll(JSON.parse(scope.slimScrollOption)); 
            $(element).slimscrollH(JSON.parse(scope.slimScrollOption)); 
        }
        scope.$on('$destroy', function () {
            //$(".slimScrollBar,.slimScrollRail").remove();
            //$(".slimScrollDiv").contents().unwrap();
            $(element).slimScroll({destroy: true});
            $(element).slimScrollH({destroy: true});
        })
        
    }
    return {
        restrict: 'EA',
        scope: {
            slimScrollOption: "@"
        },
        link:link
    }
}]);
