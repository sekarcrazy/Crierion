﻿(function () {
    'use strict';
    angular.module('metrics.core')
        .provider('constant', [function () {
            var constant = {};
            this.configureConstant = function (constantDef) {
                angular.extend(constant, constantDef);
            };

            function getConstants() {
                return constant;
            };

            this.$get = [function () {
                return getConstants();
            }];
            return;
        }]);
})();
