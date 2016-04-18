angular.module('asweb.controllers').controller('CreateActionCtrl', function($scope, $rootScope, $location, $route, $routeParams, ActionBuilderService, SessionService, aswebGlobal, DataBasket, GenericUtilities, GroupService, accessService) {
  var GetAPIGroupOutputData, GetAPiGroupDetails, GetActionDetailsN, PropControlsFix, emptyItem, getInputParamsIndex, guid, matrixValue, promise, promise5, promiseActionGet, promiseGroup, resetColIndex, resetDictionaryItems, resetIndex, s4, setActionGridControls, sortableEle,
    _this = this;
  $scope.apiIntegratorGroupId = "";
  $scope.actionId = "";
  $rootScope.actionId = "";
  promise = void 0;
  promiseActionGet = void 0;
  promiseGroup = void 0;
  $scope.currentStep = 0;
  $scope.processedSteps = [];
  $scope.previousFixedPropControls = [];
  $scope.propertiesAssignedToGridControls = [];
  $scope.fixedPropertiesMissingValues = [];
  $scope.requiredValidationPopupMessage = void 0;
  $scope.inputParamsForFixedProperties = [];
  $scope.fixedSelected = true;
  $scope.selectedCell = {};
  $scope.FinalAction = new Object();
  $scope.selectedCell.row = 1;
  $scope.selectedCell.col = 1;
  $scope.fixedPropControls = [];
  $scope.catControls = [];
  $scope.DeletedListItems = [];
  $scope.FinalAction.Category = [];
  $scope.FinalAction.Labels = [];
  $scope.FinalAction.Outputs = [];
  $scope.FinalAction.Permissions = new Object();
  $scope.FinalAction.FixedProperties = new Object();
  $scope.FinalAction.DefaultProperties = new Object();
  $scope.FinalAction.PropertyDefinitions = new Object();
  $scope.isCreateAction = false;
  $rootScope.bhdisabled = true;
  $scope.ViewMode = false;
  $scope.editMode = false;
  $rootScope.currentPage = "create-action";
  $scope.FinalAction.Execution = new Object();
  $scope.FinalAction.Execution.LibraryInfo = new Object();
  $scope.oldPropDefListItems = [];
  $scope.isVisible = false;
  $scope.showOuterDiv = true;
  $scope.iconClass = "fa fa-caret-down fa-2x";
  $scope.APIGroupsWithoutInputs = [];
  $scope.APIGroupsWithoutInputsLoaded = false;
  $scope.APIGroupsWithoutInputs.push(emptyItem = {
    APIGroupId: "",
    APIGroupName: ""
  });
  $scope.APIGroupId = void 0;
  promise5 = void 0;
  matrixValue = new Object();
  $scope.validFields = {};
  $scope.validFields.isntVAPIType = false;
  $scope.validFields.isntVAPIGrp = false;
  $scope.validFields.isntVDllName = false;
  $scope.validFields.isntVClsName = false;
  $scope.validFields.isntVMtdName = false;
  $scope.validFields.isntVABForm = false;
  $scope.validFields.isntVMapping = false;
  $scope.validFields.isntVRequired = false;
  $scope.validFields.isntVpopup = false;
  $scope.validFields.isntVProp = false;
  $scope.validFields.isntVFixProp = false;
  $scope.showInvalidCharacterMessage = false;
  $scope.invalidActionName = false;
  $scope.categories = [];
  $scope.treeApi = null;
  $scope.categoryData = [];
  $scope.categoryTreeList = [];
  $scope.categoryHashTable = [];
  $scope.tempCategory = [];
  $scope.selectedTreeItem = null;
  $scope.isAddNewCatogory = false;
  $scope.newCategory = "";
  $scope.categorySearch = "";
  $scope.actionGrid = [];
  $rootScope.currentMode = $rootScope.mode.Edit;
  $scope.getMatrixPermission = function() {
    var result;
    $rootScope.matrixPermissionDenied = false;
    $scope.resetAction();
    if ($routeParams && $routeParams.apiGroupId) {
      $scope.apiIntegratorGroupId = $routeParams.apiGroupId;
    }
    result = true;
    $rootScope.matrixPermission = false;
    if ($rootScope.cacheValue === void 0) {
      $rootScope.cacheValue = GenericUtilities.getCacheValue($rootScope.cacheValue, "rackspace");
    }
    $scope.processMatrix = GenericUtilities.getProcessMatrix($rootScope.cacheValue, "rackspace");
    $scope.tmpRolesItems = ActionBuilderService.checkMatrixPermission($scope.processMatrix);
    console.log($scope.tmpRolesItems);
    $scope.tmpRolesItems.then(function(data) {
      if (data && data.data && data.data.length > 0) {
        $scope.editPermission = data.data === "true";
        if (!$scope.editPermission && !$rootScope.isAdminUser) {
          $rootScope.matrixPermissionDenied = true;
          $rootScope.showManageAccessButton = false;
          $rootScope.matrixPermission = false;
          $scope.currentStep = $scope.editMode ? 0 : -2;
          result = false;
        } else {
          $rootScope.matrixPermission = true;
          $rootScope.editAccess = true;
          if ($scope.editMode) {
            $scope.currentStep = 0;
          } else if ($scope.apiIntegratorGroupId) {
            $scope.currentStep = 0;
          } else {
            $scope.currentStep = -2;
          }
        }
      } else if ($scope.editMode) {
        $scope.currentStep = 0;
      } else {
        $scope.currentStep = -2;
      }
      GetAPiGroupDetails();
      GetActionDetailsN();
      if (result === true) {
        $rootScope.showManageAccessButton = true;
        matrixValue.Matrix = GenericUtilities.getMatrix($rootScope.cacheValue, "rackspace");
        promise5 = ActionBuilderService.GetAllAPIGroups("internal", matrixValue);
        return promise5.then(function(data) {
          var APIGroupList, APIGroupObj, i;
          if (data.success) {
            APIGroupList = [];
            APIGroupObj = {};
            i = 0;
            while (i < Object.keys(data.data).length) {
              APIGroupObj = {};
              APIGroupObj.text = data.data[Object.keys(data.data)[i]].APIGroupName;
              APIGroupObj.value = data.data[Object.keys(data.data)[i]].APIGroupId;
              APIGroupList.push(APIGroupObj);
              i++;
            }
            $scope.APIGroups = APIGroupList;
            angular.forEach(data.data, (function(item) {
              if (['', null, void 0].indexOf(item.DataStore) === -1) {
                if (['', null, void 0].indexOf(item.DataStore.InputParams) !== -1 || jQuery.isEmptyObject(item.DataStore.InputParams)) {
                  if (['', null, void 0].indexOf(item.DataStore.OutputParams) === -1 && item.DataStore.OutputParams.length > 0) {
                    return angular.forEach(item.DataStore.OutputParams, (function(outputParams) {
                      if (outputParams["Key"] === "Output") {
                        return $scope.APIGroupsWithoutInputs.push(item);
                      }
                    }));
                  }
                }
              }
            }));
            GetActionDetailsN();
            return $scope.loadComplete = true;
          } else {
            GetActionDetailsN();
            return $scope.loadComplete = true;
          }
        });
      } else {
        return $scope.loadComplete = true;
      }
    });
  };
  if ($route.current.$$route.originalPath === "/create/action" || $route.current.$$route.originalPath === "/") {
    $scope.currentStep = -2;
    $rootScope.bhdisabled = false;
    $scope.isCreateAction = true;
    $rootScope.currentMode = $rootScope.mode.Create;
    ActionBuilderService.action = JSON.parse(JSON.stringify(ActionBuilderService.defaultAction));
  }
  $scope.actionGrid = ActionBuilderService.action.grid;
  $scope.SourceType = new Object();
  $scope.apiIntegratorGroupId = $routeParams.apiGroupId;
  $scope.actionId = $rootScope.actionId = $routeParams.aId;
  if (['', null, void 0].indexOf($scope.actionId) === -1) {
    $scope.editMode = true;
  }
  $scope.FinalAction.Type = "APIINTEGRATOR";
  $scope.Operation = void 0;
  $scope.loadComplete = false;
  $scope.getLoggedinUser = function() {
    if ($scope.currentUser === void 0) {
      $scope.currentUser = $rootScope.currentUser;
    }
    if ($scope.currentUser === void 0 && $rootScope.currentUser === void 0) {
      return $scope.currentUser = $("#loggedon_user").text().trim();
    }
  };
  $scope.getEntityPermission = function(groupId) {
    var tmpItems;
    $rootScope.manageAccess = false;
    $rootScope.Access = false;
    $scope.getLoggedinUser();
    tmpItems = GroupService.getEntityPermission(groupId);
    tmpItems.then((function(data) {
      var item, permission, _i, _len, _ref;
      if (data.success) {
        permission = data.data;
        if (permission.Permissions && permission.Permissions.InternalIdentity.AllowedAccess.Owner.Users) {
          _ref = permission.Permissions.InternalIdentity.AllowedAccess.Owner.Users;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (item.UserName === $scope.currentUser) {
              $rootScope.Access = true;
              $rootScope.showManageAccessButton = true;
            }
          }
        }
      }
      if (!$scope.checkUserRoles) {
        $scope.checkUserRoles = false;
      }
      if ($scope.checkUserRoles === false && $rootScope.Access === false) {
        return $scope.checkforUserRoles();
      }
    }), function(err) {
      return console.log("Failed");
    });
  };
  $scope.checkforUserRoles = function() {
    var tmpItems;
    $scope.checkUserRoles = false;
    $scope.getLoggedinUser();
    if ($scope.currentUser) {
      $rootScope.manageAccess = false;
      tmpItems = accessService.getUserRole($scope.currentUser);
      return tmpItems.then(function(data) {
        var i, tmp, _results;
        $scope.checkUserRoles = true;
        if (data.success) {
          tmp = data.response;
          i = 0;
          _results = [];
          while (i < data.response.length) {
            if (data.response[i].toLowerCase() === "admin") {
              $rootScope.manageAccess = true;
              $rootScope.showManageAccessButton = true;
              i = data.response.length;
            }
            _results.push(i++);
          }
          return _results;
        }
      });
    }
  };
  $rootScope.initializeCreateAction = function() {
    $('#entityPermissionDeniedMessage').addClass('hideSection').removeClass('unhideSection');
    AricMessage.hideAricMessage();
    $scope.generateCategory();
    if (!$routeParams.aId) {
      return $scope.getMatrixPermission();
    } else {
      GetAPiGroupDetails();
      GetActionDetailsN();
      $rootScope.showManageAccessButton = true;
      matrixValue.Matrix = GenericUtilities.getMatrix($rootScope.cacheValue, "rackspace");
      promise5 = ActionBuilderService.GetAllAPIGroups("internal", matrixValue);
      return promise5.then(function(data) {
        if (data.success) {
          $scope.APIGroups = data.data;
          angular.forEach(data.data, (function(item) {
            if (['', null, void 0].indexOf(item.DataStore) === -1) {
              if (['', null, void 0].indexOf(item.DataStore.InputParams) !== -1 || jQuery.isEmptyObject(item.DataStore.InputParams)) {
                if (['', null, void 0].indexOf(item.DataStore.OutputParams) === -1 && item.DataStore.OutputParams.length > 0) {
                  return angular.forEach(item.DataStore.OutputParams, (function(outputParams) {
                    if (outputParams["Key"] === "Output") {
                      return $scope.APIGroupsWithoutInputs.push(item);
                    }
                  }));
                }
              }
            }
          }));
          GetActionDetailsN();
          return $scope.loadComplete = true;
        } else {
          GetActionDetailsN();
          return $scope.loadComplete = true;
        }
      });
    }
  };
  resetDictionaryItems = function(dict) {
    return angular.forEach(dict, (function(valueProp, keyProp) {
      return dict[keyProp] = "";
    }));
  };
  GetAPiGroupDetails = function() {
    if (['', null, void 0].indexOf($scope.apiIntegratorGroupId) === -1) {
      promise = ActionBuilderService.getApiGroupInputs($scope.apiIntegratorGroupId);
      return promise.then(function(data) {
        var configkeys, configs, outType;
        if (data.success) {
          configkeys = [];
          configs = [];
          angular.forEach(data.data.DataStore.InputParams, function(value, key) {
            var config;
            configkeys.push({
              params: key
            });
            config = {
              Input: key,
              Description: value
            };
            return configs.push(config);
          });
          $scope.inputParams = configkeys;
          $scope.inputParamsDescription = configs;
          configkeys = [];
          angular.forEach(data.data.MandatoryInputs, function(inputs) {
            return configkeys.push(inputs);
          });
          $scope.mandatoryInputParams = configkeys;
          $scope.outputParams = [];
          if (['', null, void 0].indexOf(data.data.OutputEntityDetails) === -1) {
            outType = "DICTIONARY";
            return angular.forEach(data.data.OutputEntityDetails, function(OutputEntity) {
              var output;
              output = {
                Name: OutputEntity.Name,
                Type: outType,
                Description: OutputEntity.Description,
                Sample: OutputEntity.Sample,
                OutputExpression: OutputEntity.Name
              };
              return $scope.outputParams.push(output);
            });
          } else if (['', null, void 0].indexOf(data.data.OutputParams) === -1) {
            $scope.outputParams = [];
            return angular.forEach(data2.data.OutputParams, function(value, key) {
              var output;
              output = {
                Name: key,
                Description: "",
                Type: "DICTIONARY",
                Sample: "",
                OutputExpression: key
              };
              return $scope.outputParams.push(output);
            });
          }
        } else if ((data != null ? data.status : void 0) === 403) {
          AricMessage.showFailureMessage("You don't have sufficient permission to this API Integrator group " + $scope.apiIntegratorGroupId + ".", "", false);
          return $scope.currentStep = 7;
        } else {
          AricMessage.showFailureMessage("There was an error retrieving the API Integrator group .Please verify the group ID " + $scope.apiIntegratorGroupId + " and try again.", "", false);
          return $scope.currentStep = 5;
        }
      });
    }
  };
  getInputParamsIndex = function(key) {
    var i;
    i = 0;
    if ($scope.inputParams) {
      while (i < $scope.inputParams.length) {
        if ($scope.inputParams[i].params === key) {
          break;
        }
        i++;
      }
    }
    return i;
  };
  GetActionDetailsN = function() {
    $('#entityPermissionDeniedMessage').addClass('hideSection').removeClass('unhideSection');
    $('#ManageAccess').addClass('hideSection').removeClass('unhideSection');
    if (['', null, void 0].indexOf($scope.actionId) === -1) {
      promiseActionGet = ActionBuilderService.getActionDetails($scope.actionId);
      $rootScope.showManageAccessButton = false;
      return promiseActionGet.then(function(data) {
        var configkeys;
        if (data.success) {
          if (!(data.data.HasWriteAccess || data.data.HasOwnerAccess || $rootScope.isAdminUser)) {
            $('#entityPermissionDeniedMessage').addClass('unhideSection').removeClass('hideSection');
            $scope.currentStep = 6;
            return;
          }
          $('#ManageAccess').removeClass('hideSection');
          $scope.FinalAction = data.data;
          $scope.TimeOutValue = $scope.FinalAction.TimeOut.split(':');
          if (parseInt($scope.TimeOutValue[2]) !== 0) {
            $scope.FinalAction.TimeOutType = 'Seconds';
            $scope.FinalAction.TimeOut = $scope.TimeOutValue[2];
          } else {
            $scope.FinalAction.TimeOutType = 'Minutes';
            $scope.FinalAction.TimeOut = $scope.TimeOutValue[1];
          }
          if (!($scope.FinalAction.HasOwnerAccess || $scope.FinalAction.HasWriteAccess)) {
            $rootScope.editAccess = false;
          }
          if ($scope.FinalAction && $scope.FinalAction.Type === "ACTION") {
            configkeys = [];
            $rootScope.showManageAccessButton = $scope.FinalAction.HasOwnerAccess || $rootScope.isAdminUser;
            $rootScope.editAccess = $scope.FinalAction.HasOwnerAccess || $scope.FinalAction.HasWriteAccess || $rootScope.isAdminUser;
            $scope.mandatoryInputParams = [];
            angular.forEach($scope.FinalAction.PropertyDefinitions, (function(obj, objKey) {
              var abce;
              abce = {
                params: objKey
              };
              configkeys.push(abce);
              return $scope.mandatoryInputParams.push(objKey);
            }));
            angular.forEach($scope.FinalAction.FixedProperties, (function(obj, objKey) {
              var abce;
              abce = {
                params: objKey
              };
              configkeys.push(abce);
              return $scope.mandatoryInputParams.push(objKey);
            }));
            $scope.inputParams = configkeys;
            $scope.outputParams = [];
            angular.forEach($scope.FinalAction.Outputs, function(OutputEntity) {
              var outExp, outType, output;
              outType = "DICTIONARY";
              outExp = OutputEntity.Name;
              if (['', null, void 0].indexOf(OutputEntity.Type) === -1) {
                outType = OutputEntity.Type;
              }
              if (['', null, void 0].indexOf(OutputEntity.OutputExpression) === -1) {
                outExp = OutputEntity.OutputExpression;
              }
              output = {
                Name: OutputEntity.Name,
                Description: OutputEntity.Description,
                Type: outType,
                Sample: OutputEntity.Sample,
                OutputExpression: outExp
              };
              return $scope.outputParams.push(output);
            });
            return PropControlsFix();
          } else {
            $scope.apiIntegratorGroupId = $scope.FinalAction.Execution.APIIntegratorGroupID;
            $rootScope.showManageAccessButton = $scope.FinalAction.HasOwnerAccess || $rootScope.isAdminUser;
            $scope.outputParams = [];
            angular.forEach($scope.FinalAction.Outputs, function(OutputEntity) {
              var outExp, outType, output;
              outType = "DICTIONARY";
              outExp = OutputEntity.Name;
              if (['', null, void 0].indexOf(OutputEntity.Type) === -1) {
                outType = OutputEntity.Type;
              }
              if (['', null, void 0].indexOf(OutputEntity.OutputExpression) === -1) {
                outExp = OutputEntity.OutputExpression;
              }
              output = {
                Name: OutputEntity.Name,
                Description: OutputEntity.Description,
                Type: outType,
                Sample: OutputEntity.Sample,
                OutputExpression: outExp
              };
              return $scope.outputParams.push(output);
            });
            promiseGroup = ActionBuilderService.getApiGroupInputs($scope.apiIntegratorGroupId);
            return promiseGroup.then(function(data2) {
              if (data2.success) {
                configkeys = [];
                angular.forEach(data2.data.DataStore.InputParams, function(value, key) {
                  configkeys.push({
                    params: key
                  });
                  return $scope.inputParams = configkeys;
                });
                configkeys = [];
                angular.forEach(data2.data.MandatoryInputs, function(inputs) {
                  configkeys.push(inputs);
                  return $scope.mandatoryInputParams = configkeys;
                });
                configkeys = [];
                if (['', null, void 0].indexOf(data2.data.OutputEntityDetails) === -1) {
                  $scope.outputParams = [];
                  angular.forEach(data2.data.OutputEntityDetails, function(OutputEntity) {
                    var outExp, outType, output;
                    outType = "DICTIONARY";
                    outExp = OutputEntity.Name;
                    if (['', null, void 0].indexOf(OutputEntity.Type) === -1) {
                      outType = OutputEntity.Type;
                    }
                    if (['', null, void 0].indexOf(OutputEntity.OutputExpression) === -1) {
                      outExp = OutputEntity.OutputExpression;
                    }
                    output = {
                      Name: OutputEntity.Name,
                      Description: OutputEntity.Description,
                      Type: outType,
                      Sample: OutputEntity.Sample,
                      OutputExpression: outExp
                    };
                    return $scope.outputParams.push(output);
                  });
                } else if (['', null, void 0].indexOf(data2.data.OutputParams) === -1) {
                  $scope.outputParams = [];
                  angular.forEach(data2.data.OutputParams, function(value, key) {
                    var output;
                    output = {
                      Name: key,
                      Description: "",
                      Type: "DICTIONARY",
                      Sample: "",
                      OutputExpression: key
                    };
                    return $scope.outputParams.push(output);
                  });
                }
              }
              return PropControlsFix();
            });
          }
        } else if ((data != null ? data.status : void 0) === 403) {
          $('#entityPermissionDeniedMessage').addClass('unhideSection').removeClass('hideSection');
          return $scope.currentStep = 6;
        } else {
          AricMessage.showFailureMessage("There was an error retrieving your action .Please verify the action ID " + $scope.actionId + " and try again.", "", false);
          return $scope.currentStep = 4;
        }
      });
    }
  };
  PropControlsFix = function() {
    if ($scope.FinalAction && $scope.FinalAction.Category) {
      $scope.categories = angular.copy($scope.FinalAction.Category);
    }
    $scope.fixedPropControls = [];
    angular.forEach($scope.FinalAction.FixedProperties, (function(valueProp, keyProp) {
      return $scope.addFixedPropControls(keyProp, valueProp);
    }));
    angular.forEach($scope.FinalAction.PropertyDefinitions, (function(obj, objKey) {
      if (['', null, void 0].indexOf(obj.Presentation.Type) === -1) {
        return setActionGridControls(obj.Presentation, obj.Presentation.Type, objKey, obj);
      }
    }));
    return angular.forEach($scope.FinalAction.Labels, (function(obj) {
      return setActionGridControls(obj, "Label", "", "");
    }));
  };
  $scope.cancelAPI = function() {
    return $location.path('action/action-list');
  };
  $scope.closeCancelConfirmation = function() {
    return AricMessage.hideAricMessage();
  };
  $scope.cancel = function() {
    return AricMessage.showConfirmationMessage('Unsaved changes will be lost. Continue?', $scope.cancelAPI, $scope.closeCancelConfirmation);
  };
  $scope.NumericValidation = function(ev) {
    if (ev.which >= 48 && ev.which <= 57 || ev.which === 8) {
      return true;
    } else {
      ev.preventDefault();
      return false;
    }
  };
  $scope.next = function() {
    var blankOptionTextValue, emptyListItem, fixedDictionary, noControlsInTheGrid, positionOfControlMissingListItem, positionOfControlMissingProperty, proceedToNextStep, showStep1Popup, showStep2Popup, tempFixedProperties;
    $scope.resetValidation();
    proceedToNextStep = true;
    noControlsInTheGrid = true;
    if ($scope.currentStep === 0) {
      $scope.previousFixedPropControls = [];
      angular.copy($scope.fixedPropControls, $scope.previousFixedPropControls);
      $scope.fixedPropControls = [];
      if ($scope.processedSteps.indexOf($scope.currentStep) === -1) {
        $scope.processedSteps.push($scope.currentStep);
      }
      $scope.inputParamsForFixedProperties = [];
      $scope.propertiesAssignedToGridControls = [];
      positionOfControlMissingProperty = void 0;
      positionOfControlMissingListItem = void 0;
      emptyListItem = false;
      blankOptionTextValue = false;
      showStep1Popup = false;
      angular.forEach($scope.actionGrid, (function(row) {
        return angular.forEach(row.value, (function(col) {
          var i;
          switch (col.controlType) {
            case "Label":
              noControlsInTheGrid = false;
              if (col.properties && col.properties[0].value === "Default text") {
                showStep1Popup = true;
                proceedToNextStep = false;
                return positionOfControlMissingProperty = "Row:" + row.id + ", Column:" + col.colNumber;
              }
              break;
            default:
              if (col.controlType !== "") {
                noControlsInTheGrid = false;
                if (col.properties && col.properties[0] && (col.properties[0].value === null || col.properties[0].value === "" || col.properties[0].value === "-- choose Property --")) {
                  showStep1Popup = true;
                  proceedToNextStep = false;
                  positionOfControlMissingProperty = "Row:" + row.id + ", Column:" + col.colNumber;
                } else if (col.properties && col.properties[0] && col.properties[0].value !== null) {
                  $scope.propertiesAssignedToGridControls.push(col.properties[0].value.params);
                }
                if (col.controlType.indexOf("List") !== -1) {
                  if (col.controlType === "Dropdown List") {
                    if (['', null, void 0].indexOf(col.properties[4].value) === -1) {
                      if (col.properties[4].value === "Fixed") {
                        if (col.properties[5].value.length > 0) {
                          i = 0;
                          while (i < col.properties[5].value.length) {
                            if (col.properties[5].value[i].text === "" || col.properties[5].value[i].value === "") {
                              blankOptionTextValue = true;
                            }
                            i++;
                          }
                        }
                      }
                    }
                  } else {
                    if (['', null, void 0].indexOf(col.properties[3]) === -1) {
                      if (col.properties[3].value === "Fixed") {
                        if (col.properties[4].value.length > 0) {
                          i = 0;
                          while (i < col.properties[4].value.length) {
                            if (col.properties[4].value[i].text === "" || col.properties[4].value[i].value === "") {
                              blankOptionTextValue = true;
                            }
                            i++;
                          }
                        }
                      }
                    }
                  }
                  if (blankOptionTextValue) {
                    return positionOfControlMissingListItem = col.controlType + " at Row:" + row.id + ", Column:" + col.colNumber;
                  }
                }
              }
          }
        }));
      }));
      angular.forEach($scope.inputParams, (function(params) {
        if ($scope.propertiesAssignedToGridControls.indexOf(params.params) === -1) {
          return $scope.inputParamsForFixedProperties.push(params);
        }
      }));
      if ($scope.inputParamsForFixedProperties.length === 0) {
        $scope.fixedPropControls = [];
      }
      if (showStep1Popup || noControlsInTheGrid || blankOptionTextValue) {
        if (noControlsInTheGrid) {
          $scope.requiredValidationPopupMessage = "No Controls have been defined for the Action. Please define controls to proceed further.";
        } else if (blankOptionTextValue) {
          $scope.requiredValidationPopupMessage = positionOfControlMissingListItem + " is having either empty Option Text or Option Value. Please provide the Option Text and Option Value or remove the List Item.";
        } else {
          $scope.requiredValidationPopupMessage = "Control in the Position " + positionOfControlMissingProperty + " is not assigned with any property.";
        }
        $scope.validFields.isntVABForm = true;
        $scope.validFields.isntVRequired = true;
        return;
      }
    }
    if ($scope.currentStep === 1) {
      $scope.validFields.isntVProp = false;
      $scope.validFields.isntVRequired = false;
      $scope.requiredValidationPopupMessage = "";
      showStep2Popup = false;
      if (['', null, void 0].indexOf($scope.FinalAction.Name) === -1 && ['', null, void 0].indexOf($scope.FinalAction.TimeOut) === -1 && ['', null, void 0].indexOf($scope.FinalAction.Type) === -1 && ['', null, void 0].indexOf($scope.FinalAction.TimeOutType) === -1 && $scope.categories && $scope.categories.length > 0) {
        showStep2Popup = false;
      } else {
        showStep2Popup = true;
        proceedToNextStep = false;
      }
      if ($scope.fixedPropControls.length + $scope.propertiesAssignedToGridControls.length !== $scope.inputParams.length) {
        tempFixedProperties = [];
        if ($scope.fixedPropControls.length === 0) {
          $scope.fixedPropControls = [];
        } else {
          angular.forEach($scope.fixedPropControls, function(value, key) {
            return tempFixedProperties.push(value.key.params);
          });
        }
        fixedDictionary = {};
        angular.forEach($scope.previousFixedPropControls, function(value, key) {
          return fixedDictionary[value.key.params] = value.value;
        });
        angular.forEach($scope.inputParams, (function(prop) {
          var value;
          if (($scope.propertiesAssignedToGridControls.indexOf(prop.params) === -1) && (tempFixedProperties.indexOf(prop.params) === -1)) {
            value = fixedDictionary[prop.params];
            if (value === null || value === void 0) {
              value = "";
            }
            return $scope.addFixedPropControls(prop.params, value);
          }
        }));
        if ($scope.fixedPropControls.length === 1) {
          $scope.fixedPropControls[0].addFixedPropControl = "false";
        }
      }
      $.each($scope.fixedPropControls, function(key, value) {
        if (['', null, void 0].indexOf($scope.fixedPropControls[key]) === -1 && $scope.inputParamsForFixedProperties.indexOf($scope.fixedPropControls[key].key) === -1) {
          $scope.fixedPropControls.splice(key, 1);
        }
      });
      if (showStep2Popup) {
        $scope.validFields.isntVProp = true;
        $scope.validFields.isntVRequired = true;
        $scope.requiredValidationPopupMessage = "Action Name, Categories, Action Timeout and Action Type are Mandatory.";
        return;
      }
    }
    if (proceedToNextStep) {
      $scope.currentStep += 1;
    }
    if ($scope.processedSteps.indexOf($scope.currentStep) === -1) {
      return $scope.processedSteps.push($scope.currentStep);
    }
  };
  setActionGridControls = function(obj, controlType, objKey, wholeObj) {
    var col, colId, colIndex, colWidth, ick, iter, row, rowId, rowIndex, tempColWidth, totalRows;
    row = [];
    col = [];
    rowId = 0;
    rowIndex = 0;
    colId = 0;
    colIndex = 0;
    row = obj.Position.Row;
    col = obj.Position.Column;
    rowId = row[0];
    rowIndex = rowId - 1;
    colId = col[0];
    colIndex = colId - 1;
    colWidth = 1;
    iter = 1;
    while (iter < col.length) {
      colWidth += 1;
      iter += 1;
    }
    if ($scope.actionGrid.length < rowId) {
      totalRows = $scope.actionGrid.length;
      while (totalRows < rowId) {
        $scope.addRow();
        totalRows += 1;
      }
    }
    if (['', null, void 0].indexOf($scope.actionGrid[rowIndex]) === -1) {
      if (['', null, void 0].indexOf($scope.actionGrid[rowIndex].value[colIndex]) === -1) {
        if (['', null, void 0].indexOf(objKey) === -1) {
          $scope.actionGrid[rowIndex].value[colIndex].propertyName = objKey;
          $scope.actionGrid[rowIndex].value[colIndex].propertyDescription = objKey;
        }
        $scope.actionGrid[rowIndex].value[colIndex].controlType = controlType;
        $scope.actionGrid[rowIndex].value[colIndex].colNumber = colId;
        $scope.actionGrid[rowIndex].value[colIndex].width = colWidth;
      }
      angular.forEach(ActionBuilderService.action.formTypes, (function(formType) {
        if (formType.value === controlType) {
          $scope.actionGrid[rowIndex].value[colIndex].properties = [];
          return angular.forEach(formType.properties, (function(prop) {
            var abc, isRequired;
            abc = {};
            abc.key = prop.key;
            if (prop.key === "Default text") {
              abc.value = obj.Text;
            }
            if (prop.key === 'Required') {
              abc.value = prop.value;
            }
            if (prop.key === "Property Name") {
              abc.value = $scope.inputParams[getInputParamsIndex(objKey)];
            }
            if (prop.key === "Preview text") {
              abc.value = $scope.FinalAction.PropertyDefinitions[objKey].PreviewText;
            }
            if (prop.key === "Description") {
              abc.value = $scope.FinalAction.PropertyDefinitions[objKey].Description;
            }
            if (prop.key === "Default value") {
              if (['', null, void 0].indexOf($scope.FinalAction.DefaultProperties) === -1) {
                abc.value = $scope.FinalAction.DefaultProperties[objKey];
              }
            }
            if (prop.key === "Source Type") {
              if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Source) === -1) {
                abc.value = $scope.FinalAction.PropertyDefinitions[objKey].Source.Type;
                $scope.SourceType[objKey] = $scope.FinalAction.PropertyDefinitions[objKey].Source.Type;
              }
            }
            if (prop.key === "Checkbox Title") {
              angular.forEach($scope.FinalAction.PropertyDefinitions[objKey].Source.Fixed.Items, (function(value, keyNew) {
                var oldPropDefListItem;
                abc.value = keyNew;
                oldPropDefListItem = {
                  propName: objKey,
                  listItem: keyNew
                };
                return $scope.oldPropDefListItems.push(oldPropDefListItem);
              }));
            }
            if (prop.key === "List Item") {
              abc.value = [];
              if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Source) === -1) {
                if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Source.Fixed) === -1) {
                  angular.forEach($scope.FinalAction.PropertyDefinitions[objKey].Source.Fixed.Items, (function(valueNew, keyNew) {
                    var oldPropDefListItem, value;
                    value = {
                      text: keyNew,
                      value: valueNew
                    };
                    abc.value.push(value);
                    oldPropDefListItem = {
                      propName: objKey,
                      listItem: keyNew
                    };
                    return $scope.oldPropDefListItems.push(oldPropDefListItem);
                  }));
                }
              } else if (formType.value !== "Dropdown List") {
                abc.value.push({
                  text: " ",
                  value: " "
                }, {
                  text: " ",
                  value: " "
                });
              }
            }
            if (prop.key === "APIGroupId") {
              abc.value = [];
              if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Source) === -1) {
                if ($scope.FinalAction.PropertyDefinitions[objKey].Source.Type === "External") {
                  abc.value = $scope.FinalAction.PropertyDefinitions[objKey].Source.Execution.APIIntegratorGroupID;
                }
              }
            }
            if (prop.key === "APIOutput") {
              abc.value = [];
              if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Source) === -1) {
                if ($scope.FinalAction.PropertyDefinitions[objKey].Source.Type === "External") {
                  if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Source.Execution.APIIntegratorGroupID) === -1) {
                    promise = ActionBuilderService.executeAPIGroup($scope.FinalAction.PropertyDefinitions[objKey].Source.Execution.APIIntegratorGroupID);
                    promise.then(function(data) {
                      var i, output, outputData, outputDataFormatted;
                      if (data.success) {
                        outputData = JSON.parse(data.response.Output);
                        if (outputData instanceof Array) {
                          outputDataFormatted = [];
                          i = 0;
                          while (i < outputData.length) {
                            output = {
                              value: outputData[i].ID,
                              text: outputData[i].Name
                            };
                            outputDataFormatted.push(output);
                            i++;
                          }
                          return abc.value = outputDataFormatted;
                        }
                      }
                    });
                  }
                }
              }
            }
            if (prop.key === "Meta Data") {
              abc.value = [];
              if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Presentation.MetaData) === -1) {
                if ($scope.FinalAction.PropertyDefinitions[objKey].Presentation.MetaData.length > 0) {
                  angular.forEach($scope.FinalAction.PropertyDefinitions[objKey].Presentation.MetaData, (function(metadata) {
                    var value;
                    value = {
                      key: metadata.key,
                      value: metadata.value
                    };
                    return abc.value.push(value);
                  }));
                }
              }
            }
            if (prop.key === "Rules") {
              isRequired = void 0;
              abc.value = [];
              isRequired = false;
              if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Rules) === -1) {
                if ($scope.FinalAction.PropertyDefinitions[objKey].Rules.length > 0) {
                  angular.forEach($scope.FinalAction.PropertyDefinitions[objKey].Rules, function(Rule) {
                    var value;
                    if (Rule.Name === 'Required' && Rule.Event === 'OnSubmit') {
                      isRequired = true;
                    } else {
                      value = {
                        Name: Rule.Name,
                        Event: Rule.Event
                      };
                      return abc.value.push(value);
                    }
                  });
                  if (isRequired) {
                    angular.forEach($scope.actionGrid[rowIndex].value[colIndex].properties, function(prop) {
                      if (prop.key === 'Required') {
                        prop.value = true;
                      }
                    });
                  }
                }
              }
            }
            return $scope.actionGrid[rowIndex].value[colIndex].properties.push(abc);
          }));
        }
      }));
      ick = 1;
      tempColWidth = 0;
      angular.forEach($scope.actionGrid[rowIndex].value, (function(col) {
        return tempColWidth = tempColWidth + col.width;
      }));
      while (ick < colWidth) {
        if (tempColWidth !== 6) {
          $scope.actionGrid[rowIndex].value.splice(colIndex + 1, 1);
        }
        ick += 1;
      }
      resetIndex();
      return resetColIndex(rowIndex);
    }
  };
  $scope.previous = function() {
    $scope.resetValidation();
    if ($scope.currentStep === 0) {
      $scope.currentStep = -2;
      return $scope.APIGroupInfo = $scope.apiIntegratorGroupId;
    } else {
      return $scope.currentStep -= 1;
    }
  };
  $scope.goto = function(step) {
    if ($scope.processedSteps.indexOf(step) !== -1) {
      $scope.currentStep = step;
      if (step === -2) {
        return $scope.APIGroupInfo = $scope.apiIntegratorGroupId;
      }
    }
  };
  $scope.resetValidation = function() {
    $scope.validFields.isntVAPIType = false;
    $scope.validFields.isntVAPIGrp = false;
    $scope.validFields.isntVDllName = false;
    $scope.validFields.isntVClsName = false;
    $scope.validFields.isntVMtdName = false;
    $scope.validFields.isntVABForm = false;
    $scope.validFields.isntVMapping = false;
    $scope.validFields.isntVRequired = false;
    $scope.validFields.isntVpopup = false;
    $scope.validFields.isntVProp = false;
    $scope.validFields.isntVFixProp = false;
    $scope.requiredValidationPopupMessage = "";
    return $scope.propertyMappingChangePopupMessage = "";
  };
  $scope.getAllForSave = function() {
    var matrix;
    resetDictionaryItems($scope.FinalAction.PropertyDefinitions);
    resetDictionaryItems($scope.FinalAction.DefaultProperties);
    matrix = [];
    $scope.FinalAction.Matrix = GenericUtilities.getMatrix($rootScope.cacheValue, "rackspace");
    if (DataBasket.payload && DataBasket.payload !== "") {
      if (DataBasket.payload.Permissions) {
        $scope.FinalAction.Permissions = DataBasket.payload.Permissions;
      }
    } else {
      $scope.FinalAction.Permissions = {
        "InternalIdentity": {
          "AllowedAccess": {
            "Owner": {
              "Users": [
                {
                  "Tenant": "internal",
                  "UserName": $scope.currentUser
                }
              ],
              "Roles": []
            },
            "View": {
              "Users": [
                {
                  "Tenant": "internal",
                  "UserName": $scope.currentUser
                }
              ],
              "Roles": []
            }
          }
        }
      };
    }
    angular.forEach($scope.actionGrid, (function(row) {
      var lastColumnNumber;
      lastColumnNumber = 0;
      return angular.forEach(row.value, (function(col) {
        var ListItem, MetaData, Rule, RulesItem, apiGroupId, checkBoxTitle, defaultValue, description, i, isRequired, j, k, lblObj, propName, sampleText, sourceType, temp, type, _results;
        type = col.controlType;
        switch (type) {
          case "Label":
            lblObj = new Object();
            lblObj.Position = {};
            lblObj.Position.Row = [];
            lblObj.Position.Column = [];
            lblObj.Text = col.properties[0].value;
            lblObj.Position.Row.push(row.id);
            temp = 0;
            while (temp < col.width) {
              lblObj.Position.Column.push(lastColumnNumber + 1 + temp);
              temp += 1;
            }
            lastColumnNumber = lastColumnNumber + 1 + temp - 1;
            return $scope.FinalAction.Labels.push(lblObj);
          default:
            propName = "";
            defaultValue = "";
            description = "";
            sampleText = "";
            ListItem = [];
            checkBoxTitle = "";
            apiGroupId = "";
            RulesItem = [];
            sourceType = "";
            MetaData = [];
            isRequired = false;
            angular.forEach(col.properties, (function(props) {
              if (props.key === "Property Name" && ['', null, void 0].indexOf(props.value) === -1) {
                propName = props.value.params;
              }
              if (props.key === "Required" && ['', null, void 0].indexOf(props.value) === -1) {
                isRequired = props.value;
              }
              if (props.key === "Default value" && ['', null, void 0].indexOf(props.value) === -1) {
                defaultValue = props.value;
              }
              if (props.key === "Description" && ['', null, void 0].indexOf(props.value) === -1) {
                description = props.value;
              }
              if (props.key === "Preview text" && ['', null, void 0].indexOf(props.value) === -1) {
                sampleText = props.value;
              }
              if (props.key === "List Item" && ['', null, void 0].indexOf(props.value) === -1) {
                ListItem = props.value;
              }
              if (props.key === "Checkbox Title" && ['', null, void 0].indexOf(props.value) === -1) {
                checkBoxTitle = props.value;
              }
              if (props.key === "APIGroupId" && ['', null, void 0].indexOf(props.value) === -1) {
                apiGroupId = props.value;
              }
              if (props.key === "Source Type" && ['', null, void 0].indexOf(props.value) === -1) {
                sourceType = props.value;
              }
              if (props.key === "Meta Data" && ['', null, void 0].indexOf(props.value) === -1) {
                MetaData = props.value;
              }
              if (props.key === "Rules" && ['', null, void 0].indexOf(props.value) === -1) {
                return RulesItem = props.value;
              }
            }));
            if (['', null, void 0].indexOf(propName) === -1) {
              $scope.FinalAction.PropertyDefinitions[propName] = new Object();
              $scope.FinalAction.PropertyDefinitions[propName].Presentation = new Object();
              $scope.FinalAction.PropertyDefinitions[propName].Presentation.Position = new Object();
              if (MetaData.length > 0) {
                $scope.FinalAction.PropertyDefinitions[propName].Presentation.MetaData = MetaData;
              }
              $scope.FinalAction.PropertyDefinitions[propName].Presentation.Type = type;
              $scope.FinalAction.PropertyDefinitions[propName].Presentation.Position.Row = [];
              $scope.FinalAction.PropertyDefinitions[propName].Presentation.Position.Column = [];
              $scope.FinalAction.PropertyDefinitions[propName].Presentation.Position.Row.push(row.id);
              temp = 0;
              while (temp < col.width) {
                $scope.FinalAction.PropertyDefinitions[propName].Presentation.Position.Column.push(lastColumnNumber + 1 + temp);
                temp += 1;
              }
              lastColumnNumber = lastColumnNumber + 1 + temp - 1;
              if (['', null, void 0].indexOf(defaultValue) === -1) {
                $scope.FinalAction.DefaultProperties[propName] = defaultValue;
              }
              if (['', null, void 0].indexOf(description) === -1) {
                $scope.FinalAction.PropertyDefinitions[propName].Description = description;
              }
              if (['', null, void 0].indexOf(sampleText) === -1) {
                $scope.FinalAction.PropertyDefinitions[propName].PreviewText = sampleText;
              }
              if (['', null, void 0].indexOf(sourceType) === -1) {
                $scope.FinalAction.PropertyDefinitions[propName].Source = new Object();
                $scope.FinalAction.PropertyDefinitions[propName].Source.Type = sourceType;
              }
              if (RulesItem.length > 0) {
                $scope.FinalAction.PropertyDefinitions[propName].Rules = [];
                i = 0;
                while (i < RulesItem.length) {
                  if (['', null, void 0].indexOf(RulesItem[i].Name) === -1 && ['', null, void 0].indexOf(RulesItem[i].Event) === -1) {
                    $scope.FinalAction.PropertyDefinitions[propName].Rules = [];
                    Rule = {
                      Name: RulesItem[i].Name,
                      Event: RulesItem[i].Event
                    };
                    if ($scope.FinalAction.PropertyDefinitions[propName].Rules) {
                      $scope.FinalAction.PropertyDefinitions[propName].Rules.push(Rule);
                    }
                  }
                  i++;
                }
              }
              if (['', null, void 0].indexOf(isRequired) === -1) {
                if (isRequired === true) {
                  Rule = {
                    Name: 'Required',
                    Event: 'OnSubmit'
                  };
                  if ($scope.FinalAction.PropertyDefinitions[propName].Rules) {
                    $scope.FinalAction.PropertyDefinitions[propName].Rules.push(Rule);
                  } else {
                    $scope.FinalAction.PropertyDefinitions[propName].Rules = [];
                    $scope.FinalAction.PropertyDefinitions[propName].Rules.push(Rule);
                  }
                }
              }
              $scope.FinalAction.PropertyDefinitions[propName].Source = new Object();
              $scope.FinalAction.PropertyDefinitions[propName].Source.Type = "Fixed";
              $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed = new Object();
              $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items = new Object();
              $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items[checkBoxTitle] = ".";
              k = 0;
              while (k < $scope.oldPropDefListItems.length) {
                if ($scope.oldPropDefListItems[k].propName === propName) {
                  if ($scope.oldPropDefListItems[k].listItem !== checkBoxTitle) {
                    $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items[$scope.oldPropDefListItems[k].listItem] = "";
                  }
                }
                k++;
              }
              if (ListItem.length > 0 || ['', null, void 0].indexOf(apiGroupId) === -1) {
                if (['', null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[propName].Source) === -1) {
                  if ($scope.FinalAction.PropertyDefinitions[propName].Source.Type === "Fixed") {
                    $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed = new Object();
                    $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items = new Object();
                    i = 0;
                    while (i < ListItem.length) {
                      $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items[ListItem[i].text] = ListItem[i].value;
                      i++;
                    }
                    j = 0;
                    while (j < $scope.DeletedListItems.length) {
                      if ($scope.DeletedListItems[j].propName === propName) {
                        $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items[$scope.DeletedListItems[j].listItem] = "";
                      }
                      j++;
                    }
                    angular.forEach($scope.oldPropDefListItems, (function(oldPropDefListItem) {
                      var keepGoing;
                      if (oldPropDefListItem.propName === propName) {
                        keepGoing = true;
                        angular.forEach(ListItem, (function(item) {
                          if (keepGoing) {
                            if (oldPropDefListItem.listItem === item.text) {
                              return keepGoing = false;
                            }
                          }
                        }));
                        if (keepGoing) {
                          return $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items[oldPropDefListItem.listItem] = "";
                        }
                      }
                    }));
                    if (['', null, void 0].indexOf(apiGroupId) === -1) {
                      $scope.FinalAction.PropertyDefinitions[propName].Source.Execution = new Object();
                      return $scope.FinalAction.PropertyDefinitions[propName].Source.Execution.APIIntegratorGroupID = "";
                    }
                  } else if ($scope.FinalAction.PropertyDefinitions[propName].Source.Type === "External") {
                    $scope.FinalAction.PropertyDefinitions[propName].Source.Execution = new Object();
                    $scope.FinalAction.PropertyDefinitions[propName].Source.Execution.APIIntegratorGroupID = apiGroupId;
                    if (ListItem.length > 0) {
                      $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed = new Object();
                      $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items = new Object();
                      i = 0;
                      _results = [];
                      while (i < ListItem.length) {
                        $scope.FinalAction.PropertyDefinitions[propName].Source.Fixed.Items[ListItem[i].text] = "";
                        _results.push(i++);
                      }
                      return _results;
                    }
                  }
                }
              }
            }
        }
      }));
    }));
    return angular.forEach($scope.FinalAction.PropertyDefinitions, function(value, key) {
      if (['', null, void 0].indexOf(value) !== -1) {
        $scope.FinalAction.PropertyDefinitions[key] = "";
      }
    });
  };
  $scope.SubmitActionDefinition = function() {
    var fixedPropertiesWithValues, fixedPropertiesWithoutKeyOrValue, i, j, k, output, promise2, tempFixedPropCount;
    $scope.validFields.isntVFixProp = false;
    $scope.fixedPropertiesMissingValues = [];
    if ($scope.currentStep === 2) {
      fixedPropertiesWithValues = [];
      fixedPropertiesWithoutKeyOrValue = false;
      k = 0;
      while (k < $scope.fixedPropControls.length) {
        if (['', null, void 0].indexOf($scope.fixedPropControls[k].key) === -1 && ['', null, void 0].indexOf($scope.fixedPropControls[k].value) === -1) {
          fixedPropertiesWithValues.push($scope.fixedPropControls[k].key.params);
        }
        if (['', null, void 0].indexOf($scope.fixedPropControls[k].key) === -1 && ['', null, void 0].indexOf($scope.fixedPropControls[k].value) !== -1) {
          fixedPropertiesWithoutKeyOrValue = true;
        }
        k++;
      }
      tempFixedPropCount = 0;
      angular.forEach($scope.fixedPropControls, (function(value, key) {
        if (['', null, void 0].indexOf(value.key) === -1) {
          return tempFixedPropCount++;
        }
      }));
      if (tempFixedPropCount + $scope.propertiesAssignedToGridControls.length !== $scope.inputParams.length) {
        $scope.validFields.isntVFixProp = true;
        $scope.validFields.isntVRequired = true;
        $scope.requiredValidationPopupMessage = "Mismatch in property mapping. Count of the total number of input properties does not match the properties mapped to the form and fixed properties.";
        return;
      }
      angular.forEach($scope.mandatoryInputParams, (function(inputParam) {
        if ($scope.propertiesAssignedToGridControls.indexOf(inputParam) === -1 && fixedPropertiesWithValues.indexOf(inputParam) === -1) {
          return $scope.fixedPropertiesMissingValues.push(inputParam);
        }
      }));
      if ($scope.fixedPropertiesMissingValues.length > 0) {
        $scope.validFields.isntVFixProp = true;
        $scope.validFields.isntVpopup = true;
        return;
      }
      if (fixedPropertiesWithoutKeyOrValue) {
        $scope.validFields.isntVFixProp = true;
        $scope.validFields.isntVRequired = true;
        $scope.requiredValidationPopupMessage = "Property and Propery Value cannot be Empty. Please select a Property and provide value or remove the Propery.";
        return;
      }
    }
    $scope.FinalAction.Category = [];
    i = 0;
    $scope.FinalAction.Category = [];
    if ($scope.categories) {
      $scope.FinalAction.Category = angular.copy($scope.categories);
    }
    resetDictionaryItems($scope.FinalAction.FixedProperties);
    j = 0;
    while (j < $scope.fixedPropControls.length) {
      if (['', null, void 0].indexOf($scope.fixedPropControls[j].key) === -1) {
        $scope.FinalAction.FixedProperties[$scope.fixedPropControls[j].key.params] = $scope.fixedPropControls[j].value;
      }
      j++;
    }
    $scope.FinalAction.Outputs = [];
    k = 0;
    if (['', null, void 0].indexOf($scope.outputParams) === -1) {
      while (k < $scope.outputParams.length) {
        if (['', null, void 0].indexOf($scope.outputParams[k]) === -1) {
          output = {
            Name: $scope.outputParams[k].Name,
            Type: $scope.outputParams[k].Type,
            OutputExpression: $scope.outputParams[k].OutputExpression,
            Sample: $scope.outputParams[k].Sample,
            Description: $scope.outputParams[k].Description
          };
          $scope.FinalAction.Outputs.push(output);
        }
        k++;
      }
    }
    $scope.FinalAction.Execution.APIIntegratorGroupID = $scope.apiIntegratorGroupId;
    $scope.FinalAction.Labels = [];
    $scope.FinalAction.Tenant = "internal";
    if ($scope.FinalAction.TimeOutType === 'Seconds') {
      $scope.FinalAction.TimeOutTicks = $scope.FinalAction.TimeOut * 600000000 / 60;
    } else {
      $scope.FinalAction.TimeOutTicks = $scope.FinalAction.TimeOut * 600000000;
    }
    $scope.getAllForSave();
    promise2 = void 0;
    promise2 = aswebGlobal.getFeedBackUserName();
    return promise2.then(function(data) {
      if (data.success) {
        $scope.FinalAction.LastModifiedBy = data.data;
        return $scope.SaveUpdateAction();
      } else {
        $scope.FinalAction.LastModifiedBy = "";
        return $scope.SaveUpdateAction();
      }
    });
  };
  $scope.SaveUpdateAction = function() {
    var promise1;
    promise1 = void 0;
    if (['', null, void 0].indexOf($scope.actionId) === -1) {
      delete $scope.FinalAction["Matrix"];
      delete $scope.FinalAction["Permissions"];
      promise1 = ActionBuilderService.updateAction($scope.FinalAction, $scope.actionId);
      promise1.then((function(data) {
        if (data.success) {
          $scope.response = "Success : " + data.status;
          $scope.currentPath = $location.path();
          return $scope.responseData = data;
        } else {
          $scope.response = "Failed : " + data.status;
          $scope.currentPath = $location.path();
          return $scope.responseData = data;
        }
      }));
    } else {
      promise1 = ActionBuilderService.saveAction($scope.FinalAction);
      promise1.then((function(data) {
        if (data.success) {
          $('#ManageAccess').removeClass('hideSection');
          $rootScope.actionId = data.response.ID;
          $scope.response = "Success : " + data.status;
          $scope.currentPath = $location.path();
          return $scope.responseData = data;
        } else {
          $scope.response = "Failed : " + data.status;
          $scope.currentPath = $location.path();
          return $scope.responseData = data;
        }
      }));
    }
    return $scope.currentStep = 3;
  };
  $scope.CancelAction = function() {};
  $scope.openDeleteConfirmation = function() {
    var col, row;
    row = $scope.selectedCell.row;
    col = $scope.selectedCell.col;
    row -= 1;
    col -= 1;
    if ($scope.actionGrid[row].value[col].controlType !== "") {
      AricMessage.showDelConfirmationMessage("Are you sure to Delete the Control?", $scope.removeControl, $scope.closeModalPopup);
    }
  };
  $scope.closeModalPopup = function(modalName) {
    if (modalName) {
      $(modalName).foundation("reveal", "close");
    }
    AricMessage.hideAricMessage();
  };
  $scope.removeControl = function() {
    var col, row;
    row = $scope.selectedCell.row;
    col = $scope.selectedCell.col;
    row -= 1;
    col -= 1;
    $scope.actionGrid[row].value[col].controlType = "";
    $scope.setControlProperties();
    AricMessage.hideAricMessage();
  };
  $scope.getCellControl = function(controlName) {
    var controlUrl;
    if (['', null, void 0].indexOf(controlName) === -1) {
      controlUrl = '';
      angular.forEach(ActionBuilderService.action.formTypes, (function(formType) {
        if (formType.value === controlName) {
          return controlUrl = formType.templateURL;
        }
      }));
      $scope.setControlProperties();
      return controlUrl;
    }
  };
  $scope.hasValue = function(item) {
    return ['', null, void 0].indexOf(item) === -1;
  };
  resetColIndex = function(rowNumber) {
    var i, _results;
    i = 0;
    _results = [];
    while (i < $scope.actionGrid[rowNumber].value.length) {
      $scope.actionGrid[rowNumber].value[i].colNumber = i + 1;
      _results.push(i++);
    }
    return _results;
  };
  resetIndex = function() {
    var i, _results;
    i = 0;
    _results = [];
    while (i < $scope.actionGrid.length) {
      if ($scope.actionGrid[i].id === $scope.selectedCell.row) {
        $scope.selectedCell.row = i + 1;
      }
      $scope.actionGrid[i].id = i + 1;
      _results.push(i++);
    }
    return _results;
  };
  $scope.setControlProperties = function() {
    var col, row;
    row = $scope.selectedCell.row - 1;
    col = $scope.selectedCell.col - 1;
    if (['', null, void 0].indexOf($scope.actionGrid[row].value[col].controlType) === -1) {
      $scope.message = $scope.actionGrid[row].value[col].controlType + " : settings ";
      return $scope.actionGrid[row].value[col];
    } else {
      return $scope.actionGrid[row].value[col].properties = [];
    }
  };
  $scope.cellSelection = function(rowNumber, columnNumber) {
    var propList, value;
    $scope.selectedCell.row = rowNumber;
    $scope.selectedCell.col = columnNumber;
    propList = $scope.actionGrid[rowNumber - 1].value[columnNumber - 1].properties;
    if (propList && propList.length > 0) {
      value = $scope.actionGrid[rowNumber - 1].value[columnNumber - 1].properties[0].value;
      if (value !== null && value.params && $scope.mandatoryInputParams.indexOf(value.params) !== -1) {
        $scope.requiredDisabled = true;
      } else {
        $scope.requiredDisabled = false;
      }
    }
    return $scope.setControlProperties();
  };
  $scope.setDragClass = function(bDrag) {
    var abc;
    if (bDrag === true) {
      return abc = {
        height: "80px",
        background: "#ddd",
        border: 1,
        opacity: ".5"
      };
    } else {
      return abc = {
        height: "80px"
      };
    }
  };
  $scope.getCellClass = function(rowNumber, columnNumber) {
    var abc;
    if (rowNumber === $scope.selectedCell.row && columnNumber === $scope.selectedCell.col) {
      abc = {
        border: "1px solid red",
        background: "white",
        cursor: "pointer",
        verticalAlign: "top",
        padding: "0rem 0rem"
      };
    } else {
      abc = {
        cursor: "pointer",
        verticalAlign: "top"
      };
    }
    return abc;
  };
  $scope.mergeRight = function(rowNumber, column1, confirmation) {
    var colWidth, nextColWidth;
    rowNumber = $scope.selectedCell.row;
    column1 = $scope.selectedCell.col;
    rowNumber -= 1;
    column1 = column1 - 1;
    colWidth = $scope.actionGrid[rowNumber].value[column1].width;
    nextColWidth = $scope.actionGrid[rowNumber].value[column1 + 1].width;
    if (!isNaN(nextColWidth)) {
      if (confirmation !== "yes" && $scope.actionGrid[rowNumber].value[column1 + 1].controlType !== "") {
        AricMessage.showConfirmationMessage("Are you sure to Overwrite the Control?", $scope.doOperation(), $scope.closeModalPopup);
        $scope.Operation = "mergeColumnRight";
      } else {
        $scope.actionGrid[rowNumber].value[column1].width = colWidth + nextColWidth;
        $scope.actionGrid[rowNumber].value.splice(column1 + 1, 1);
        resetColIndex(rowNumber);
        return AricMessage.hideAricMessage();
      }
    }
  };
  $scope.mergeLeft = function(rowNumber, column1, confirmation) {
    var colWidth, prevColWidth;
    rowNumber = $scope.selectedCell.row;
    column1 = $scope.selectedCell.col;
    rowNumber -= 1;
    column1 -= 1;
    if (column1 > 0) {
      colWidth = $scope.actionGrid[rowNumber].value[column1].width;
      prevColWidth = $scope.actionGrid[rowNumber].value[column1 - 1].width;
      if (!isNaN(prevColWidth)) {
        if (confirmation !== "yes" && $scope.actionGrid[rowNumber].value[column1 - 1].controlType !== "") {
          AricMessage.showConfirmationMessage("Are you sure to Overwrite the Control?", $scope.doOperation(), $scope.closeModalPopup);
          $scope.Operation = "mergeColumnLeft";
        } else {
          $scope.actionGrid[rowNumber].value[column1].width = colWidth + prevColWidth;
          $scope.actionGrid[rowNumber].value.splice(column1 - 1, 1);
          resetColIndex(rowNumber);
          $scope.selectedCell.col -= 1;
          return AricMessage.hideAricMessage();
        }
      }
    }
  };
  $scope.mergeRowUp = function() {
    var column, i, prevRowHeight, rowHeight, rowNumber;
    rowNumber = $scope.selectedCell.row;
    column = $scope.selectedCell.col;
    rowNumber -= 1;
    column -= 1;
    if (rowNumber > 0) {
      rowHeight = $scope.actionGrid[rowNumber].value[column].height;
      prevRowHeight = $scope.actionGrid[rowNumber - 1].value[column].height;
      if (!isNaN(prevRowHeight)) {
        i = 0;
        while (i < $scope.actionGrid[rowNumber].value.length) {
          $scope.actionGrid[rowNumber].value[i].height = rowHeight + prevRowHeight;
          i++;
        }
        $scope.actionGrid.splice(rowNumber - 1, 1);
        return resetIndex();
      }
    }
  };
  $scope.mergeRowDown = function() {
    var column, i, nextRowHeight, rowHeight, rowNumber;
    rowNumber = $scope.selectedCell.row;
    column = $scope.selectedCell.col;
    rowNumber -= 1;
    column -= 1;
    rowHeight = $scope.actionGrid[rowNumber].value[column].height;
    nextRowHeight = $scope.actionGrid[rowNumber + 1].value[column].height;
    if (!isNaN(nextRowHeight)) {
      i = 0;
      while (i < $scope.actionGrid[rowNumber].value.length) {
        $scope.actionGrid[rowNumber].value[i].height = rowHeight + nextRowHeight;
        i++;
      }
      $scope.actionGrid.splice(rowNumber + 1, 1);
      return resetIndex();
    }
  };
  $scope.deleteRowItem = function() {
    return $scope.doOperation();
  };
  $scope.controlCheck = function(operation, rowId) {
    var i, rowClear, rowNumber;
    rowNumber = $scope.selectedCell.row;
    rowClear = true;
    if (operation === "mergeRowUp") {
      rowNumber -= 2;
    } else if (operation === "removeRow") {
      rowNumber = rowId - 1;
    }
    i = 0;
    while (i < $scope.actionGrid[rowNumber].value.length) {
      if ($scope.actionGrid[rowNumber].value[i].controlType !== "") {
        rowClear = false;
      }
      i++;
    }
    $scope.Operation = operation;
    $scope.remove_rowId = rowId;
    if (rowClear) {
      return $scope.doOperation();
    } else {
      return AricMessage.showConfirmationMessage("Are you sure to Overwrite the Control?", $scope.deleteRowItem, $scope.closeModalPopup);
    }
  };
  $scope.doOperation = function() {
    if ($scope.Operation === "mergeRowUp") {
      $scope.mergeRowUp();
    } else if ($scope.Operation === "mergeRowDown") {
      $scope.mergeRowDown();
    } else if ($scope.Operation === "removeRow") {
      $scope.deleteRow($scope.remove_rowId);
    } else if ($scope.Operation === "mergeColumnRight") {
      $scope.mergeRight('', '', 'yes');
    } else if ($scope.Operation === "mergeColumnLeft") {
      $scope.mergeLeft('', '', 'yes');
    }
    return AricMessage.hideAricMessage();
  };
  $scope.splitCell = function(rowNumber, column1) {
    var colHeight, colWidth, nextCol;
    rowNumber = $scope.selectedCell.row;
    column1 = $scope.selectedCell.col;
    rowNumber -= 1;
    column1 -= 1;
    colWidth = $scope.actionGrid[rowNumber].value[column1].width;
    colHeight = $scope.actionGrid[rowNumber].value[column1].height;
    if (colWidth > 1) {
      nextCol = {
        colNumber: $scope.actionGrid[rowNumber].value[column1].colNumber + 1,
        width: 1,
        height: colHeight,
        controlType: ""
      };
      $scope.actionGrid[rowNumber].value[column1].width = colWidth - 1;
      $scope.actionGrid[rowNumber].value.splice(column1 + 1, 0, nextCol);
      return resetColIndex(rowNumber);
    }
  };
  $scope.deleteRow = function(item) {
    var rowCount;
    rowCount = $scope.RowCount - 1;
    $scope.RowCount = rowCount;
    if ($scope.actionGrid.length > 1) {
      $scope.actionGrid.splice(item - 1, 1);
      return resetIndex();
    }
  };
  s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };
  guid = function() {
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  };
  $scope.validateActionName = function() {
    $scope.showInvalidCharacterMessage = $scope.hasSpecialCharacters($scope.FinalAction.Name);
    return $scope.invalidActionName = $scope.showInvalidCharacterMessage;
  };
  $scope.hasSpecialCharacters = function(value) {
    if (/[+<>|&'\\":/?]/.test(value)) {
      return true;
    } else {
      return false;
    }
  };
  $scope.addFixedPropControls = function(keyText, valText) {
    var count, i, tempRow;
    count = $scope.fixedPropControls.length;
    count = count + 1;
    tempRow = {
      Id: count,
      key: $scope.inputParams[getInputParamsIndex(keyText)],
      value: valText,
      addFixedPropControl: "true"
    };
    if ($scope.fixedPropControls.length > 0) {
      i = 0;
      while (i < $scope.fixedPropControls.length) {
        $scope.fixedPropControls[i].addFixedPropControl = "false";
        i++;
      }
    }
    return $scope.fixedPropControls.push(tempRow);
  };
  $scope.deleteFixedPropControls = function(item) {
    var i;
    $scope.fixedPropControls.splice(item - 1, 1);
    i = 0;
    while (i < $scope.fixedPropControls.length) {
      $scope.fixedPropControls[i].Id = i + 1;
      i++;
    }
    if ($scope.fixedPropControls.length === 1) {
      return $scope.fixedPropControls[0].addFixedPropControl = "false";
    }
  };
  $scope.addRow = function() {
    var rowCount, tempRow;
    rowCount = $scope.RowCount;
    rowCount = rowCount + 1;
    tempRow = {
      bIsUsed: false,
      id: rowCount,
      value: [
        {
          colNumber: 1,
          width: 1,
          height: 1,
          controlType: ""
        }, {
          colNumber: 2,
          width: 1,
          height: 1,
          controlType: ""
        }, {
          colNumber: 3,
          width: 1,
          height: 1,
          controlType: ""
        }, {
          colNumber: 4,
          width: 1,
          height: 1,
          controlType: ""
        }, {
          colNumber: 5,
          width: 1,
          height: 1,
          controlType: ""
        }, {
          colNumber: 6,
          width: 1,
          height: 1,
          controlType: ""
        }
      ]
    };
    $scope.RowCount = rowCount;
    $scope.actionGrid.push(tempRow);
    return resetIndex();
  };
  $scope.appMenu = {
    display: 'Aric 2.5',
    location: '/aric/v1/action-builder',
    icon: 'fa fa-play'
  };
  $scope.topMenu = {
    display: '',
    items: [
      {
        display: 'Process Viewer',
        location: '/',
        icon: 'fa fa-th'
      }, {
        display: 'Action Editor',
        location: '/',
        icon: 'fa fa-list-ul'
      }
    ]
  };
  $scope.RowCount = ActionBuilderService.action.grid.length;
  ActionBuilderService.action.workingGrid = $scope.actionGrid;
  $scope.getClass = function(item) {
    var abc;
    abc = {
      width: (item.width * 16) + "%",
      height: (item.height * 80) + "px"
    };
    return abc;
  };
  $scope.dragStart = function(e, ui) {
    return ui.item.data("start", ui.item.index());
  };
  $scope.dragEnd = function(e, ui) {
    var end, start;
    start = ui.item.data("start");
    end = ui.item.index();
    $scope.actionGrid.splice(end, 0, $scope.actionGrid.splice(start, 1)[0]);
    resetIndex();
    return $scope.$apply();
  };
  $scope.Controls = ActionBuilderService.action.formTypes;
  sortableEle = void 0;
  sortableEle = $("#sortable").sortable({
    start: $scope.dragStart,
    update: $scope.dragEnd
  });
  $scope.GetNavClass = function(index) {
    if ($scope.currentStep === index) {
      return "current";
    }
  };
  $scope.ShowNext = function() {
    var total;
    total = 2;
    if ($scope.currentStep === 0 && $scope.loadComplete === true) {
      return true;
    }
    if ($scope.currentStep > 0 && $scope.currentStep < total && $scope.loadComplete === true) {
      return true;
    }
    if ($scope.currentStep === total) {
      return false;
    }
  };
  $scope.ShowPrev = function() {
    var total;
    total = 2;
    if ($scope.currentStep === 0 && $scope.isCreateAction === false) {
      return false;
    }
    if ($scope.currentStep === 0 && $scope.isCreateAction === true) {
      return true;
    }
    if ($scope.currentStep > 0 && $scope.currentStep <= total) {
      return true;
    }
  };
  $scope.ShowSubmit = function() {
    if ($scope.currentStep === 2) {
      return true;
    }
  };
  $scope.ShowCreateAction = function() {
    if ($scope.currentStep === -2) {
      return true;
    }
  };
  $scope.showManageAccessIcon = function() {
    var _ref;
    if (!$rootScope.isAdminUser && ((_ref = $scope.currentStep) === 3 || _ref === 4 || _ref === 5 || _ref === 6 || _ref === 7)) {
      return false;
    }
    return $rootScope.showManageAccessButton || $rootScope.isAdminUser;
  };
  $scope.currentUser = SessionService.getSessionData();
  $scope.navigateToProcessBuilder = function() {
    return window.location = "/aric/" + aric.Version + "/process-builder/";
  };
  $scope.navigateToEditAction = function(id) {
    var abc;
    abc = '/aric/' + aric.Version + '/action-builder/action/' + id + '?';
    return location.replace(abc);
  };
  $scope.splitRow = function() {
    var column, i, rowHeight, rowNumber;
    rowNumber = $scope.selectedCell.row;
    column = $scope.selectedCell.col;
    rowNumber -= 1;
    column -= 1;
    rowHeight = $scope.actionGrid[rowNumber].value[column].height;
    if (rowHeight > 1) {
      i = 0;
      while (i < $scope.actionGrid[rowNumber].value.length) {
        $scope.actionGrid[rowNumber].value[i].height = rowHeight - 1;
        i++;
      }
      return $scope.addRow();
    }
  };
  $scope.DllInputParms = [];
  $scope.DllOutputParms = [];
  $scope.CreateActionPopup = function() {
    $("#divActionTypeSelect").foundation("reveal", "open");
  };
  $scope.CreateActionN = function(type) {
    $scope.validFields.isntVAPIType = false;
    $scope.validFields.isntVAPIGrp = false;
    $scope.validFields.isntVDllName = false;
    $scope.validFields.isntVClsName = false;
    $scope.validFields.isntVMtdName = false;
    $scope.closeModalPopup("#divActionTypeSelect");
    if (type === "APIINTEGRATOR") {
      $scope.FinalAction.Outputs = new Object();
      $scope.FinalAction.Execution.LibraryInfo = new Object();
      if (['', null, void 0].indexOf($scope.apiIntegratorGroupId) === -1) {
        $scope.currentStep = 0;
        if ($scope.processedSteps.indexOf(-2) === -1) {
          $scope.processedSteps.push(-2);
        }
        GetAPiGroupDetails();
      } else {
        $scope.validFields.isntVAPIType = true;
        $scope.validFields.isntVAPIGrp = true;
        return;
      }
    } else {
      $scope.apiIntegratorGroupId = null;
      if (['', null, void 0].indexOf($scope.FinalAction.Execution.LibraryInfo.AssemblyLocation) === -1 && ['', null, void 0].indexOf($scope.FinalAction.Execution.LibraryInfo.Method) === -1 && ['', null, void 0].indexOf($scope.FinalAction.Execution.LibraryInfo.ClassName) === -1) {
        $scope.FinalAction.Type = "ACTION";
        if (['', null, void 0].indexOf($scope.DllOutputParms) === -1 && ['', null, void 0].indexOf($scope.DllInputParms) === -1) {
          $scope.SetDLLParams();
        } else {

        }
        $scope.currentStep = 0;
        if ($scope.processedSteps.indexOf(-2) === -1) {
          $scope.processedSteps.push(-2);
        }
      } else {
        $scope.validFields.isntVAPIType = true;
        if (['', null, void 0].indexOf($scope.FinalAction.Execution.LibraryInfo.AssemblyLocation) !== -1) {
          $scope.validFields.isntVDllName = true;
        }
        if (['', null, void 0].indexOf($scope.FinalAction.Execution.LibraryInfo.ClassName) !== -1) {
          $scope.validFields.isntVClsName = true;
        }
        if (['', null, void 0].indexOf($scope.FinalAction.Execution.LibraryInfo.Method) !== -1) {
          $scope.validFields.isntVMtdName = true;
        }
        return;
      }
    }
    if ($scope.processedSteps.indexOf($scope.currentStep) === -1) {
      return $scope.processedSteps.push($scope.currentStep);
    }
  };
  $scope.GetParamsN = function(APIGroupId) {
    if (APIGroupId !== null) {
      return $scope.apiIntegratorGroupId = APIGroupId;
    }
  };
  $scope.actionTypeList = [
    {
      name: 'API Integrator',
      value: 'APIINTEGRATOR'
    }, {
      name: 'DLL Based Action',
      value: 'ACTION'
    }
  ];
  $scope.SetDLLParams = function() {
    var configkeys, countInput, countOutput;
    countInput = $scope.DllInputParms.length;
    countOutput = $scope.DllOutputParms.length;
    $scope.FinalAction.Outputs = [];
    $scope.outputParams = [];
    angular.forEach($scope.DllOutputParms, (function(value) {
      var output;
      output = {
        Name: value.outputName,
        Type: value.outputType,
        OutputExpression: value.outputExpression,
        Sample: value.outputSample,
        Description: value.outputDescription
      };
      $scope.FinalAction.Outputs.push(output);
      return $scope.outputParams.push(output);
    }));
    configkeys = [];
    $scope.mandatoryInputParams = [];
    angular.forEach($scope.DllInputParms, (function(value) {
      var abce;
      abce = {
        params: value[0]
      };
      configkeys.push(abce);
      return $scope.mandatoryInputParams.push(value[0]);
    }));
    return $scope.inputParams = configkeys;
  };
  $scope.AddDllInputParams = function() {
    var count, inputParam;
    count = $scope.DllInputParms.length;
    count += 1;
    inputParam = {
      Id: count
    };
    return $scope.DllInputParms.push(inputParam);
  };
  $scope.DeleteDllInputParams = function(item) {
    var i, _results;
    $scope.DllInputParms.splice(item - 1, 1);
    i = 0;
    _results = [];
    while (i < $scope.DllInputParms.length) {
      $scope.DllInputParms[i].Id = i + 1;
      _results.push(i++);
    }
    return _results;
  };
  $scope.AddDllOutputParams = function() {
    var count, outputParam;
    count = $scope.DllOutputParms.length;
    count += 1;
    outputParam = {
      Id: count
    };
    return $scope.DllOutputParms.push(outputParam);
  };
  $scope.DeleteDllOutputParams = function(item) {
    var i, _results;
    $scope.DllOutputParms.splice(item - 1, 1);
    i = 0;
    _results = [];
    while (i < $scope.DllOutputParms.length) {
      $scope.DllOutputParms[i].Id = i + 1;
      _results.push(i++);
    }
    return _results;
  };
  $scope.PropertyMappingCheck = function(prop) {
    var positionOfControl, selectedCol, selectedRow;
    selectedRow = $scope.selectedCell.row;
    selectedCol = $scope.selectedCell.col;
    $scope.validFields.isntVMapping = false;
    positionOfControl = void 0;
    angular.forEach($scope.actionGrid, (function(row) {
      return angular.forEach(row.value, (function(col) {
        if (['', null, void 0].indexOf(col.properties) === -1) {
          if (selectedRow.toString() + selectedCol.toString() !== row.id.toString() + col.colNumber.toString()) {
            if (['', null, void 0].indexOf(prop.value) === -1 && ['', null, void 0].indexOf(col.properties[0]) === -1) {
              if (prop.value.params === col.properties[0].value.params) {
                $scope.validFields.isntVMapping = true;
                $scope.validFields.isntVABForm = true;
                $scope.deleteRow = row.id;
                $scope.deleteCol = col.colNumber;
                return positionOfControl = col.controlType + " at Row:" + row.id + ", Column:" + col.colNumber;
              }
            }
          }
        }
      }));
    }));
    if ($scope.validFields.isntVMapping) {
      AricMessage.showConfirmationMessage('This property has already been mapped to the control ' + positionOfControl + ' If you proceed, the earlier mapping will be lost. Do you want to proceed?', $scope.goToNext, $scope.updatePropertyName);
      return;
    } else {
      $scope.getInputDescription();
      angular.forEach($scope.actionGrid[selectedRow - 1].value[selectedCol - 1].properties, (function(prop) {
        var propList, value;
        if (prop.key === "Source Type") {
          prop.value = "";
        } else if (prop.key === 'Required') {
          propList = $scope.actionGrid[selectedRow - 1].value[selectedCol - 1].properties;
          if (propList && propList.length > 0) {
            value = $scope.actionGrid[selectedRow - 1].value[selectedCol - 1].properties[0].value;
            if (value !== null && value.params && $scope.mandatoryInputParams.indexOf(value.params) !== -1) {
              prop.value = true;
              $scope.requiredDisabled = true;
            } else {
              $scope.requiredDisabled = false;
            }
          }
        }
      }));
    }
  };
  $scope.goToNext = function() {
    $scope.MapPropertyToOldControl($scope.deleteRow, $scope.deleteCol);
  };
  $scope.updatePropertyName = function() {
    $scope.MapPropertyToOldControl($scope.selectedCell.row, $scope.selectedCell.col);
  };
  $scope.MapPropertyToNewControl = function() {
    var prop, selectedCol, selectedRow;
    selectedRow = $scope.selectedCell.row;
    selectedCol = $scope.selectedCell.col;
    prop = $scope.actionGrid[selectedRow - 1].value[selectedCol - 1].properties;
    angular.forEach($scope.actionGrid, (function(row) {
      return angular.forEach(row.value, (function(col) {
        if (['', null, void 0].indexOf(col.properties) === -1) {
          if (selectedRow.toString() + selectedCol.toString() !== row.id.toString() + col.colNumber.toString()) {
            if (prop[0].value.params === col.properties[0].value.params) {
              col.properties[0].value = "-- choose Property --";
              if (col.controlType === "Dropdown List") {
                if (col.properties[4].value === "Fixed") {
                  col.properties[5].value = [
                    {
                      text: "",
                      value: ""
                    }
                  ];
                } else if (col.properties[4].value === "External") {
                  col.properties[6].value = "";
                }
                return col.properties[4].value = "";
              } else {
                if (col.properties[3].value === "Fixed") {
                  col.properties[4].value = [
                    {
                      text: "",
                      value: ""
                    }, {
                      text: "",
                      value: ""
                    }
                  ];
                } else if (col.properties[3].value === "External") {
                  col.properties[5].value = "";
                }
                return col.properties[3].value = "";
              }
            }
          }
        }
      }));
    }));
    $scope.getInputDescription();
    return $scope.closeModalPopup();
  };
  $scope.MapPropertyToOldControl = function(row, col) {
    var selectedCol, selectedRow;
    selectedRow = row;
    selectedCol = col;
    angular.forEach($scope.actionGrid, (function(row) {
      return angular.forEach(row.value, (function(col) {
        if (['', null, void 0].indexOf(col.properties) === -1) {
          if (selectedRow.toString() + selectedCol.toString() === row.id.toString() + col.colNumber.toString()) {
            col.properties[0].value = "-- choose Property --";
            if (col.controlType === "Dropdown List") {
              if (col.properties[4].value === "Fixed") {
                col.properties[5].value = [
                  {
                    text: "",
                    value: ""
                  }
                ];
              } else if (col.properties[4].value === "External") {
                col.properties[6].value = "";
              }
              return col.properties[4].value = "";
            } else {
              if (col.properties[3].value === "Fixed") {
                col.properties[4].value = [
                  {
                    text: "",
                    value: ""
                  }, {
                    text: "",
                    value: ""
                  }
                ];
              } else if (col.properties[3].value === "External") {
                col.properties[5].value = "";
              }
              return col.properties[3].value = "";
            }
          }
        }
      }));
    }));
    $scope.getInputDescription();
    return $scope.closeModalPopup();
  };
  $scope.RemoveListItem = function(index, propValue) {
    var DeletedListItem;
    DeletedListItem = {
      propName: $scope.actionGrid[$scope.selectedCell.row - 1].value[$scope.selectedCell.col - 1].properties[0].value.params,
      listItem: propValue[index].text
    };
    $scope.DeletedListItems.push(DeletedListItem);
    return propValue.splice(index, 1);
  };
  $scope.activateTab = function(pageId) {
    var i, node, pageToActivate, tabCtrl;
    tabCtrl = document.getElementById("tabCtrl");
    pageToActivate = document.getElementById(pageId);
    i = 0;
    while (i < tabCtrl.childNodes.length) {
      node = tabCtrl.childNodes[i];
      if (node.nodeType === 1) {
        node.style.display = (node === pageToActivate ? "block" : "none");
      }
      i++;
    }
  };
  $scope.SetSourceType = function(sourceType) {
    var propName;
    $scope.validFields.isntVRequired = false;
    if (['', null, void 0].indexOf($scope.actionGrid[$scope.selectedCell.row - 1].value[$scope.selectedCell.col - 1].properties[0].value) === -1) {
      propName = $scope.actionGrid[$scope.selectedCell.row - 1].value[$scope.selectedCell.col - 1].properties[0].value.params;
      if (['', null, void 0].indexOf(propName) === -1) {
        return $scope.SourceType[propName] = sourceType;
      } else {
        $scope.validFields.isntVABForm = true;
        $scope.validFields.isntVRequired = true;
        $scope.requiredValidationPopupMessage = "Please select a Property Name to select the Source Type.";
      }
    } else {
      $scope.validFields.isntVABForm = true;
      $scope.validFields.isntVRequired = true;
      $scope.requiredValidationPopupMessage = "Please select a Property Name to select the Source Type.";
    }
  };
  $scope.ShowListOrAPI = function() {
    var propName;
    if (['', null, void 0].indexOf($scope.actionGrid[$scope.selectedCell.row - 1].value[$scope.selectedCell.col - 1].properties[0].value) === -1) {
      propName = $scope.actionGrid[$scope.selectedCell.row - 1].value[$scope.selectedCell.col - 1].properties[0].value.params;
      if (['', null, void 0].indexOf(propName) === -1) {
        if (['', null, void 0].indexOf($scope.SourceType[propName]) === -1) {
          if ($scope.actionGrid[$scope.selectedCell.row - 1].value[$scope.selectedCell.col - 1].controlType === "Dropdown List") {
            $scope.actionGrid[$scope.selectedCell.row - 1].value[$scope.selectedCell.col - 1].properties[4].value = $scope.SourceType[propName];
          } else {
            $scope.actionGrid[$scope.selectedCell.row - 1].value[$scope.selectedCell.col - 1].properties[3].value = $scope.SourceType[propName];
          }
          return $scope.SourceType[propName];
        }
      }
    }
  };
  $scope.SetPropValue = function(APIGroupId) {
    var selectedCol, selectedRow;
    selectedRow = $scope.selectedCell.row;
    selectedCol = $scope.selectedCell.col;
    angular.forEach($scope.actionGrid[selectedRow - 1].value[selectedCol - 1].properties, (function(prop) {
      if (prop.key === "APIGroupId") {
        return prop.value = APIGroupId;
      }
    }));
    return GetAPIGroupOutputData(APIGroupId);
  };
  GetAPIGroupOutputData = function(apiGroupID) {
    var selectedCol, selectedRow;
    selectedRow = $scope.selectedCell.row;
    selectedCol = $scope.selectedCell.col;
    if (['', null, void 0].indexOf(apiGroupID) === -1) {
      promise = ActionBuilderService.executeAPIGroup(apiGroupID);
      return promise.then(function(data) {
        var i, output, outputData, outputDataFormatted;
        if (data.success) {
          outputData = JSON.parse(data.response.Output);
          if (outputData instanceof Array) {
            outputDataFormatted = [];
            i = 0;
            while (i < outputData.length) {
              output = {
                value: outputData[i].ID,
                text: outputData[i].Name
              };
              outputDataFormatted.push(output);
              i++;
            }
          }
          return angular.forEach($scope.actionGrid[selectedRow - 1].value[selectedCol - 1].properties, (function(prop) {
            if (prop.key === "APIOutput") {
              return prop.value = outputDataFormatted;
            }
          }));
        }
      });
    }
  };
  $scope.toggle = function() {
    $scope.isVisible = !$scope.isVisible;
    if ($scope.iconClass === "fa fa-caret-up fa-2x") {
      $scope.iconClass = "fa fa-caret-down fa-2x";
      $scope.showOuterDiv = true;
    } else {
      $scope.iconClass = "fa fa-caret-up fa-2x";
      $scope.showOuterDiv = false;
    }
  };
  $scope.getInputDescription = function() {
    var propDescription, propName, selectedCol, selectedRow;
    selectedRow = $scope.selectedCell.row;
    selectedCol = $scope.selectedCell.col;
    propName = $scope.actionGrid[selectedRow - 1].value[selectedCol - 1].properties[0].value;
    propDescription = void 0;
    angular.forEach($scope.inputParamsDescription, (function(inputParam) {
      if (['', null, void 0].indexOf(propName) === -1 && inputParam.Input === propName.params) {
        return propDescription = inputParam.Description;
      }
    }));
    angular.forEach($scope.actionGrid[selectedRow - 1].value[selectedCol - 1].properties, (function(prop) {
      if (prop.key === "Description") {
        return prop.value = propDescription;
      }
    }));
    return angular.forEach($scope.actionGrid, (function(row) {
      return angular.forEach(row.value, (function(col) {
        var emptyPropDesc;
        if (['', null, void 0].indexOf(col.properties) === -1) {
          emptyPropDesc = false;
          return angular.forEach(col.properties, (function(prop) {
            if (prop.key === "Property Name") {
              if (['', null, void 0].indexOf(prop.value) !== -1 || prop.value === "-- choose Property --") {
                emptyPropDesc = true;
              }
            }
            if (prop.key === "Description" && emptyPropDesc) {
              return prop.value = "";
            }
          }));
        }
      }));
    }));
  };
  $scope.resetAction = function() {
    $scope.APIGroupsWithoutInputs = [];
    $scope.apiIntegratorGroupId = "";
    $scope.processedSteps = [];
    $scope.propertiesAssignedToGridControls = [];
    $scope.fixedPropertiesMissingValues = [];
    $scope.requiredValidationPopupMessage = void 0;
    $scope.inputParamsForFixedProperties = [];
    $scope.fixedSelected = true;
    $scope.selectedCell = {};
    $scope.FinalAction = new Object();
    $scope.selectedCell.row = 1;
    $scope.selectedCell.col = 1;
    $scope.fixedPropControls = [];
    $scope.categories = [];
    $scope.DeletedListItems = [];
    $scope.FinalAction.Category = [];
    $scope.FinalAction.Labels = [];
    $scope.FinalAction.Outputs = [];
    $scope.FinalAction.Permissions = new Object();
    $scope.FinalAction.FixedProperties = new Object();
    $scope.FinalAction.DefaultProperties = new Object();
    $scope.FinalAction.PropertyDefinitions = new Object();
    $scope.FinalAction.Execution = new Object();
    $scope.FinalAction.Execution.LibraryInfo = new Object();
    $scope.FinalAction.TimeOut = "";
    $scope.oldPropDefListItems = [];
    $scope.APIGroupsWithoutInputs = [];
    $scope.APIGroupsWithoutInputsLoaded = false;
    $scope.APIGroupsWithoutInputs.push(emptyItem = {
      APIGroupId: "",
      APIGroupName: ""
    });
    ActionBuilderService.action = JSON.parse(JSON.stringify(ActionBuilderService.defaultAction));
    $scope.actionGrid = ActionBuilderService.action.grid;
    $scope.SourceType = new Object();
    $scope.FinalAction.Type = "APIINTEGRATOR";
    PropControlsFix();
    $scope.inputParams = [];
    $scope.inputParamsDescription = [];
    $scope.tmpRolesItems = [];
    return $scope.APIGroups = [];
  };
  $scope.validateDupes = function(list, value, listProp) {
    var count;
    if (listProp === "text") {
      count = 0;
      angular.forEach(list, (function(listItem) {
        if (listItem.text === value) {
          return count = count + 1;
        }
      }));
      if (count > 1) {
        $scope.dupeOptionTextWarningMessage = "Duplicate Text. Will be ignored.";
      } else {
        $scope.dupeOptionTextWarningMessage = void 0;
      }
    }
    if (listProp === "value") {
      count = 0;
      angular.forEach(list, (function(listItem) {
        if (listItem.value === value) {
          return count = count + 1;
        }
      }));
      if (count > 1) {
        $scope.dupeOptionValueWarningMessage = "Duplicate Value. Will be ignored.";
      } else {
        $scope.dupeOptionValueWarningMessage = void 0;
      }
    }
    if (listProp === "Name") {
      count = 0;
      angular.forEach(list, (function(listItem) {
        if (listItem.Name === value) {
          return count = count + 1;
        }
      }));
      if (count > 1) {
        $scope.dupeRuleNameWarningMessage = "Duplicate Name. Will be ignored.";
      } else {
        $scope.dupeRuleNameWarningMessage = void 0;
      }
    }
    if (listProp === "Event") {
      count = 0;
      angular.forEach(list, (function(listItem) {
        if (listItem.Event === value) {
          return count = count + 1;
        }
      }));
      if (count > 1) {
        return $scope.dupeRuleEventWarningMessage = "Duplicate Event. Will be ignored.";
      } else {
        return $scope.dupeRuleEventWarningMessage = void 0;
      }
    }
  };
  $scope.showVCategory = function() {
    $scope.reloadCategoryTree();
    $("#addCategoryContainer").foundation("reveal", "open");
  };
  $scope.closeCategoryPopup = function() {
    $scope.errMsg = '';
    $scope.isAddNewCatogory = false;
  };
  $scope.addCategory = function() {
    $scope.categories = angular.copy($scope.tempCategory);
    $("#addCategoryContainer").foundation("reveal", "close");
  };
  $scope.generateCategory = function() {
    var promiseCategory;
    promiseCategory = ActionBuilderService.GetActionCategory($scope.tenantID);
    return promiseCategory.then(function(data) {
      if (data.success) {
        $scope.categoryData = data.data;
        $scope.loadCategory();
        $scope.initCategoryTree();
        return $scope.initTreeMenu();
      } else {
        return $scope.categoryTreeList = [];
      }
    });
  };
  $scope.loadCategory = function() {
    $scope.categoryTreeList = [];
    $scope.categoryHashTable = [];
    $scope.categoryData.sort();
    return angular.forEach($scope.categoryData, (function(value, key) {
      return $scope.generateCategoryTree(value);
    }));
  };
  $scope.generateCategoryTree = function(category) {
    var isNew, itemId, parentID, subCatList, treeItem;
    subCatList = category.split(':');
    treeItem = [];
    itemId = "";
    parentID = "";
    isNew = true;
    angular.forEach(subCatList, (function(value, key) {
      var isCheck, isINode, item, parentItem;
      parentID = itemId;
      if (key === 0) {
        itemId = value;
      }
      if (key > 0) {
        itemId = itemId + ":" + value;
      }
      if (!$scope.categoryHashTable[itemId]) {
        isINode = subCatList.length > 0 && subCatList.length > key + 1 ? true : false;
        isCheck = ($.inArray(itemId, $scope.categories)) > -1 ? true : false;
        item = {
          "id": $scope.htmlToText(itemId),
          "label": $scope.htmlToText(value),
          "inode": isINode,
          "open": false,
          "checkbox": true,
          "checked": isCheck,
          "branch": []
        };
        if (key > 0) {
          parentItem = $scope.categoryHashTable[parentID];
        }
        if (key > 0) {
          parentItem.branch.push(item);
        }
        if (key === 0) {
          treeItem = item;
        }
        $scope.categoryHashTable[itemId] = item;
      } else {
        return isNew = false;
      }
    }));
    if (isNew) {
      $scope.categoryTreeList.push(treeItem);
    }
  };
  $scope.htmlToText = function(html) {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  $scope.textToHtml = function(text) {
    return text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>');
  };
  $scope.updateCategory = function(value, isAdd) {
    var index;
    value = $scope.textToHtml(value);
    index = $.inArray(value, $scope.tempCategory);
    if (index === -1) {
      if (isAdd) {
        return $scope.tempCategory.push(value);
      }
    } else {
      if (!isAdd) {
        return $scope.tempCategory.splice(index, 1);
      }
    }
  };
  $scope.initCategoryTree = function() {
    var me, treeData;
    me = this;
    $scope.isAddNewCatogory = false;
    $scope.tempCategory.concat($scope.categories);
    treeData = $scope.categoryTreeList;
    $("#categoryTree").aciTree({
      rootData: treeData,
      checkbox: true,
      checkboxChain: false
    });
    me.treeApi = $("#categoryTree").aciTree("api");
    me.treeApi.init();
    $scope.treeApi = me.treeApi;
    return $("#categoryTree").on("acitree", function(event, api, item, eventName, options) {
      var currentData;
      switch (eventName) {
        case "opened":
          return currentData = api.itemData(item);
        case "checked":
          currentData = api.itemData(item);
          return $scope.updateCategory(currentData.id, true);
        case "unchecked":
          currentData = api.itemData(item);
          return $scope.updateCategory(currentData.id, false);
        case "added":
          return currentData = api.itemData(item);
      }
    });
  };
  $scope.reloadCategoryTree = function() {
    var rootActions;
    $scope.categorySearch = "";
    $scope.errMsg = "";
    $scope.isAddNewCatogory = false;
    $scope.tempCategory = angular.copy($scope.categories);
    rootActions = [
      {
        'id': 'Root',
        'label': 'Actions',
        'inode': false,
        'open': true,
        'branch': [],
        'checkbox': false
      }
    ];
    $scope.loadCategory();
    $scope.treeApi.unload(null, {
      success: function() {
        rootActions[0].branch = $scope.categoryTreeList;
        this.loadFrom(null, {
          itemData: rootActions
        });
      }
    });
  };
  $scope.initTreeMenu = function(element) {
    $('#categoryTree').contextMenu({
      selector: '.aciTreeItem',
      zIndex: 1040,
      build: function(element) {
        var item, itemData, itemValue, menu, parItem, parent;
        item = $scope.treeApi.itemFrom(element);
        parent = $scope.treeApi.topParent(item);
        $scope.selectedTreeItem = element;
        if (parent.length <= 0) {
          parent = item;
        }
        parItem = $scope.treeApi.getId(parent);
        $('#parentitemId').val(parItem);
        $scope.treeApi.select(item);
        $(item).addClass('aciTreeSelected');
        $(item).addClass('aciTreeFocus');
        menu = {};
        itemData = $scope.treeApi.itemData(item);
        itemValue = $scope.treeApi.getId(item);
        if (itemData.id === parItem) {
          menu['Add New Category'] = {
            name: 'Add NewCategory',
            callback: function() {
              $scope.isAddNewCatogory = true;
              $scope.newCategory = "";
              $scope.$apply();
            },
            disabled: function(key, opt) {
              return !$scope.isAdminUser;
            }
          };
        } else {
          menu['AddNewCategory'] = {
            name: 'Add New Category',
            callback: function() {
              $scope.isAddNewCatogory = true;
              $scope.newCategory = '';
              $scope.$apply();
            }
          };
        }
        return {
          autoHide: true,
          items: menu
        };
      }
    });
  };
  $scope.checkSpecialCharacters = function(strString) {
    var blnResult, i, strChar, strValidChars;
    strValidChars = ":/\\";
    i = 0;
    blnResult = false;
    while (i < strString.length) {
      strChar = strString.charAt(i);
      if (strValidChars.indexOf(strChar) !== -1) {
        blnResult = true;
        return blnResult;
      }
      i++;
    }
    return blnResult;
  };
  $scope.removeCategory = function(index) {
    return $scope.categories.splice(index, 1);
  };
  $scope.addSubCategory = function() {
    var branch, item, itemId, parentBranch, selectedItem, selectedItemData, updatedItemData;
    $scope.errMsg = "";
    if ($scope.hasSpecialCharacters($scope.newCategory) || $scope.checkSpecialCharacters($scope.newCategory)) {
      $scope.errMsg = "Special Characters exists";
      return;
    }
    selectedItem = $scope.treeApi.itemFrom($scope.selectedTreeItem);
    updatedItemData = $scope.treeApi.itemData(selectedItem);
    itemId = (updatedItemData.id === 'Root' ? '' : $scope.textToHtml(updatedItemData.id) + ':') + $scope.newCategory;
    if ($scope.categoryHashTable[itemId]) {
      $scope.errMsg = "Category already exists";
      return;
    }
    selectedItemData = "";
    item = {
      "id": itemId,
      "label": $scope.newCategory,
      "inode": false,
      "open": false,
      "checkbox": true,
      "checked": true,
      "branch": []
    };
    $scope.categoryData.push(itemId);
    $scope.categoryHashTable[itemId] = item;
    if (itemId === $scope.newCategory) {
      $scope.categoryTreeList.push(item);
      branch = $scope.categoryTreeList;
    } else {
      parentBranch = $scope.categoryHashTable[updatedItemData.id];
      if (parentBranch && parentBranch.branch && parentBranch.branch.length > 0) {
        branch = parentBranch.branch;
        branch.push(item);
      } else {
        parentBranch.branch = branch = [item];
      }
    }
    $scope.treeApi.setInode(selectedItem);
    $scope.treeApi.unload(selectedItem, {
      success: function() {
        $scope.treeApi.loadFrom(selectedItem, {
          itemData: branch
        });
        return $scope.treeApi.open(selectedItem);
      }
    });
    $scope.isAddNewCatogory = false;
    return $scope.updateCategory(item.id, true);
  };
  jQuery(function($) {
    var searchAction, togforclear;
    togforclear = function(v) {
      if (v) {
        return 'addClass';
      } else {
        return 'removeClass';
      }
    };
    searchAction = function(value) {
      var api;
      api = $('#categoryTree.aciTree:visible').aciTree('api');
      api.filter(null, {
        search: value,
        success: function(item, options) {
          var inodes, rootChildren;
          if (options.first === null) {
            $('#categoryTree').removeHighlight();
            $('#categorySearchText').html($('#categorySearch').val());
            $('#noCategory').show();
          } else {
            api = $('#categoryTree').aciTree('api');
            rootChildren = api.children(null);
            inodes = api.inodes(rootChildren);
            $('#noCategory').hide();
            if ($('#categorySearch').val().length > 2) {
              inodes.each(function() {});
              api.open($(this), {
                expand: true
              });
              return;
              $('#categoryTree').removeHighlight();
              $('#categoryTree').highlight($('#categorySearch').val());
            } else if ($('#categorySearch').val().length === 0) {
              $('#categoryTree').removeHighlight();
              inodes.each(function() {});
              api.close($(this), {
                collapse: true
              });
              return;
            } else {
              $('#categoryTree').removeHighlight();
            }
          }
        }
      });
    };
    $(document).on('input', '#categorySearch.clearable', function() {
      $('#categorySearch').addClass('x');
    }).on('mousemove', '#categorySearch.clearable.x', function(e) {
      if (e.clientX >= $(this).width() + this.getBoundingClientRect().left - 10) {
        if (this.value.length > 0) {
          $('#categorySearch').addClass('x');
          $('#categorySearch').css('cursor', 'pointer');
        } else {
          $('#categorySearch').css('cursor', 'text');
        }
        if ($('#categorySearch').val() === '') {
          $('#categorySearch').removeClass('x');
        } else {
          $('#categorySearch').addClass('x');
        }
      }
    }).on('click', '#categorySearch.clearable', function(e) {
      if (e.clientX >= $(this).width() + this.getBoundingClientRect().left - 10) {
        $(this).removeClass('onX').val('').change();
        $('#categorySearch').css('cursor', 'text');
      }
      searchAction($(this).val());
    }).on('input', '#categorySearch.clearable', function(e) {
      searchAction($(this).val());
      if ($('#categorySearch').val() === '') {
        $('#categorySearch').removeClass('x');
      } else {
        $('#categorySearch').addClass('x');
      }
    });
  });
  if ($rootScope.cacheValue) {
    return $rootScope.initializeCreateAction();
  }
});
