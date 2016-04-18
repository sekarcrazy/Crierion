(function () {
    angular.module('metrics.layout.controller')
        .controller('shellCtrl', ['$scope', '$location',
            '$rootScope', 'constant', 'rx.exceptionHandler', 'logger',
            'appSettings','routehelper','$route', '$document','metricsMetadataService', '$state',
            function ($scope, $location, $rootScope, constant, exceptionHandler,
                logger, appSettings, routehelper, $route, $document, metricsMetadataService, $state) {
                var vm =this, log = logger.getInstance('Shell Control');
                log.log('Initializing shell control');
                                
                vm.CONST = constant;
                vm.showNav = true;
                vm.getCurrentRouterState = function () {
                    var value = routehelper.getCurrentState();
                    return value;
                };
                vm.isSpecificPage = function(specificPages, path) {
                    var path, ref;
                    path = path || $location.path();                    
                    return (ref = specificPages.indexOf(path) >= 0) != null ? ref : {
                    1: -1
                    };
                };
                
                vm.visibleNavRouterStateLst = [constant.dashboard.DASHBOARD_ROUTER_NAME, constant.dashboard.HOME_ROUTER_NAME];
                vm.visibleHeaderRouterLst = ['/404', '/page/404', '/page/500', '/page/login', '/page/signin', '/page/signin1', '/page/signin2', '/page/signup', '/page/signup1', '/page/signup2', '/page/lock-screen'];
                
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

                vm.onStateChange = function (routerName, stateParam, $event) {
                    $event && $event.preventDefault();
                    routehelper.goToState(routerName, stateParam);
                }

                vm.getNavigationList();
                
                $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                    vm.showNav = vm.isSpecificPage(vm.visibleNavRouterStateLst, toState.name);
                 });
                
                $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
                    //default route
                    if(currentRoute && currentRoute.$$route && currentRoute.$$route.url == '/'){
                        vm.showNav = true;
                    }
                    else{
                        var currentState = vm.getCurrentRouterState()
                        if(currentState)
                        {
                            vm.showNav = vm.isSpecificPage(vm.visibleNavRouterStateLst, currentState.name);
                        }
                    }
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