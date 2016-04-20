(function() {
    angular.module('nis.global.filter').filter('transformObjKeysToArr',
        [function() {
            return function(object) {
                var result = [];
                angular.forEach(object, function(value, key) {
                    result.push(key);
                });
                return result;
            }
        }]);
})();