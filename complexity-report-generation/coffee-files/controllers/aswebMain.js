var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('asweb.controllers').controller('aswebMain', function($scope, $rootScope, $location, $routeParams, $document, aswebGlobal, SessionService, ActionBuilderService, actionBuilderCommonServices, SessionServiceLogout, GroupService, GenericUtilities, constants, $http, $filter) {
  var filter, ready;
  filter = $filter('filter');
  $scope.cacheURN = '';
  $scope.ouName = 'rackspace';
  $scope.cacheValue = '';
  $scope.bfdisabled = false;
  $scope.ischeckedRackspace = false;
  $scope.ischeckedSegment = false;
  $scope.ischeckedDivision = false;
  $scope.ischeckedTeam = false;
  $scope.ischeckedAccount = false;
  $scope.ischeckedDevice = false;
  $scope.onLoading = [
    {
      'value': 'loading',
      'text': 'loading...'
    }
  ];
  $scope.accessDenied = false;
  $scope.isNetworkFailed = false;
  $rootScope.matrixPermissionDenied = false;
  $rootScope.entityPermissionDenied = false;
  $scope.isContentEditable = false;
  $scope.fullscreenToggle = false;
  $rootScope.editAccess = true;
  $rootScope.matrixPermission = false;
  $scope.msgSettings = null;
  $scope.hideMessage = function() {
    return $scope.msgSettings = {
      visible: true
    };
  };
  $scope.isdisableddivision = true;
  $scope.isdisabledsegment = true;
  $scope.isdisabledAccount = true;
  $scope.isdisabledTeam = true;
  $scope.isdisabledDevice = true;
  $scope.objRackspace = [];
  $scope.objDivision = [];
  $scope.objSegment = [];
  $scope.objTeam = [];
  $scope.objAccount = [];
  $scope.objDevice = [];
  $scope.defaultValue = '';
  $scope.elements = [];
  $scope.isdisabledServiceLevel = false;
  $scope.isdisabledDeviceType = false;
  $scope.isdisabledOSType = false;
  $scope.isAllowExcpEnter = false;
  $rootScope.mode = {
    Create: 0,
    View: 1,
    Edit: 2
  };
  $rootScope.currentMode = -1;
  $scope.topBar = {
    title: {
      display: 'Automation Web',
      location: '#/hub',
      icon: 'fa fa-th'
    },
    menu: {
      APIIntegratorBaseUrl: "/aric/v1/api-integrator/",
      ActionBuilderBaseUrl: "/aric/v1/action-builder/",
      ProcessBuilderBaseUrl: "/aric/v1/process-builder/",
      VariableBuilderBaseUrl: "/aric/v1/variable-builder/"
    },
    feedback: "",
    errMsg: "",
    url: window.location.pathname.replace(/\//g, ""),
    user: ""
  };
  $scope.checkAccess = function() {
    var i, _results;
    i = 0;
    _results = [];
    while (i < $rootScope.menu.length) {
      if ($rootScope.menu[i].MenuName.toLowerCase() === "api integrator") {
        $scope.pageAccess = true;
        $scope.provideScreenAccess();
        i = $rootScope.menu.length;
      }
      i++;
      if ($scope.pageAccess === false) {
        _results.push($scope.blockScreenAccess(true));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  $http.defaults.headers.common[aric.TokenHeaderName] = GenericUtilities.getAuthToken();
  $scope.menuAccessPromise = GroupService.menuAccessAPI();
  $scope.menuAccessPromise.then(function(res) {
    var hasAccess, localMenuList, remoteMenuList;
    $scope.isNetworkFailed = false;
    remoteMenuList = res.data.menus || [];
    if (res && res.status !== 401) {
      $scope.isNetworkFailed = true;
    }
    hasAccess = filter(remoteMenuList, function(m) {
      return m.MenuName === aric.AppName;
    })[0];
    $scope.accessDenied = hasAccess != null ? false : true;
    localMenuList = constants.menus;
    localMenuList.forEach(function(parentMenu) {
      var menu;
      menu = filter(remoteMenuList, function(m) {
        return m.MenuName === parentMenu.name;
      })[0];
      if (menu != null) {
        parentMenu.disabled = false;
        return parentMenu.submenus.forEach(function(sub) {
          return sub.disabled = false;
        });
      } else {
        parentMenu.disabled = true;
        return parentMenu.submenus.forEach(function(sub) {
          return sub.disabled = true;
        });
      }
    });
    return $scope.menus = localMenuList;
  });
  $scope.initializeBH = function(businessData) {
    if (businessData) {
      $rootScope.cacheValue = businessData.getCache();
      if ($rootScope.currentPage === "action-list") {
        $rootScope.getActionlist();
        $rootScope.actionPermission();
      } else if ($rootScope.currentPage === "create-action") {
        $rootScope.initializeCreateAction();
      }
    }
  };
  $scope.ApplyFilters = function(businessData) {
    var defaultValue;
    console.log(businessData);
    defaultValue = 'core.' + $scope.ouName + '.com';
    if (businessData && businessData.loadProcess) {
      defaultValue = businessData.organization;
      $scope.getCacheValue(businessData, defaultValue);
    }
  };
  $scope.ApplyReset = function(businessData) {
    var defaultValue;
    console.log("reset here");
    defaultValue = 'core.' + $scope.ouName + '.com';
    if (businessData) {
      defaultValue = businessData.organization;
    }
    $scope.getCacheValue(businessData, defaultValue);
  };
  $scope.getCacheValue = function(businessData, defaultValue) {
    var prevcacheValue;
    prevcacheValue = $rootScope.cacheValue;
    if (businessData) {
      $rootScope.cacheValue = businessData.getCache();
    }
    if ($rootScope.cacheValue !== prevcacheValue) {
      if ($rootScope.currentPage === "action-list") {
        $rootScope.getActionlist();
        $rootScope.actionPermission();
      } else {
        $rootScope.initializeCreateAction();
      }
    }
  };
  $scope.showErrorMessage = function(message, title) {
    $scope.requiredValidationPopupMessage = message;
    return $scope.topBar.errMsg = message;
  };
  $scope.hasCurrentApp = function() {
    return ($scope.currentApp != null) && $scope.currentApp !== null;
  };
  $scope.currentUser = SessionService.getSessionData();
  $scope.loadMenus = function() {
    aswebGlobal.configureApplicationMenuItems(null, null);
    $scope.currentApp = aswebGlobal.currentApp;
    return $scope.applicationTopMenu = aswebGlobal.applicationTopMenu;
  };
  $scope.$on('asweb.app.change', function() {});
  $scope.loadMenus();
  $scope.$on("$locationChangeStart", function($scope, next, current) {});
  $scope.toggleBF = false;
  $scope.toggleCustom = function() {
    return $scope.toggleBF = ($scope.toggleBF === false ? true : false);
  };
  $scope.showFeedBackPop = function() {
    $scope.topBar.feedback = "";
    $scope.topBar.errMsg = "";
    $("#feedBackContainer").foundation("reveal", "open");
  };
  $scope.closeFeedbackPopup = function() {
    $scope.topBar.feedback = "";
    $scope.topBar.errMsg = "";
    $("#feedBackContainer").foundation("reveal", "close");
  };
  $scope.hidePopup = function(modalName) {
    $scope.topBar.feedback = "";
    $scope.topBar.errMsg = "";
  };
  $scope.saveFeedback = function() {
    var APIIPage, APIIPath, ActionBuilderPage, ActionBuilderPath, Feedback_Success, Feedback_Validation, ProcessBuilderPage, ProcessBuilderPath, VariableBuilderPage, VariableBuilderPath, promise1;
    Feedback_Validation = "Please enter the Comments";
    Feedback_Success = "Feedback submitted successfully";
    ProcessBuilderPath = "process-builder";
    ProcessBuilderPage = "Process Builder";
    ActionBuilderPath = "action-builder";
    ActionBuilderPage = "Action Builder";
    VariableBuilderPath = "variable-builder";
    VariableBuilderPage = "Variable Builder";
    APIIPath = "api-integrator";
    APIIPage = "API Integrator";
    $scope.topBar.errMsg = "";
    if ($scope.topBar.feedback === void 0 || $scope.topBar.feedback === "" || $scope.topBar.feedback === null) {
      $scope.topBar.errMsg = Feedback_Validation;
      return;
    }
    $scope.load = true;
    $("#txtareaCommt").attr("disabled", "disabled");
    $("#btnSave").attr("disabled", "disabled");
    $("#txtareaCommt").css("background-color", "white");
    if ($scope.topBar.url.toLowerCase().indexOf(ProcessBuilderPath) > 0) {
      $scope.topBar.url = ProcessBuilderPage;
    }
    if ($scope.topBar.url.toLowerCase().indexOf(ActionBuilderPath) > 0) {
      $scope.topBar.url = ActionBuilderPage;
    }
    if ($scope.topBar.url.toLowerCase().indexOf(VariableBuilderPath) > 0) {
      $scope.topBar.url = VariableBuilderPage;
    }
    if ($scope.topBar.url.toLowerCase().indexOf(APIIPath) > 0) {
      $scope.topBar.url = APIIPage;
    }
    promise1 = void 0;
    promise1 = aswebGlobal.getFeedBackUserName();
    promise1.then(function(data) {
      if (data.success) {
        $scope.feedbackPost(data.data);
      } else {
        $scope.feedbackPost("");
      }
    });
  };
  $scope.feedbackPost = function(user) {
    var objFB, promisePost;
    objFB = {
      "FBComments": $scope.topBar.feedback,
      "Page": $scope.topBar.url,
      "UserName": user,
      "LastModifiedBy": user
    };
    promisePost = void 0;
    promisePost = aswebGlobal.saveFeedBack(JSON.stringify(objFB));
    promisePost.then(function(data) {
      if (data.success) {
        $scope.topBar.feedback = "";
        $scope.load = false;
        $scope.closeFeedbackPopup();
        $("#txtareaCommt").removeAttr("disabled");
        return $("#btnSave").removeAttr("disabled");
      } else {
        $scope.topBar.errMsg = "Error: Feedback not saved.";
        $scope.topBar.feedback = "";
        $scope.load = false;
        $("#txtareaCommt").removeAttr("disabled");
        return $("#btnSave").removeAttr("disabled");
      }
    });
  };
  $scope.logoffValidation = function() {
    $scope.topBar.errMsg = "";
    $scope.topBar.feedback = null;
    AricMessage.showConfirmationMessage("Are you Sure to log off ?", $scope.logoffRedirect, $scope.closeLogoffPopUp);
  };
  $scope.logoffRedirect = function() {
    $scope.sessionServiceLogout = SessionServiceLogout.logoutSession();
    if (($('base')[0].href).indexOf("/action/action-list") === -1) {
      $('base')[0].href = $('base')[0].href + '/action/action-list';
    }
    $scope.sessionServiceLogout.then(function(data) {
      AricMessage.hideAricMessage();
      if (data.success) {
        GenericUtilities.clearBrowserCache();
        return window.location.href = $('base')[0].href;
      } else {
        GenericUtilities.clearBrowserCache();
        return window.location.href = window.location.origin;
      }
    });
  };
  $scope.closeLogoffPopUp = function() {
    $scope.topBar.errMsg = "";
    $scope.topBar.feedback = null;
    AricMessage.hideAricMessage();
  };
  $scope.checkUserRights = function() {
    var tmpItems;
    $rootScope.isAdminUser = false;
    tmpItems = actionBuilderCommonServices.getUserRole();
    return tmpItems.then((function(data) {
      if (data.status === 200) {
        if (__indexOf.call(data.response, "Admin") >= 0) {
          $rootScope.isAdminUser = true;
          $scope.menujson = [
            {
              "Name": "My Profile",
              "Status": "inactivemenu"
            }, {
              "Name": "Settings",
              "Status": "inactivemenu"
            }, {
              "Name": "Process Rights Management",
              "Status": "activemenu",
              "Href": aric.ProcessBuilderBaseUrl + "admin/management"
            }, {
              "Name": "Module Management",
              "Status": "inactivemenu"
            }, {
              "Name": "Role Management",
              "Status": "inactivemenu"
            }, {
              "Name": "Menu Management",
              "Status": "inactivemenu"
            }
          ];
        } else {
          $scope.menujson = [
            {
              "Name": "My Profile",
              "Status": "inactivemenu"
            }, {
              "Name": "Settings",
              "Status": "inactivemenu"
            }
          ];
        }
        $scope.initialiseUserProfilePanel();
      }
    }), function(err) {
      console.log("Failed");
    });
  };
  $scope.showUserProfilePanel = false;
  $scope.initialiseUserProfilePanel = function() {
    $('.hover-div').hover((function() {
      $scope.setUserProfileHighlight(1);
    }), function() {
      if (!$scope.showUserProfilePanel) {
        $scope.setUserProfileHighlight(0);
      }
    });
  };
  $scope.userProfileHideHandler = function(ev) {
    $scope.$apply(function() {
      $scope.toggleUserProfile(ev);
      $scope.setUserProfileHighlight(0);
    });
  };
  $scope.toggleUserProfile = function(ev) {
    $scope.showUserProfilePanel = !$scope.showUserProfilePanel;
    if ($scope.showUserProfilePanel) {
      ev.stopPropagation();
      $document.bind('click', $scope.userProfileHideHandler);
    } else {
      $document.unbind('click', $scope.userProfileHideHandler);
    }
  };
  $scope.setUserProfileHighlight = function(mode) {
    if (mode === 1) {
      $('.greenStripe').css('background', '#029F1C');
      $(".top-bar-section .has-dropdown > a.addhvr").addClass("onmenuhover");
    } else {
      $('.greenStripe').css('background', 'transparent');
      $(".top-bar-section .has-dropdown > a.addhvr").removeClass("onmenuhover");
    }
  };
  $scope.showManageAccessPopup = function() {
    var id, promiseActionGet, username;
    $("#manageAccessContainer").foundation("reveal", "open");
    username = $scope.currentUser != null ? $scope.currentUser : "notdefined";
    id = $rootScope.actionId != null ? $rootScope.actionId : "notdefined";
    promiseActionGet = ActionBuilderService.getActionDetails($scope.actionId);
    return promiseActionGet.then(function(data) {
      var error;
      if (data.success) {
        return $scope.getRoles(id, username, "Action", $rootScope.currentMode === $rootScope.mode.View, $rootScope.showManageAccessButton, JSON.stringify(data.data.Matrix));
      } else {
        error = '';
        if (data.data !== null && data.data !== '') {
          error = "ERROR:" + data.data.Error;
        } else {
          error = "ERROR: Failed to get matrix";
        }
        return $scope.getRoles(id, username, "Action", $rootScope.currentMode === $rootScope.mode.View, $rootScope.showManageAccessButton, error);
      }
    });
  };
  $scope.toggleFullScreen = function() {
    $scope.fullscreenToggle = ($scope.fullscreenToggle === false ? true : false);
    $("body").toggleClass("main-nav-closed");
  };
  ready = function() {
    window.AricMessage = new ARIC.Message();
    window.AricMessage.init(".geMessageContainer", "msgSettings");
    return $scope.checkUserRights();
  };
  return $(document).ready(ready);
});

"use strict";

angular.module('asweb.services').service('actionBuilderCommonServices', function($rootScope, $http, $q, GenericUtilities) {
  var service;
  return service = {
    getUserRole: function() {
      var deferred;
      deferred = void 0;
      deferred = $q.defer();
      $http.defaults.headers.common[aric.TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.get(aric.UserRightsURL).success(function(data, status, headers, config) {
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
