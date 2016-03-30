(function () {
    angular.module('nis.global.utility').factory('appUtility', function () {

        //Adding trim function
        if (typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            }
        }

        var showHideOverlay = function (value) {
            var overlayScope = angular.element($(".loader-backdrop")).scope();
            if (overlayScope) {
                overlayScope.show = value;
            }
        };
        return {
            showHideOverlay:showHideOverlay
        };
    });
})();