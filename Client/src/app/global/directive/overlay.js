angular.module('nis.global.directive').directive('wcOverlay', ['$q', '$timeout', '$window', 'httpInterceptor', function ($q, $timeout, $window, httpInterceptor) {

    var link = function (scope, element, attrs) {
        var overlayContainer = null,
            timerPromise = null,
            timerPromiseHide = null,
            inSession = false,
            queue = [];

        init();

        function init() {
            wireUpHttpInterceptor();
            scope.show = false;
        }

        //Hook into httpInterceptor factory request/response/responseError functions                
        function wireUpHttpInterceptor() {

            httpInterceptor.requestSubscribe(function (config) {
                processRequest(config);
            });

            httpInterceptor.responseSubscribe(function (response) {
                processResponse(response);
            });

            httpInterceptor.responseErrorSubscribe(function (rejection) {
                processResponse(rejection);
            });
        }

        function processRequest() {
            queue.push({});
            if (queue.length == 1) {
                timerPromise = $timeout(function () {
                    if (queue.length) showOverlay();
                }, scope.wcOverlayDelay ? scope.wcOverlayDelay : 100); //Delay showing for 100 millis to avoid flicker
            }
        }

        function processResponse() {
            queue.pop();
            if (queue.length == 0) {
                //Since we don't know if another XHR request will be made, pause before
                //hiding the overlay. If another XHR request comes in then the overlay
                //will stay visible which prevents a flicker
                timerPromiseHide = $timeout(function () {
                    //Make sure queue is still 0 since a new XHR request may have come in
                    //while timer was running
                    if (queue.length == 0) {
                        hideOverlay();
                        if (timerPromiseHide) $timeout.cancel(timerPromiseHide);
                    }
                }, scope.wcOverlayDelay ? scope.wcOverlayDelay : 100);
            }
        }

        function showOverlay() {
            scope.show = true;
        }

        function hideOverlay() {
            if (timerPromise) $timeout.cancel(timerPromise);
            scope.show = false;
                
        }
    }
    return {
        restrict: 'EA',
        transclude: true,
        priority: 2000,
        scope: {
            wcOverlayDelay: "@"
        },
        template: '<div class="loader-backdrop" ng-show="show">' +
                        '<div class="overlayBackground"></div>' +
                        '<div class="overlayContent" data-ng-transclude>' +
                        '</div>' +
                    '</div>',        
        compile: function ( tElement, tAttributes) {
                tElement.removeClass("hide");
                return( link );

            }
    }
}]);
