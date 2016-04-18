var appRoutes, routeTypes;

routeTypes = {
  view: 'templateUrl',
  redirect: 'redirectTo'
};

appRoutes = [
  {
    name: 'Main Hub',
    route: '/hub/',
    type: 'view',
    locaiton: 'partials/application-hub.html'
  }, {
    name: 'Aric 2.5 Action Builder',
    route: '/create/action',
    type: 'view',
    location: 'partials/create-action.html'
  }, {
    name: 'Aric 2.5 Action Builder',
    route: '/action/action-list',
    type: 'view',
    location: 'partials/action-list.html'
  }, {
    name: 'Aric 2.5 Action Builder',
    route: '/group/:apiGroupId',
    type: 'view',
    location: 'partials/create-action.html'
  }, {
    name: 'Aric 2.5 Action Builder',
    route: '/action/:aId',
    type: 'view',
    location: 'partials/create-action.html'
  }, {
    name: 'Aric 2.5 Action Builder',
    route: '/',
    type: 'view',
    location: 'partials/create-action.html'
  }
];

angular.module('asweb', ['ngRoute', 'asweb.filters', 'asweb.services', 'asweb.directives', 'asweb.controllers', 'ui.select2', 'mm.foundation', 'angular-loading-bar', 'ngAnimate', 'ui.select']).factory('$exceptionHandler', function() {
  return function(exception, cause) {
    var errObj;
    errObj = {
      'Exception': {
        'app': 'ActionBuilder',
        'message': exception.message,
        'cause': cause
      }
    };
    console.log(JSON.stringify(errObj));
  };
}).config([
  '$routeProvider', '$locationProvider', function($route, $locationProvider) {
    angular.forEach(appRoutes, (function(app) {
      var thisRoute;
      thisRoute = {};
      thisRoute[routeTypes[app.type]] = app.location;
      return $route.when(app.route, thisRoute);
    }));
    $route.otherwise({
      redirectTo: '/'
    });
    return $locationProvider.html5Mode(true);
  }
]);

angular.module('asweb.filters', []);

angular.module('asweb.services', ['ngResource']);

angular.module('asweb.directives', []);

angular.module('asweb.controllers', []);
