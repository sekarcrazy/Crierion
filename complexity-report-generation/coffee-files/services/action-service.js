"use strict";
angular.module('asweb.services').service('ActionBuilderService', function($rootScope, $http, $q, GenericUtilities) {
  var TokenHeaderName, TokenHeaderValue, action, endValue, service;
  TokenHeaderName = aric.TokenHeaderName;
  TokenHeaderValue = aric.TokenHeaderValue;
  endValue = "/callingapp/actionbuilder";
  action = {
    formTypes: [
      {
        name: "label",
        displayname: "Label",
        value: "Label",
        icon: "fa fa-file-text",
        templateURL: "partials//field/label.html",
        properties: [
          {
            key: "Default text",
            value: "Default text"
          }
        ]
      }, {
        name: "textbox",
        displayname: "Textbox",
        value: "Textbox",
        icon: "fa fa-file-text",
        templateURL: "partials//field/textfield.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Preview text",
            value: ""
          }, {
            key: "Description",
            value: ""
          }, {
            key: "Rules",
            value: [
              {
                Name: "",
                Event: ""
              }
            ]
          }
        ]
      }, {
        name: "textarea",
        value: "Textarea",
        displayname: "Textarea",
        icon: "fa fa-file-text",
        templateURL: "partials//field/textarea.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Preview text",
            value: ""
          }, {
            key: "Description",
            value: ""
          }, {
            key: "Rules",
            value: [
              {
                Name: "",
                Event: ""
              }
            ]
          }
        ]
      }, {
        name: "password",
        value: "Password",
        displayname: "Password",
        icon: "fa fa-file-text",
        templateURL: "partials//field/password.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Preview text",
            value: ""
          }, {
            key: "Description",
            value: ""
          }
        ]
      }, {
        name: "dropdown",
        value: "Dropdown List",
        displayname: "Dropdown List",
        icon: "fa fa-list",
        templateURL: "partials//field/dropdown.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Preview text",
            value: ""
          }, {
            key: "Description",
            value: ""
          }, {
            key: "Source Type",
            value: ""
          }, {
            key: "List Item",
            value: [
              {
                text: "",
                value: ""
              }
            ]
          }, {
            key: "APIGroupId",
            value: ""
          }, {
            key: "Rules",
            value: [
              {
                Name: "",
                Event: ""
              }
            ]
          }
        ]
      }, {
        name: "checkbox",
        value: "Checkbox",
        displayname: "Checkbox",
        icon: "fa fa-check-square-o",
        templateURL: "partials//field/checkbox.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Checkbox Title",
            value: ""
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Description",
            value: ""
          }, {
            key: "Rules",
            value: [
              {
                Name: "",
                Event: ""
              }
            ]
          }
        ]
      }, {
        name: "checkboxlisthorizontal",
        value: "Checkbox List Horizontal",
        displayname: "Checkbox List Horizontal",
        icon: "fa fa-check-square-o",
        templateURL: "partials//field/checkboxlisthorizontal.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Description",
            value: ""
          }, {
            key: "Source Type",
            value: ""
          }, {
            key: "List Item",
            value: [
              {
                text: "",
                value: ""
              }, {
                text: "",
                value: ""
              }
            ]
          }, {
            key: "APIGroupId",
            value: ""
          }, {
            key: "Rules",
            value: [
              {
                Name: "",
                Event: ""
              }
            ]
          }, {
            key: "APIOutput",
            value: [
              {
                text: "",
                value: ""
              }, {
                text: "",
                value: ""
              }
            ]
          }
        ]
      }, {
        name: "checkboxlistvertical",
        value: "Checkbox List Vertical",
        displayname: "Checkbox List Vertical",
        icon: "fa fa-check-square-o",
        templateURL: "partials//field/checkboxlistvertical.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Description",
            value: ""
          }, {
            key: "Source Type",
            value: ""
          }, {
            key: "List Item",
            value: [
              {
                text: "",
                value: ""
              }, {
                text: "",
                value: ""
              }
            ]
          }, {
            key: "APIGroupId",
            value: ""
          }, {
            key: "Rules",
            value: [
              {
                Name: "",
                Event: ""
              }
            ]
          }, {
            key: "APIOutput",
            value: [
              {
                text: "",
                value: ""
              }, {
                text: "",
                value: ""
              }
            ]
          }
        ]
      }, {
        name: "radiolisthorizontal",
        value: "Radio Button List Horizontal",
        displayname: "Radio Button List Horizontal",
        icon: "fa fa-dot-circle-o",
        templateURL: "partials//field/radiolisthorizontal.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Description",
            value: ""
          }, {
            key: "Source Type",
            value: ""
          }, {
            key: "List Item",
            value: [
              {
                text: "",
                value: ""
              }, {
                text: "",
                value: ""
              }
            ]
          }, {
            key: "APIGroupId",
            value: ""
          }, {
            key: "Rules",
            value: [
              {
                Name: "",
                Event: ""
              }
            ]
          }, {
            key: "APIOutput",
            value: [
              {
                text: "",
                value: ""
              }, {
                text: "",
                value: ""
              }
            ]
          }
        ]
      }, {
        name: "radiolistvertical",
        value: "Radio Button List Vertical",
        displayname: "Radio Button List Vertical",
        icon: "fa fa-dot-circle-o",
        templateURL: "partials//field/radiolistvertical.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }, {
            key: "Description",
            value: ""
          }, {
            key: "Source Type",
            value: ""
          }, {
            key: "List Item",
            value: [
              {
                text: "",
                value: ""
              }, {
                text: "",
                value: ""
              }
            ]
          }, {
            key: "APIGroupId",
            value: ""
          }, {
            key: "Rules",
            value: [
              {
                Name: "",
                Event: ""
              }
            ]
          }, {
            key: "APIOutput",
            value: [
              {
                text: "",
                value: ""
              }, {
                text: "",
                value: ""
              }
            ]
          }
        ]
      }, {
        name: "keyvaluepair",
        value: "KeyValuePair",
        displayname: "Key Value Pair",
        icon: "fa fa-th-list",
        templateURL: "partials//field/dictionarylist.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }
        ]
      }, {
        name: "dictionarylist",
        value: "dictionarylist",
        displayname: "Dictionary List",
        icon: "fa fa-th-list",
        templateURL: "partials//field/dictionarylist.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: ""
          }
        ]
      }, {
        name: "singledeviceselection",
        value: "singledeviceselection",
        displayname: "Single Device Selection",
        icon: "fa fa-building-o",
        templateURL: "partials//field/multiselectsearchabledropdown.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: "{\"id\":\"$[DeviceID]\",\"name\":\"Event Device\",\"urn\":\"$[DeviceURN]\"}"
          }
        ]
      }, {
        name: "multipledeviceselection",
        value: "multipledeviceselection",
        displayname: "Multi Device Selection",
        icon: "fa fa-building-o",
        templateURL: "partials//field/multiselectsearchabledropdown.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: "{\"id\":\"$[DeviceID]\",\"name\":\"Event Device\",\"urn\":\"$[DeviceURN]\"}"
          }
        ]
      }, {
        name: "ticketcontrol",
        value: "ticketcontrol",
        displayname: "Ticket Control",
        icon: "fa fa-building-o",
        templateURL: "partials//field/ticketcontrol.html",
        properties: [
          {
            key: "Property Name",
            value: ""
          }, {
            key: "Required",
            value: false
          }, {
            key: "Default value",
            value: "{\"TicketType\":\"Process Ticket\",\"TicketNumber\":\"$[TicketVariable:TicketNumber:Last Ticket - New in Process:1]\"}"
          }
        ]
      }
    ],
    newRow: {
      bIsUsed: false,
      id: 1,
      value: [
        {
          colNumber: 1,
          width: 1,
          height: 1,
          controlType: "",
          propertyName: "",
          propertyDescription: ""
        }, {
          colNumber: 2,
          width: 1,
          height: 1,
          controlType: "",
          propertyName: "",
          propertyDescription: ""
        }, {
          colNumber: 3,
          width: 1,
          height: 1,
          controlType: "",
          propertyName: "",
          propertyDescription: ""
        }, {
          colNumber: 4,
          width: 1,
          height: 1,
          controlType: "",
          propertyName: "",
          propertyDescription: ""
        }, {
          colNumber: 5,
          width: 1,
          height: 1,
          controlType: "",
          propertyName: "",
          propertyDescription: ""
        }, {
          colNumber: 6,
          width: 1,
          height: 1,
          controlType: "",
          propertyName: "",
          propertyDescription: ""
        }
      ]
    },
    grid: [
      {
        bIsUsed: false,
        id: 1,
        value: [
          {
            colNumber: 1,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 2,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 3,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 4,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 5,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 6,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }
        ]
      }, {
        bIsUsed: false,
        id: 2,
        value: [
          {
            colNumber: 1,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 2,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 3,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 4,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 5,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 6,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }
        ]
      }, {
        bIsUsed: false,
        id: 3,
        value: [
          {
            colNumber: 1,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 2,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 3,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 4,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 5,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 6,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }
        ]
      }, {
        bIsUsed: false,
        id: 4,
        value: [
          {
            colNumber: 1,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 2,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 3,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 4,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 5,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 6,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }
        ]
      }, {
        bIsUsed: false,
        id: 5,
        value: [
          {
            colNumber: 1,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 2,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 3,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 4,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 5,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }, {
            colNumber: 6,
            width: 1,
            height: 1,
            controlType: "",
            propertyName: "",
            propertyDescription: ""
          }
        ]
      }
    ]
  };
  return service = {
    getActionDetails: function(actionID) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURI + "/actions/" + actionID + endValue;
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
    getActionList: function(data) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURI + "/actions/get/?PageSize=5000&&Sort=asc";
      $http.defaults.headers.common[TokenHeaderName] = GenericUtilities.getAuthToken();
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
    deleteAction: function(actionID) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURI + "/actions/" + actionID;
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
    },
    updateAction: function(data, id) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURI + "/actions/" + id;
      $http.defaults.headers.common[TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.put(url, data).success(function(data, status, headers, config) {
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
    },
    saveAction: function(data) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURI + "/actions";
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
    },
    getApiGroupInputs: function(groupID) {
      var configkeys, deferred, url;
      configkeys = [];
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURIGroup + "/apiintegrator/groups/" + groupID + "/callingapp/actionbuilder/";
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
    getApiOutputs: function(apiID) {
      var configkeys, deferred, url;
      configkeys = [];
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURIGroup + "/apiintegrator/apis/" + apiID;
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
    executeAPIGroup: function(groupID) {
      var data, deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURIGroup + "/apiintegrator/groups/execute/internal/" + groupID;
      data = new Object();
      data["InputParams"] = new Object();
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
    },
    checkMatrixPermission: function(data) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.MatrixPermissionBaseURL + "/check";
      $http.defaults.headers.common[TokenHeaderName] = GenericUtilities.getAuthToken();
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
    GetAllAPIGroups: function(tenant, data) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURIGroup + "/apiintegrator/groups/get/?PageSize=1500&&Sort=asc";
      $http.defaults.headers.common[TokenHeaderName] = GenericUtilities.getAuthToken();
      $http.post(url, data).success(function(data, status, headers, config) {
        return deferred.resolve({
          success: true,
          data: data.ResultSet.ResultSet,
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
    workingGrid: [],
    action: JSON.parse(JSON.stringify(action)),
    defaultAction: JSON.parse(JSON.stringify(action)),
    GetActionCategory: function(tenantID) {
      var deferred, url;
      deferred = void 0;
      deferred = $q.defer();
      url = aric.baseURI + "/actions/categories";
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
    }
  };
});
