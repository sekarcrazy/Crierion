(function () {
    angular.module('metrics.shared.service')
        .factory('sharedService',['$rootScope', function ($rootScope) {
            var sharedService = {};

            setActivePath = function(path) {
                sharedService.activePath = path;                
            };
            getActivePath = function() {
                return sharedService.activePath;
            };

            return {
                setActivePath:setActivePath,
                getActivePath:getActivePath
            };
        }]);
})();