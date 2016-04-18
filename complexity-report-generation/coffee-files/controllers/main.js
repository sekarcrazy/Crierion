"use strict";
angular.module('asweb.controllers').controller('MainCtrl', function($scope, $location, $routeParams) {
  $scope.appMenu = {
    display: 'Aric 2.5',
    location: '/aric/v1/action-builder',
    icon: 'fa fa-play'
  };
  return $scope.topMenu = {
    display: '',
    items: [
      {
        display: 'Process Viewer',
        location: '/',
        icon: 'fa fa-th'
      }, {
        display: 'Action Editor',
        location: '/',
        icon: 'fa fa-list-ul'
      }
    ]
  };
});
