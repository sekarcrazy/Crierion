/**
 * UtilService
 *
 * @description :: Business-side logic for managing common func
 * 
 */
var sailsUtils = require('util'),
Promise = require("bluebird");

module.exports = {
  
  stringFormat:sailsUtils.format, 
   
  promiseWhile:function(condition, action) {
        return new Promise(function(resolve, reject) {
            var loop = function() {
            if (!condition()) return resolve();
            return Promise.cast(action())
                .then(loop)
                .catch(function(e) {
                reject(e);
                });
            };
            process.nextTick(loop);
        });
    }
};