(function () {
    angular.module('metrics.core').factory('authTokenInterceptor', ['$cookies', '$window',
        function ($cookies, $window) {
            return {
                request: function (config) {
                    config.headers["Content-Type"] = "application/json";
                    //config.headers["X-Auth-Token"] = "AAA41e660i2vUPjP8R6kLxVl1XjmnwtWZ5sYoLm0SHk_i-q0XzpHqTbg4Nr_dfGps0YvHD-t0F3ydT6JPiqMSsLk27IM5q7i9EwhUytyHaviKlqzs5d-JFRQ";
                    if (!$cookies.rax_auth_token) {
                        if (!angular.isDefined($cookies.rax_auth_token)) {
                            var path = "unauthorized.html";
                            //$window.location.href = '/identity/?ref=/control-panel/metrics/#/';
                        }
                    }
                    else {
                        var token = $cookies.rax_auth_token;
                        //config.headers['rax_auth_token'] = $cookies.rax_auth_token;
                    }
                    return config;
                }
            }
        }]);
})();