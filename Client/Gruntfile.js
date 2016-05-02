module.exports = function (grunt) {
   grunt.initConfig({
       config: grunt.file.readJSON('Grunt-config.json'),
       pkg: grunt.file.readJSON('package.json'),  
       clean: ['<%= config.path.dist %>'],     
       concat: {
           dist: {
               options: {
                   separator: ';'
               },
               files: {
                '<%= config.path.dist %>/js/<%= config.destFileName.metrics_ui_src %>' : ['<%= config.path.coffeeSrc %>/errorHandler/unhandledError.js', '<%= config.path.coffeeSrc %>/errorHandler/application-error.js', '<%= config.path.coffeeSrc %>/exception-directive.js', '<%= config.path.coffeeSrc %>/exception.js', '<%= config.path.coffeeSrc %>/exceptionService.js', '<%= config.path.coffeeSrc %>/core/core.js', '<%= config.path.coffeeSrc %>/core/config/appConfig.js', '<%= config.path.coffeeSrc %>/core/logger/loggerService.js', '<%= config.path.coffeeSrc %>/core/config/config.js',  '<%= config.path.coffeeSrc %>/core/interceptor/httpInterceptor.js', '<%= config.path.coffeeSrc %>/core/interceptor/authTokenInterceptor.js', '<%= config.path.coffeeSrc %>/core/helper/angular-ui-routeruteHelper.js', '<%= config.path.coffeeSrc %>/core/helper/constantHelper.js', '<%= config.path.coffeeSrc %>/global/global.js', '<%= config.path.coffeeSrc %>/global/service/modelService.js','<%= config.path.coffeeSrc %>/global/directive/overlay.js','<%= config.path.coffeeSrc %>/global/directive/checkbox-list.js','<%= config.path.coffeeSrc %>/global/directive/customPopup.js','<%= config.path.coffeeSrc %>/global/errorConstant.js','<%= config.path.coffeeSrc %>/global/constant.js','<%= config.path.coffeeSrc %>/global/global-config-route.js','<%= config.path.coffeeSrc %>/global/utility.js', '<%= config.path.coffeeSrc %>/security/security.js', '<%= config.path.coffeeSrc %>/security/securityApiService.js', '<%= config.path.coffeeSrc %>/security/security-privilege.js', '<%= config.path.coffeeSrc %>/security/securityProvider.js', '<%= config.path.coffeeSrc %>/security/security-routePermission.js', '<%= config.path.coffeeSrc %>/layout/layout.js', '<%= config.path.coffeeSrc %>/layout/controller/shellCtrl.js', '<%= config.path.coffeeSrc %>/layout/directive/layout.directive.js', '<%= config.path.coffeeSrc %>/layout/services/metadata.js', '<%= config.path.coffeeSrc %>/dashboard/dashboard.js', '<%= config.path.coffeeSrc %>/dashboard/dashboard-config-route.js', '<%= config.path.coffeeSrc %>/dashboard/controller/dashboard.js', '<%= config.path.coffeeSrc %>/dashboard/controller/details.js', '<%= config.path.coffeeSrc %>/dashboard/services/dashboard-service.js', '<%= config.path.coffeeSrc %>/details/details.js', '<%= config.path.coffeeSrc %>/details/details-config-route.js', '<%= config.path.coffeeSrc %>/details/controller/duplicationCodeDetailsCtrl.js', '<%= config.path.coffeeSrc %>/details/controller/issueCodeDetailsCtrl.js', '<%= config.path.coffeeSrc %>/details/controller/duplicatedByModalCtrl.js', '<%= config.path.coffeeSrc %>/details/services/details-service.js', '<%= config.path.coffeeSrc %>/shared/shared.js', '<%= config.path.coffeeSrc %>/shared/services/shared-resources.js', '<%= config.path.coffeeSrc %>/deviceMaintenance/deviceMaintenance.js', '<%= config.path.coffeeSrc %>/cabinet/cabinet.js', '<%= config.path.coffeeSrc %>/app.js', '<%= config.path.coffeeSrc %>/**/*.js', '!<%= config.path.coffeeSrc %>/core/config/appSettings.js'],
                '<%= config.path.dist %>/js/<%= config.destFileName.lib %>': ['<%= config.path.vendor %>/jquery/dist/jquery.js', '<%= config.path.vendor %>/jquery-slimscroll/jquery.slimscroll.min.js', '<%= config.path.vendor %>/bootstrap/dist/js/bootstrap.min.js', '<%= config.path.vendor %>/angular/angular.js', '<%= config.path.vendor %>/d3/d3.js', '<%= config.path.vendor %>/nvd3/build/nv.d3.js', '<%= config.path.vendor %>/angular-nvd3/dist/angular-nvd3.js', '<%= config.path.vendor %>/angular-animate/angular-animate.js', '<%= config.path.vendor %>/angular-sanitize/angular-sanitize.js', '<%= config.path.vendor %>/angular-resource/angular-resource.js', '<%= config.path.vendor %>/angular-route/angular-route.js', '<%= config.path.vendor %>/angular-bootstrap/ui-bootstrap-tpls.js', '<%= config.path.vendor %>/lodash/dist/lodash.compat.js', '<%= config.path.vendor %>/moment/moment.js', '<%= config.path.vendor %>/angular-cookies/angular-cookies.js', '<%= config.path.vendor %>/angular-ui-router/release/angular-ui-router.js', '<%= config.path.vendor %>/angular-ui-grid/ui-grid.js']
               }
           }
       },
       html2js: {
      options: {
        rename: function(templates_metrics_ui) {
          var regExp;
          regExp = void 0;
          regExp = new RegExp('../' + grunt.config.get('config.path.dist') + '/templates');
          templates_metrics_ui = templates_metrics_ui.replace(regExp, 'app');
          return templates_metrics_ui;
        }
      },
      metrics_ui: {
        src: ['<%= config.path.htmlSrc %>/dashboard/templates/*.tpl.html', '<%= config.path.htmlSrc %>/details/templates/*.tpl.html', '<%= config.path.htmlSrc %>/errorHandler/*.tpl.html', '<%= config.path.htmlSrc %>/global/templates/*.tpl.html', '<%= config.path.htmlSrc %>/layout/templates/*.tpl.html'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.jsTemplate %>'
      }
    }
   });
 
   grunt.registerTask('default', ['clean', 'concat', 'html2js']);
   grunt.loadNpmTasks("grunt-contrib-clean");
   grunt.loadNpmTasks("grunt-contrib-concat");
   grunt.loadNpmTasks('grunt-html2js');   
};