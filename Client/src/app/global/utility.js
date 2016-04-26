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
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        return {
            showHideOverlay:showHideOverlay,
            getRandomColor:getRandomColor
        };
    });
})();