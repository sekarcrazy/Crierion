(function () {
    angular.module('metrics.layout.controller')
        .controller('shellCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings','routehelper','$route', '$document','metricsMetadataService',
            function ($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document, metricsMetadataService) {
                var vm =this, log = logger.getInstance('Shell Control');
                log.log('Initializing shell control');
                                
                
                vm.getCurrentRouterState = function () {
                    var value = routehelper.getCurrentState();
                    return value;
                };
                vm.isSpecificPage = function() {
                    var path, ref, specificPages;
                    path = $location.path();
                    specificPages = ['/404', '/page/404', '/page/500', '/page/login', '/page/signin', '/page/signin1', '/page/signin2', '/page/signup', '/page/signup1', '/page/signup2', '/page/lock-screen'];
                    return (ref = specificPages.indexOf(path) >= 0) != null ? ref : {
                    1: -1
                    };
                };
                vm.main = {
                    brand: 'CRITERION',
                    name: 'Lisa Doe'
                };
                vm.getNavigationList = function () {
                    metricsMetadataService.getNavigationList({}, function (response) {
                        if (response && response.length > 0) {
                            vm.navList = response;
                        }
                    });
                }

                vm.navigateToDashboard = function (storyType, projectName, storyId, lang, $event) {
                    $event && $event.preventDefault();
                    routehelper.goToState(constant.dashboard.DASHBOARD_ROUTER_NAME, { storyType: storyType, projectName: projectName, story_id: storyId, lang: lang });
                }

                vm.getNavigationList();

                return $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
                    if ($document && $document.scrollTo) {
                        return $document.scrollTo(0, 0);
                    }
                });

                //throw new exceptionHandler.WarningError('Unhandled exception');
                //$rootScope.$broadcast(constant.publisherEventPayLoad.SHOW_NOTIFY_COMMAND, new exceptionHandler.SuccessAlert('success '));
                //$rootScope.$broadcast(constant.publisherEventPayLoad.SHOW_NOTIFY_COMMAND, new exceptionHandler.SuccessAlert('dfsdfsd  sdf sdf sdf sdf sd '));
                
            }]).controller('NavCtrl', ['$scope', function($scope) {
                
                
            }]);
})();