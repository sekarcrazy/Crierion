(function () {
    angular.module("nis.security.privilege").factory("securityAuthPrivilege", [
      "securityApi", "$q", function (securityApi, $q) {
          var promiseQueue, requestInProgress, service, triggerCallBackQueue;
          promiseQueue = [];
          requestInProgress = false;
          triggerCallBackQueue = function () {
              var len;
              requestInProgress = false;
              len = promiseQueue.length;
              while (len--) {
                  if (service.loggedUser) {
                      promiseQueue[len].resolve(service.loggedUser);
                  } else {
                      promiseQueue[len].reject();
                  }
              }
              promiseQueue = [];
          };
          service = {
              loggedUser: null,
              requestLoggedUser: function () {
                  var defer, loggedUserReq;
                  if (service.isLoggedUsrAvailable()) {
                      return $q.when(service.loggedUser);
                  } else {
                      if (requestInProgress) {
                          defer = $q.defer();
                          promiseQueue.push(defer);
                          return defer.promise;
                      }
                      requestInProgress = true;
                      loggedUserReq = securityApi.retrieveUser.apply(null, [].slice.call(arguments));

                      //coffee script didnt allow
                      loggedUserReq.$promise["catch"](function () {
                          triggerCallBackQueue();
                      });
                      return loggedUserReq.$promise.then(function (response) {
                          service.loggedUser = response.data.user;
                          triggerCallBackQueue();
                      });
                  }
              },
              isLoggedUsrAvailable: function () {
                  return !!service.loggedUser;
              },
              isEditRole: function () {
                  return !!(service.loggedUser && service.loggedUser.role && service.loggedUser.role.isEdit);
              },
              isReadRole: function () {
                  return !!(service.loggedUser && service.loggedUser.role && service.loggedUser.role.isRead);
              },
              isAdmin: function () {
                  return !!(service.loggedUser && service.loggedUser.isAdmin);
              },
              getLoginFailedReason: function () { }
          };
          return service;
      }
    ]);
})();
