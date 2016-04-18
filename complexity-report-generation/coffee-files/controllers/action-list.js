var app;

app = void 0;

app = angular.module("asweb.controllers", ["ngAnimate"]).controller("ActionListController", function($scope, $rootScope, $http, $location, $timeout, SessionService, ActionBuilderService, accessService, GenericUtilities, DataBasket, GroupService, searchKeywordService) {
  var PropControlsFix, emptyItem, getInputParamsIndex, promise, promiseActionGet, promiseGroup, resetColIndex, resetIndex, setActionGridControls;
  $rootScope.currentMode = $rootScope.mode.View;
  $rootScope.actionId = "";
  $scope.APIIntegratorBaseUrl = "/aric/v1/api-integrator/";
  PropControlsFix = void 0;
  emptyItem = void 0;
  getInputParamsIndex = void 0;
  promise = void 0;
  promiseActionGet = void 0;
  promiseGroup = void 0;
  resetColIndex = void 0;
  resetIndex = void 0;
  setActionGridControls = void 0;
  $scope.hide = false;
  $scope.promise = void 0;
  $rootScope.ViewMode = true;
  $scope.editMode = false;
  $rootScope.currentPage = "action-list";
  $scope.apiIntegratorGroupId = "";
  $scope.actionId = "";
  promise = void 0;
  promiseActionGet = void 0;
  promiseGroup = void 0;
  $scope.currentStep = 0;
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
  $scope.catControls = [];
  $scope.DeletedListItems = [];
  $scope.FinalAction.Category = [];
  $scope.FinalAction.Labels = [];
  $scope.FinalAction.FixedProperties = new Object();
  $scope.FinalAction.DefaultProperties = new Object();
  $scope.FinalAction.PropertyDefinitions = new Object();
  $scope.isCreateAction = false;
  $scope.FinalAction.Execution = new Object();
  $scope.FinalAction.Execution.LibraryInfo = new Object();
  $scope.oldPropDefListItems = [];
  $rootScope.bhdisabled = false;
  $scope.Category = "";
  $scope.Timeout = "";
  $scope.Outputs = [];
  $scope.ActionType = "";
  $scope.DefaultProperties = [];
  $scope.APIName = "";
  $scope.actionName = "";
  $scope.iconClass = "fa fa-caret-down fa-2x";
  $scope.propertiesList = "false";
  $scope.showOuterDiv = true;
  $scope.errorMessage = " ";
  $rootScope.showManageAccessButton = false;
  $scope.myActionList = null;
  $scope.isMyList = true;
  $rootScope.matrixPermissionDenied = false;
  $scope.validKeywords = [];
  $('#entityPermissionDeniedMessage').removeClass('hideSection').addClass('hideSection').removeClass('unhideSection');
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
  $rootScope.getActionlist = function() {
    $scope.propertiesList = false;
    $scope.selectedItem = null;
    $('#entityPermissionDeniedMessage').addClass('hideSection').removeClass('unhideSection');
    if ($rootScope.cacheValue === void 0) {
      $rootScope.cacheValue = GenericUtilities.getCacheValue($rootScope.cacheValue, "rackspace");
    }
    $scope.processMatrix = GenericUtilities.getProcessMatrix($rootScope.cacheValue, "rackspace");
    $scope.promise = ActionBuilderService.getActionList($scope.processMatrix);
    $scope.promise.then(function(data) {
      var _ref, _ref1;
      if (((_ref = data.data.ResultSet) != null ? (_ref1 = _ref.ResultSet) != null ? _ref1.length : void 0 : void 0) > 0) {
        $scope.items = data.data.ResultSet.ResultSet;
        $scope.myActionList = $scope.getMyList(true);
      }
      return $scope.hide = true;
    });
  };
  $rootScope.actionPermission = function() {
    if ($rootScope.cacheValue === void 0) {
      $rootScope.cacheValue = GenericUtilities.getCacheValue($rootScope.cacheValue, "rackspace");
    }
    $scope.processMatrix = GenericUtilities.getProcessMatrix($rootScope.cacheValue, "rackspace");
    $scope.tmpRolesItems = ActionBuilderService.checkMatrixPermission($scope.processMatrix);
    $scope.tmpRolesItems.then(function(data) {
      if (data.data.length > 0) {
        $scope.editMode = data.data;
        if ($scope.editMode === "true") {
          $scope.addShow = $rootScope.addShow = true;
          DataBasket.users = [];
          DataBasket.roles = [];
          DataBasket.rawusers = [];
          return DataBasket.rawroles = [];
        } else {
          return $scope.addShow = $rootScope.addShow = false;
        }
      }
    });
  };
  $rootScope.getMatrixPermission = function(flag) {
    if ($rootScope.cacheValue === void 0) {
      $rootScope.cacheValue = GenericUtilities.getCacheValue($rootScope.cacheValue, "rackspace");
    }
    $scope.processMatrix = GenericUtilities.getProcessMatrix($rootScope.cacheValue, "rackspace");
    $scope.matrix = JSON.stringify(GenericUtilities.getMatrix($rootScope.cacheValue, "rackspace"));
    $scope.tmpRolesItems = GroupService.checkMatixPermission($scope.processMatrix);
    $scope.tmpRolesItems.then(function(data) {
      var editMode;
      if (data.data.length > 0) {
        editMode = data.data;
        if (editMode === "true") {
          $rootScope.showManageAccessButton = true;
        } else {
          $rootScope.showManageAccessButton = false;
        }
        if (flag === true && aricGlobal.edit.root && aricGlobal.edit.root !== "") {
          if (editMode === "true") {
            return $rootScope.BHChange = flag;
          } else {
            return $rootScope.BHChange = false;
          }
        }
      }
    });
  };
  $scope.isVisible = false;
  $scope.onClick = function() {
    return $scope.openProperties = !$scope.openProperties;
  };
  $scope.currentUser = SessionService.getSessionData();
  $scope.setManageAccess = function() {
    var permissionAPI;
    $rootScope.showManageAccessButton = false;
    if ($rootScope.isAdminUser) {
      return $rootScope.showManageAccessButton = true;
    } else {
      permissionAPI = accessService.getPermissions($scope.actionId, $scope.currentUser);
      permissionAPI.then((function(data) {
        var user, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        if (data.success) {
          if (((_ref = data.response) != null ? (_ref1 = _ref.Permissions) != null ? (_ref2 = _ref1.InternalIdentity) != null ? (_ref3 = _ref2.AllowedAccess) != null ? (_ref4 = _ref3.Owner) != null ? _ref4.Users : void 0 : void 0 : void 0 : void 0 : void 0) != null) {
            _ref5 = data.response.Permissions.InternalIdentity.AllowedAccess.Owner.Users;
            for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
              user = _ref5[_i];
              if (user.UserName === $scope.currentUser) {
                $rootScope.showManageAccessButton = true;
                return;
              }
            }
          }
        }
      }));
    }
  };
  $scope.openAction = function(action) {
    var configkeys, i, _ref, _ref1;
    DataBasket.users = [];
    DataBasket.roles = [];
    DataBasket.rawusers = [];
    DataBasket.rawroles = [];
    $scope.ShowEdit = action.HasWriteAccess || action.HasOwnerAccess || $rootScope.isAdminUser;
    configkeys = void 0;
    i = void 0;
    $scope.actionGrid = [];
    $scope.RowCount = ActionBuilderService.action.grid.length;
    angular.copy(ActionBuilderService.action.grid, $scope.actionGrid);
    $scope.selectedItem = action.ID;
    $scope.actionId = $rootScope.actionId = action.ID;
    $scope.actionName = action.Name;
    $scope.ShowEdit = action.HasWriteAccess;
    $rootScope.showManageAccessButton = action.HasOwnerAccess || $rootScope.isAdminUser;
    $scope.Category = "";
    $scope.Timeout = "";
    $scope.ActionType = "";
    $scope.propertiesList = "true";
    $scope.selectedCell.row = 1;
    $scope.selectedCell.col = 1;
    $scope.actionName = "";
    $scope.fixedProperties = [];
    $scope.DefaultProperties = [];
    $scope.Outputs = [];
    if ((action != null ? action.FixedProperties : void 0) != null) {
      for (i in action.FixedProperties) {
        if (action.FixedProperties.hasOwnProperty) {
          $scope.fixedProperties.push({
            name: i,
            value: action.FixedProperties[i]
          });
        }
      }
    }
    if ((action != null ? action.DefaultProperties : void 0) != null) {
      for (i in action.DefaultProperties) {
        if (action.DefaultProperties.hasOwnProperty) {
          $scope.DefaultProperties.push({
            name: i,
            value: action.DefaultProperties[i]
          });
        }
      }
    }
    if (action.Type != null) {
      $scope.ActionType = action.Type;
    }
    if (((_ref = action.Execution) != null ? _ref.APIIntegratorGroupID : void 0) != null) {
      $scope.APIName = action.Execution.APIIntegratorGroupID;
    }
    $scope.currentStep = 0;
    $scope.FinalAction = action;
    if (((_ref1 = action.Category) != null ? _ref1[0] : void 0) != null) {
      $scope.Category = action.Category[0];
    }
    if (action.TimeOut != null) {
      $scope.Timeout = action.TimeOut;
    }
    if (action.Outputs != null) {
      $scope.Outputs = action.Outputs;
    }
    if ($scope.FinalAction.Type === "ACTION") {
      configkeys = [];
      $scope.mandatoryInputParams = [];
      angular.forEach($scope.FinalAction.PropertyDefinitions, (function(obj, objKey) {
        var abce;
        abce = void 0;
        abce = {
          params: objKey
        };
        configkeys.push(abce);
        return $scope.mandatoryInputParams.push(objKey);
      }));
      angular.forEach($scope.FinalAction.FixedProperties, (function(obj, objKey) {
        var abce;
        abce = void 0;
        abce = {
          params: objKey
        };
        configkeys.push(abce);
        return $scope.mandatoryInputParams.push(objKey);
      }));
      $scope.inputParams = configkeys;
      PropControlsFix();
    } else {
      $scope.apiIntegratorGroupId = $scope.FinalAction.Execution.APIIntegratorGroupID;
      promiseGroup = ActionBuilderService.getApiGroupInputs($scope.apiIntegratorGroupId);
      promiseGroup.then(function(data2) {
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
          angular.forEach(data2.data.DataStore.OutputParams, function(value, key) {
            configkeys.push(value.Key);
            return $scope.outputParams = configkeys;
          });
        }
        PropControlsFix();
      });
    }
  };
  $scope.getMyList = function(isMyList) {
    var i, result, _i, _ref;
    $scope.isMyList = isMyList;
    if ($scope.isMyList) {
      $scope.myActionList = null;
      if ($scope.items) {
        result = [];
        for (i = _i = 0, _ref = $scope.items.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          if ($scope.items[i] && $scope.items[i].HasOwnerAccess) {
            result.push($scope.items[i]);
          }
        }
        return $scope.myActionList = result;
      }
    } else {
      return $scope.myActionList = $scope.items;
    }
  };
  $scope.clearPreviousControls = function() {
    return angular.element($("#gridControls")).empty();
  };
  if ($rootScope.cacheValue) {
    AricMessage.hideAricMessage();
    $rootScope.getActionlist();
    $rootScope.actionPermission();
  }
  PropControlsFix = function() {
    $scope.catControls = [];
    angular.forEach($scope.FinalAction.Category, (function(cat) {
      return $scope.addTextBox(cat);
    }));
    if ($scope.catControls.length === 0) {
      $scope.catControls = [
        {
          Id: 1,
          value: "",
          addCategoryIcon: "true"
        }
      ];
    }
    $scope.fixedPropControls = [];
    angular.forEach($scope.FinalAction.FixedProperties, (function(valueProp, keyProp) {
      return $scope.addFixedPropControls(keyProp, valueProp);
    }));
    angular.forEach($scope.FinalAction.PropertyDefinitions, (function(obj, objKey) {
      if (["", null, void 0].indexOf(obj.Presentation.Type) === -1) {
        return setActionGridControls(obj.Presentation, obj.Presentation.Type, objKey, obj);
      }
    }));
    return angular.forEach($scope.FinalAction.Labels, (function(obj) {
      return setActionGridControls(obj, "Label", "", "");
    }));
  };
  $scope.addFixedPropControls = function(keyText, valText) {
    var count, i, tempRow;
    count = void 0;
    i = void 0;
    tempRow = void 0;
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
  setActionGridControls = function(obj, controlType, objKey, wholeObj) {
    var col, colId, colIndex, colWidth, ick, iter, row, rowId, rowIndex, totalRows;
    col = void 0;
    colId = void 0;
    colIndex = void 0;
    colWidth = void 0;
    ick = void 0;
    iter = void 0;
    row = void 0;
    rowId = void 0;
    rowIndex = void 0;
    totalRows = void 0;
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
    if (["", null, void 0].indexOf($scope.actionGrid[rowIndex]) === -1) {
      if (["", null, void 0].indexOf(objKey) === -1) {
        $scope.actionGrid[rowIndex].value[colIndex].propertyName = objKey;
        $scope.actionGrid[rowIndex].value[colIndex].propertyDescription = objKey;
      }
      $scope.actionGrid[rowIndex].value[colIndex].controlType = controlType;
      $scope.actionGrid[rowIndex].value[colIndex].colNumber = colId;
      $scope.actionGrid[rowIndex].value[colIndex].width = colWidth;
      angular.forEach(ActionBuilderService.action.formTypes, (function(formType) {
        if (formType.value === controlType) {
          $scope.actionGrid[rowIndex].value[colIndex].properties = [];
          return angular.forEach(formType.properties, (function(prop) {
            var abc, isRequired;
            abc = void 0;
            abc = {};
            abc.key = prop.key;
            if (prop.key === "Default text") {
              abc.value = obj.Text;
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
              abc.value = $scope.FinalAction.DefaultProperties[objKey];
            }
            if (prop.key === "Checkbox Title") {
              angular.forEach($scope.FinalAction.PropertyDefinitions[objKey].Source.Fixed.Items, (function(value, keyNew) {
                var oldPropDefListItem;
                oldPropDefListItem = void 0;
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
              if (["", null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Source.Fixed) === -1) {
                angular.forEach($scope.FinalAction.PropertyDefinitions[objKey].Source.Fixed.Items, (function(valueNew, keyNew) {
                  var oldPropDefListItem, value;
                  oldPropDefListItem = void 0;
                  value = void 0;
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
            }
            if (prop.key === "APIGroupId" ? $scope.FinalAction.PropertyDefinitions[objKey].Source.Type === "External" : void 0) {
              abc.value = $scope.FinalAction.PropertyDefinitions[objKey].Source.Execution.APIIntegratorGroupID;
            }
            if (prop.key === "Rules") {
              isRequired = void 0;
              abc.value = [];
              isRequired = false;
              if (["", null, void 0].indexOf($scope.FinalAction.PropertyDefinitions[objKey].Rules) === -1) {
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
      while (ick < colWidth) {
        $scope.actionGrid[rowIndex].value.splice(colIndex + 1, 1);
        ick += 1;
      }
      resetIndex();
      resetColIndex(rowIndex);
    }
  };
  getInputParamsIndex = function(key) {
    var i;
    i = void 0;
    i = 0;
    if ($scope.inputParams) {
      while (i < $scope.inputParams.length) {
        if ($scope.inputParams[i].params === key) {
          break;
        }
        i++;
      }
      return i;
    }
  };
  resetColIndex = function(rowNumber) {
    var i, results;
    i = 0;
    results = [];
    while (i < $scope.actionGrid[rowNumber].value.length) {
      $scope.actionGrid[rowNumber].value[i].colNumber = i + 1;
      results.push(i++);
    }
    return results;
  };
  resetIndex = function() {
    var i, results;
    i = 0;
    results = [];
    while (i < $scope.actionGrid.length) {
      if ($scope.actionGrid[i].id === $scope.selectedCell.row) {
        $scope.selectedCell.row = i + 1;
      }
      $scope.actionGrid[i].id = i + 1;
      results.push(i++);
    }
    return results;
  };
  $scope.addTextBox = function(valtext) {
    var count, tempRow;
    count = void 0;
    tempRow = void 0;
    count = $scope.catControls.length;
    count = count + 1;
    tempRow = {
      Id: count,
      value: valtext,
      addCategoryIcon: "true"
    };
    if ($scope.catControls.length > 0) {
      $scope.catControls[$scope.catControls.length - 1].addCategoryIcon = "false";
    }
    $scope.catControls.push(tempRow);
  };
  $scope.getClass = function(item) {
    var abc;
    abc = void 0;
    abc = {
      width: (item.width * 16) + "%",
      height: (item.height * 80) + "px"
    };
    return abc;
  };
  $scope.cellSelection = function(rowNumber, columnNumber) {
    $scope.selectedCell.row = rowNumber;
    $scope.selectedCell.col = columnNumber;
    return $scope.setControlProperties();
  };
  $scope.setControlProperties = function() {
    var col, row;
    col = void 0;
    row = void 0;
    row = $scope.selectedCell.row - 1;
    col = $scope.selectedCell.col - 1;
    if (["", null, void 0].indexOf($scope.actionGrid[row].value[col].controlType) === -1) {
      $scope.message = $scope.actionGrid[row].value[col].controlType + " : settings ";
      $scope.actionGrid[row].value[col];
    } else {
      $scope.actionGrid[row].value[col].properties = [];
    }
  };
  $scope.getCellClass = function(rowNumber, columnNumber) {
    var abc;
    abc = void 0;
    if (rowNumber === $scope.selectedCell.row && columnNumber === $scope.selectedCell.col) {
      abc = {
        border: "1px solid red",
        background: "white",
        cursor: "pointer",
        verticalAlign: "top"
      };
    } else {
      abc = {
        cursor: "pointer",
        verticalAlign: "top"
      };
    }
    return abc;
  };
  $scope.hasValue = function(item) {
    return ["", null, void 0].indexOf(item) === -1;
  };
  $scope.getCellControl = function(controlName) {
    var controlUrl;
    controlUrl = void 0;
    if (["", null, void 0].indexOf(controlName) === -1) {
      controlUrl = "";
      angular.forEach(ActionBuilderService.action.formTypes, (function(formType) {
        if (formType.value === controlName) {
          return controlUrl = formType.templateURL;
        }
      }));
      $scope.setControlProperties();
      return controlUrl;
    }
  };
  $scope.ShowNext = function() {
    return false;
  };
  $scope.ShowEditbtn = function() {
    if ($scope.actionId !== "") {
      $scope.ShowEdit = true;
    } else {
      $scope.ShowEdit = false;
    }
  };
  $scope.ShowEditbtn();
  $scope.ShowPrev = function() {
    return false;
  };
  $scope.ShowSubmit = function() {
    return false;
  };
  $scope.ShowCreateAction = function() {
    return false;
  };
  $scope.showManageAccessIcon = function() {
    return $rootScope.showManageAccessButton || $rootScope.isAdminUser;
  };
  $scope.ShowDelete = function() {
    return true;
  };
  $scope.edit = function() {
    $location.path("/action/" + $scope.actionId);
  };
  $scope["delete"] = function() {
    $scope.errorMessage = "";
    AricMessage.showDelConfirmationMessage("Are you sure to Delete the Action?", $scope.removeAction, $scope.closeModalPopup);
  };
  $scope.closeModalPopup = function(modalName) {
    AricMessage.hideAricMessage();
    if (modalName) {
      $(modalName).foundation("reveal", "close");
    }
  };
  $scope.searchTextHighlight = function() {
    var actionList, searchStr;
    $scope.validKeywords = [];
    actionList = $('#listAction');
    searchStr = $('#listSearch').val();
    if (searchStr.length > 2) {
      $scope.validKeywords = searchKeywordService.convertToValidKeywords(searchStr);
      $timeout.cancel($scope.highlightPromise);
      $scope.highlightPromise = $timeout((function() {
        var i;
        actionList.removeHighlight();
        i = 0;
        while (i <= $scope.validKeywords.length) {
          actionList.highlight($scope.validKeywords[i]);
          i++;
        }
      }), 250);
    } else {
      actionList.removeHighlight();
    }
  };
  $scope.removeAction = function() {
    $scope.deletepromise = void 0;
    $scope.errorMessage = "";
    $scope.deletepromise = ActionBuilderService.deleteAction($scope.actionId);
    return $scope.deletepromise.then(function(data) {
      if (data.success === true) {
        $scope.hide = false;
        $scope.propertiesList = "false";
        AricMessage.hideAricMessage();
        $scope.promise = ActionBuilderService.getActionList();
        $scope.promise.then(function(data) {
          $scope.searchText.Name = "";
          $scope.items = data.data;
          $scope.hide = true;
          $scope.actionId = "";
        });
      } else {
        return AricMessage.showFailureMessage(data.data.Error, "", false);
      }
    });
  };
  $scope.highlightControl = function(selectedItem) {
    var abc;
    abc = {
      border: "1px solid red",
      background: "white",
      cursor: "pointer",
      verticalAlign: "top"
    };
    angular.forEach($scope.actionGrid, (function(row) {
      angular.forEach(row.value, (function(val) {
        if (val.controlType !== "Label" && val.propertyName === selectedItem.name) {
          $scope.selectedCell.row = row.id;
          $scope.selectedCell.col = val.colNumber;
        }
      }));
    }));
  };
  $scope.addRow = function() {
    var rowCount, tempRow;
    rowCount = void 0;
    tempRow = void 0;
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
    resetIndex();
  };
});

app.filter("escape", function() {
  return window.escape;
});
