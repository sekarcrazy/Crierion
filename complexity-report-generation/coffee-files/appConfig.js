var Tenant;

Tenant = "internal";

window.aric = {};

if (!window.ARIC) {
  window.ARIC = {};
}

if (!ARIC.Directives) {
  ARIC.Directives = {};
}

if (!ARIC.Directives.Config) {
  ARIC.Directives.Config = {};
}

if (!ARIC.Config) {
  ARIC.Config = {};
}

aric.Version = "v3";

aric.AppName = "Action Builder";

aric.Tenant = "internal";

aric.TokenHeaderName = "x-auth-token";

aric.TokenHeaderValue = "AADR4CYXgpiIIJsR_hk8ys9zwTY1NwzV_XERXtUQZcB13xxIF0Ee7Y6rZfxzKc-2xdDpg2JvVLroaOnHmyY2CJK3R4Doo_lntcPXrhyTNsZIsAf2mNwev7jQ";

aric.TokenUserHeaderName = "x-user-name";

aric.baseURI = "/cor-redirect/staging/v1/" + Tenant;

aric.baseURIGroup = "/cor-redirect/staging/v1/" + Tenant;

aric.RoleURL = "/cor-redirect/staging/v1/" + Tenant + "/legacyusersandroles/systemroles";

aric.UserURL = "/cor-redirect/staging/v1/" + Tenant + "/legacyusersandroles/users";

aric.EntityPermissionURL = "/cor-redirect/staging/v1/" + Tenant + "/entitypermissions/";

aric.UserRightsURL = "/cor-redirect/staging/v1/" + Tenant + "/roles";

aric.MatrixPermissionBaseURL = "/cor-redirect/staging/v1/" + Tenant + "/matrixpermissions";

aric.constant = "v1";

aric.APIIntegratorBaseUrl = "/aric/" + aric.Version + "/api-integrator/";

aric.ActionBuilderBaseUrl = "/aric/" + aric.Version + "/action-builder/";

aric.ProcessBuilderBaseUrl = "/aric/" + aric.Version + "/process-builder/";

aric.VariableBuilderBaseUrl = "/aric/" + aric.Version + "/variable-builder/";

aric.MenuAccessURL = "/cor-redirect/staging/v1/" + aric.Tenant + "/menus";

aric.ModuleURL = "/cor-redirect/staging/v1/" + aric.Tenant + "/modulemanagement/checkpermission/AllUserAccess?AccessType=Owner";

ARIC.Directives.Config.APIGroupExecuteURL = "/cor-redirect/staging/v1/internal/apiintegrator/groups/execute/@apiGroupId";

ARIC.Directives.Config.GetApplicationConfigURL = "/cor-redirect/staging/v1/internal/actionproperties/@Name/@Namespace";

ARIC.Config.TestUser = "Guest";
