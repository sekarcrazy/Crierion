var app, services;

services = angular.module("asweb.services");

services.factory("AppConfigFactory", function($resource, GenericUtilities) {
  return $resource("" + APISystemVariableURL + "/variables/systemvariables", {}, {
    show: {
      method: "GET",
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

services.factory("APIPostFactory", function($resource, GenericUtilities) {
  return $resource("" + APIBaseUrl + "/apis", {}, {
    createAPI: {
      method: "POST",
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

services.factory("APIExecuteFactory", function($resource, GenericUtilities) {
  return $resource("" + APIBaseUrl + "/apis/execute", {}, {
    executeAPI: {
      method: "POST",
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

services.factory("APIPutFactory", function($resource, GenericUtilities) {
  return $resource("" + APIBaseUrl + "/apis/:APIId", {}, {
    update: {
      method: "PUT",
      params: {
        APIId: "@APIId"
      },
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

services.factory("GroupPutFactory", function($resource, GenericUtilities) {
  return $resource("" + APIBaseUrl + "/groups/:APIGroupId", {}, {
    update: {
      method: "PUT",
      params: {
        APIGroupId: "@APIGroupId"
      },
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

services.factory("GroupPostFactory", function($resource, GenericUtilities) {
  return $resource("" + APIBaseUrl + "/groups", {}, {
    createGroup: {
      method: "POST",
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

services.factory("FeedbackGetFactory", function($resource, GenericUtilities) {
  return $resource("" + FeedBackUrl + "feedback/User/:userName/Page/:pageName/StartDt/:startDate/EndDt/:endDate", {}, {
    get: {
      method: "GET",
      params: {
        userName: "@userName",
        pageName: "@pageName",
        startDate: "@startDate",
        endDate: "@endDate"
      },
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

services.factory("FeedbackPostFactory", function($resource, GenericUtilities) {
  return $resource("" + FeedBackServiceURL, {}, {
    createFB: {
      method: "POST",
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

services.factory("FeedbackGetUserFactory", function($resource, GenericUtilities) {
  return $resource(FeedBackUsernameUrl, {}, {
    get: {
      method: "GET",
      headers: {
        TokenHeaderName: GenericUtilities.getAuthToken()
      }
    }
  });
});

angular.module('asweb.services').service('aswebGlobal', function($rootScope, $http, $q, GenericUtilities) {
  var TokenHeaderName, TokenHeaderValue, service;
  TokenHeaderName = "x-auth-token";
  TokenHeaderValue = document.cookie.replace(/(?:(?:^|.*;\s*)identityToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  return service = {
    currentApp: null,
    applicationTopMenu: null,
    configureApplicationMenuItems: function(app, topMenu) {
      service.currentApp = app;
      service.applicationTopMenu = topMenu;
      return $rootScope.$broadcast("asweb.app.change");
    },
    getFeedBackUserName: function() {
      var configkeys, deferred, url;
      configkeys = [];
      deferred = void 0;
      deferred = $q.defer();
      url = "https://dev.si.rackspace.com/Getuser.ashx";
      $http.defaults.headers.common[TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.get(url).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      }).error(function(data, status, headers, config) {
        return deferred.resolve({
          success: false,
          response: data,
          status: status,
          headers: headers,
          config: config
        });
      });
      return deferred.promise;
    },
    saveFeedBack: function(data) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = "/cor-redirect/feedback/";
      $http.defaults.headers.common[TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.post(url, data).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          response: data,
          status: status,
          headers: headers,
          config: config
        });
      }).error(function(data, status, headers, config) {
        return deferred.resolve({
          success: false,
          response: data,
          status: status,
          headers: headers,
          config: config
        });
      });
      return deferred.promise;
    }
  };
});

angular.module('asweb.services').service('SessionService', function($http, $q) {
  var service;
  return service = {
    getSessionData: function() {
      var userName;
      userName = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (!userName) {
        userName = ARIC.Config.TestUser;
      }
      return userName;
    }
  };
});

angular.module('asweb.services').service('SessionServiceLogout', function($http, $q) {
  var service;
  return service = {
    logoutSession: function() {
      var deferred, url;
      deferred = $q.defer();
      url = '/cor-logoff/sessionmanagement.ashx?mode=logoff';
      $http.get(url).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      }).error(function(data, status, headers, config) {
        return deferred.resolve({
          success: false,
          response: data,
          status: status,
          headers: headers,
          config: config
        });
      });
      return deferred.promise;
    }
  };
});

angular.module('asweb.services').factory("GenericUtilities", [
  "$rootScope", "SessionServiceLogout", function($rootScope, SessionServiceLogout) {
    var factory;
    factory = {
      getCacheValue: function(cacheValue, ouName) {
        if (cacheValue === "" || cacheValue === void 0) {
          cacheValue = 'core.' + ouName + '.com';
        }
        return cacheValue;
      },
      getMatrix: function(cacheValue, ouName) {
        var cache, matrix;
        matrix = [];
        cacheValue = factory.getCacheValue(cacheValue, ouName);
        cache = {
          Type: 'Cache',
          Key: cacheValue
        };
        matrix.push(cache);
        return matrix;
      },
      clearBrowserCache: function() {
        factory.removeFromLocalStorage('selectedBH');
        factory.removeFromLocalStorage('selectedPH');
        factory.deleteCookie("userName");
        factory.deleteCookie("identityToken");
        factory.deleteCookie("ASP.NET_SessionId");
      },
      deleteCookie: function(name) {
        var expires;
        expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = name + "=;" + expires + "; path=/";
      },
      removeFromLocalStorage: function(key) {
        localStorage.removeItem(key);
      },
      getProcessMatrix: function(cacheValue, ouName) {
        var processMatrix;
        processMatrix = {
          CallingApplication: "",
          Matrix: ""
        };
        processMatrix.Matrix = factory.getMatrix(cacheValue, ouName);
        processMatrix.CallingApplication = "actionbuilder";
        return JSON.stringify(processMatrix);
      },
      verifyMenuAccess: function(data, topMenu, domMenu, version) {
        var i, isAccess, menu;
        isAccess = false;
        if (data && data.menus && data.menus.length > 0) {
          i = 0;
          while (i < data.menus.length) {
            menu = data.menus[i];
            if (menu.MenuURL.toLowerCase().indexOf(version) !== -1) {
              topMenu = factory.updateMenuAccess(menu, topMenu);
            }
            i++;
          }
        }
        domMenu = factory.loadMenu(topMenu, domMenu);
        return domMenu;
      },
      updateMenuAccess: function(menu, topMenu) {
        var i, j;
        if (menu && topMenu) {
          i = 0;
          while (i < topMenu.length) {
            if (topMenu[i] && topMenu[i].MenuName === menu.MenuName) {
              topMenu[i].IsEnable = true;
              topMenu[i].MenuName = menu.MenuName;
              if (topMenu[i].Submenus && topMenu[i].Submenus.length > 0) {
                j = 0;
                while (j < topMenu[i].Submenus.length) {
                  if (topMenu[i].Submenus[j]) {
                    topMenu[i].Submenus[j].IsEnable = true;
                  }
                  j++;
                }
              }
            }
            i++;
          }
        }
        return topMenu;
      },
      loadMenu: function(topMenu, domMenu) {
        var i, j, menu, menus, newA, newLI, newSubA, newSubLI, newSubUL;
        menus = topMenu;
        if (menus && menus.length > 0) {
          i = 0;
          while (i < menus.length) {
            if (menus[i]) {
              menu = menus[i];
              newLI = document.createElement("li");
              newA = document.createElement("a");
              newSubUL = null;
              if (menu.Submenus) {
                newLI.setAttribute("class", "has-dropdown not-click");
                newLI.setAttribute("id", "TopMenus-" + i);
                newA.setAttribute("tabindex", "-1");
                newA.setAttribute("style", "cursor: default");
                newSubUL = document.createElement("ul");
                newSubUL.setAttribute("class", "dropdown");
                j = 0;
                while (j < menu.Submenus.length) {
                  newSubLI = document.createElement("li");
                  newSubA = document.createElement("a");
                  newSubA.textContent = menu.Submenus[j].MenuName;
                  if (menu.Submenus[j].IsEnable) {
                    newSubA.setAttribute("href", menu.Submenus[j].MenuURL);
                  } else {
                    newSubA.setAttribute("style", "color:#999999;cursor: default");
                  }
                  newSubLI.appendChild(newSubA);
                  newSubUL.appendChild(newSubLI);
                  j++;
                }
              } else {
                if (menu.IsEnable) {
                  newA.setAttribute("href", menu.MenuURL);
                }
              }
            }
            if (!menu.IsEnable) {
              newA.setAttribute("style", "color:#999999;cursor: default");
            }
            newA.textContent = menu.MenuName;
            newLI.appendChild(newA);
            if (newSubUL) {
              newLI.appendChild(newSubUL);
            }
            domMenu.appendChild(newLI);
            i++;
          }
        }
        return domMenu;
      },
      getAuthToken: function() {
        var genericUtilities, sessionLogout, token;
        token = document.cookie.replace(/(?:(?:^|.*;\s*)identityToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        genericUtilities = this;
        if (location.host === "localhost") {
          token = aric.TokenHeaderValue;
        } else if (!token) {
          sessionLogout = SessionServiceLogout.logoutSession();
          if (($('base')[0].href).indexOf("/action/action-list") === -1) {
            $('base')[0].href = $('base')[0].href + '/action/action-list';
          }
          sessionLogout.then(function(data) {
            if (data.success) {
              genericUtilities.clearBrowserCache();
              return window.location.href = $('base')[0].href;
            } else {
              genericUtilities.clearBrowserCache();
              return window.location.href = window.location.origin;
            }
          });
        }
        return token;
      }
    };
    return factory;
  }
]);

angular.module('asweb.services').service("GroupService", function($rootScope, $http, $q, GenericUtilities) {
  var service;
  return service = {
    getEntityPermission: function(actionId) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.EntityPermissionURL + actionId;
      $http.defaults.headers.common[aric.TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.get(url).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      }).error(function(data, status, headers, config) {
        return deferred.resolve({
          success: false,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });
      return deferred.promise;
    },
    checkMatrixPermission: function(data) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.MatrixPermissionBaseURL + "/check";
      $http.defaults.headers.common[aric.TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.post(url, data).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      }).error(function(data, status, headers, config) {
        return deferred.resolve({
          success: false,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });
      return deferred.promise;
    },
    menuAccessAPI: function(data) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.MenuAccessURL;
      $http.defaults.headers.common[aric.TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.get(url).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      }).error(function(data, status, headers, config) {
        return deferred.resolve({
          success: false,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });
      return deferred.promise;
    }
  };
});

angular.module('asweb.services').service('APIService', function($rootScope, $http, $q, GenericUtilities) {
  var service;
  return service = {
    getAPI: function(APIId) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = ("" + APIBaseUrl + "/apis/") + APIId;
      $http.defaults.headers.common[TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.get(url).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      }).error(function(data, status, headers, config) {
        return deferred.resolve({
          success: false,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });
      return deferred.promise;
    },
    deleteAPI: function(APIId) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = ("" + APIBaseUrl + "/apis/") + APIId;
      $http.defaults.headers.common[TokenHeaderName] = GenericUtilities.getAuthToken();
      $http["delete"](url).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      }).error(function(data, status, headers, config) {
        return deferred.resolve({
          success: false,
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });
      return deferred.promise;
    }
  };
});

app = angular.module('asweb.services');

app.service('constants', function($rootScope, $http) {
  return {
    version: 'v1',
    ouname: 'rackspace',
    menus: [
      {
        "name": "API Integrator",
        "disabled": true,
        "class": "has-dropdown",
        "submenus": [
          {
            "name": "API List",
            "url": aric.APIIntegratorBaseUrl + "api-list",
            "disabled": true
          }, {
            "name": "API Integrator",
            "url": aric.APIIntegratorBaseUrl + "api-integrator",
            "disabled": true
          }
        ]
      }, {
        "name": "Action Builder",
        "disabled": true,
        "class": "has-dropdown",
        "submenus": [
          {
            "name": "Action List",
            "url": aric.ActionBuilderBaseUrl + "action/action-list",
            "disabled": true
          }, {
            "name": "Create Action",
            "url": aric.ActionBuilderBaseUrl + "create/action",
            "disabled": true
          }
        ]
      }, {
        "name": "Variable Builder",
        "disabled": true,
        "class": "has-dropdown",
        "submenus": [
          {
            "name": "Variable List",
            "url": aric.VariableBuilderBaseUrl + "variable-list",
            "disabled": true
          }, {
            "name": "Create Variable",
            "url": aric.VariableBuilderBaseUrl,
            "disabled": true
          }
        ]
      }, {
        "name": "Process Builder",
        "url": aric.ProcessBuilderBaseUrl,
        "disabled": true,
        "class": "",
        "menuClass": "cursor-pointer",
        "submenus": []
      }
    ]
  };
});
