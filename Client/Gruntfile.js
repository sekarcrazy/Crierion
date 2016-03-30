module.exports = function(grunt) {
  var karmaConfig;
  karmaConfig = void 0;
  karmaConfig = function(configFile, customOptions) {
    var options, travisOptions;
    options = void 0;
    travisOptions = void 0;
    options = {
      configFile: configFile,
      keepalive: true
    };
    travisOptions = process.env.TRAVIS && {
      browsers: ['Chrome'],
      reporters: 'dots'
    };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };
  grunt.initConfig({
    config: grunt.file.readJSON('Grunt-config.json'),
    bower: grunt.file.readJSON('bower.json'),
    pkg: grunt.file.readJSON('package.json'),
    clean: ['<%= config.path.dist %>'],
    js2coffee: {
      options: {},
      each: {
        options: {},
        files: [
          {
            expand: true,
            cwd: '<%= config.path.jsSrc %>',
            src: ['**/*.js'],
            dest: '<%= config.path.coffeeDist %>/app/',
            ext: '.coffee'
          }, {
            expand: true,
            cwd: 'test',
            src: ['**/*.js'],
            dest: '<%= config.path.coffeeDist %>/../test/',
            ext: '.coffee'
          }
        ]
      }
    },
    karma: {
      unit: {
        options: karmaConfig('<%= config.path.dist %>/../test/config/unit.js')
      },
      watch: {
        options: karmaConfig('<%= config.path.unitTestConfig %>/unit.js', {
          singleRun: false,
          autoWatch: true
        })
      }
    },
    coffee: {
      src_coffeee: {
        options: {
          sourceMap: false
        },
        files: [
          {
            src: ['<%= config.path.coffeeSrc %>/errorHandler/unhandledError.coffee','<%= config.path.coffeeSrc %>/errorHandler/application-error.coffee', '<%= config.path.coffeeSrc %>/core/core.coffee', '<%= config.path.coffeeSrc %>/global/global.coffee', '<%= config.path.coffeeSrc %>/security/security.coffee', '<%= config.path.coffeeSrc %>/layout/layout.coffee', '<%= config.path.coffeeSrc %>/deviceMaintenance/deviceMaintenance.coffee', '<%= config.path.coffeeSrc %>/cabinet/cabinet.coffee', '<%= config.path.coffeeSrc %>/app.coffee', '<%= config.path.coffeeSrc %>/core/helper/routeHelper.coffee', '<%= config.path.coffeeSrc %>/**/*.coffee', '!<%= config.path.coffeeSrc %>/core/config/appSettings.coffee'],
            dest: '<%= config.path.dist %>/js/app-coffee.js'
          }
        ]
      },
      config_coffeee: {
        options: {
          sourceMap: false
        },
        files: [
          {
            src: ['<%= config.path.coffeeSrc %>/core/config/appSettings.coffee'],
            dest: '<%= config.path.dist %>/config/config.js'
          }
        ]
      },
      unit_coffeee: {
        options: {
          sourceMap: false
        },
        files: [
          {
            src: ['<%= config.path.coffeeSrc %>/../../test/unit/**/*.coffee'],
            dest: '<%= config.path.dist %>/../test/unit/<%= config.destFileName.unitTestSpec %>'
          }
        ]
      },
      unit_config_coffeee: {
        options: {
          sourceMap: false
        },
        files: [
          {
            src: ['<%= config.path.coffeeSrc %>/../../test/config/**/*.coffee'],
            dest: '<%= config.path.dist %>/../test/config/unit.js'
          }
        ]
      }
    },
    concat: {
      nis_ui: {
        src: ['<%= config.path.coffeeSrc %>/errorHandler/unhandledError.js', '<%= config.path.coffeeSrc %>/errorHandler/application-error.js', '<%= config.path.coffeeSrc %>/core/core.js', '<%= config.path.coffeeSrc %>/global/global.js', '<%= config.path.coffeeSrc %>/security/security.js', '<%= config.path.coffeeSrc %>/layout/layout.js', '<%= config.path.coffeeSrc %>/deviceMaintenance/deviceMaintenance.js', '<%= config.path.coffeeSrc %>/cabinet/cabinet.js', '<%= config.path.coffeeSrc %>/app.js', '<%= config.path.coffeeSrc %>/core/helper/routeHelper.js', '<%= config.path.coffeeSrc %>/**/*.js', '!<%= config.path.coffeeSrc %>/core/config/appSettings.js'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.nis_ui_src %>'
      },
      jsLib: {
          src: ['<%= config.path.vendor %>/jquery/jquery.js', '<%= config.path.vendor %>/bootstrap/dist/js/bootstrap.min.js', '<%= config.path.vendor %>/angular/angular.js', '<%= config.path.vendor %>/angular-animate/angular-animate.js', '<%= config.path.vendor %>/angular-sanitize/angular-sanitize.js', '<%= config.path.vendor %>/angular-resource/angular-resource.js', '<%= config.path.vendor %>/angular-route/angular-route.js', '<%= config.path.vendor %>/angular-bootstrap/ui-bootstrap-tpls.js', '<%= config.path.vendor %>/lodash/dist/lodash.compat.js', '<%= config.path.vendor %>/moment/moment.js', '<%= config.path.vendor %>/angular-cookies/angular-cookies.js', '<%= config.path.vendor %>/angular-ui-router/release/angular-ui-router.js', '<%= config.path.vendor %>/angular-ui-grid/ui-grid.js'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.lib %>'
      },
      config: {
          options: {
          sourceMap: false
        },
        files: [
          {
            src: ['<%= config.path.coffeeSrc %>/core/config/appSettings.js'],
            dest: '<%= config.path.dist %>/config/config.js'
          }
        ]
      },
      unit: {
        options: {
          sourceMap: false
        },
        files: [
          {
            src: ['<%= config.path.coffeeSrc %>/../../test/unit/**/*.js'],
            dest: '<%= config.path.dist %>/../test/unit/<%= config.destFileName.unitTestSpec %>'
          }
        ]
      },
      unit_config: {
        options: {
          sourceMap: false
        },
        files: [
          {
            src: ['<%= config.path.coffeeSrc %>/../../test/config/**/*.js'],
            dest: '<%= config.path.dist %>/../test/config/unit.js'
          }
        ]
      },
      css: {
        src: ['src/css/*.css'],
        dest: '<%= config.path.dist %>/css/app.css'
      },
      index: {
        src: ['<%= config.src.indexHtml %>'],
        dest: '<%= config.path.dist %>/index.html',
        options: {
          process: true
        }
      },
      development: {
        src: ['<%= config.path.dist %>/js/app-coffee.js'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.nis_ui_src %>'
      }
    },
    uglify: {
      nis_ui: {
        src: ['<%= config.path.jsSrc %>/errorHandler/unhandledError.js', '<%= config.path.jsSrc %>/errorHandler/application-error.js', '<%= config.path.jsSrc %>/core/core.js', '<%= config.path.jsSrc %>/global/global.js', '<%= config.path.jsSrc %>/security/security.js', '<%= config.path.jsSrc %>/layout/layout.js', '<%= config.path.jsSrc %>/deviceMaintenance/deviceMaintenance.js', '<%= config.path.jsSrc %>/cabinet/cabinet.js', '<%= config.path.jsSrc %>/app.js', '<%= config.path.jsSrc %>/core/helper/routeHelper.js', '<%= config.path.jsSrc %>/**/*.js'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.nis_ui_src %>'
      },
      coffeeJs2min: {
        src: ['<%= config.path.dist %>/js/app-coffee.js'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.nis_ui_src %>'
      },
      jsLib: {
        src: ['<%= config.path.vendor %>/jquery/jquery.js', '<%= config.path.vendor %>/bootstrap/dist/js/bootstrap.min.js', '<%= config.path.vendor %>/angular/angular.js', '<%= config.path.vendor %>/angular-animate/angular-animate.js', '<%= config.path.vendor %>/angular-sanitize/angular-sanitize.js', '<%= config.path.vendor %>/angular-resource/angular-resource.js', '<%= config.path.vendor %>/angular-route/angular-route.js', '<%= config.path.vendor %>/angular-bootstrap/ui-bootstrap-tpls.js', '<%= config.path.vendor %>/lodash/dist/lodash.compat.js', '<%= config.path.vendor %>/moment/moment.js', '<%= config.path.vendor %>/angular-cookies/angular-cookies.js', '<%= config.path.vendor %>/angular-ui-router/release/angular-ui-router.js', '<%= config.path.vendor %>/angular-ui-grid/ui-grid.js'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.lib %>'
      },
      html2js: {
        src: ['<%= config.path.dist %>/js/<%= config.destFileName.jsTemplate %>'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.jsTemplate %>'
      }
    },
    htmlmin: {
      jsSrc: {
        options: {
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.path.jsSrc %>',
            src: ['**/*.tpl.html'],
            dest: '<%= config.path.dist %>/templates'
          }
        ]
      },
      coffeeSrc: {
        options: {
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.path.jsSrc %>',
            src: ['**/*.tpl.html'],
            dest: '<%= config.path.dist %>/templates'
          }
        ]
      }
    },
    coffeelint: {
      all: ['<%= config.path.coffeeDist %>/**/*.coffee'],
      options: {
        'no_trailing_whitespace': {
          'level': 'error'
        }
      }
    },
    html2js: {
      options: {
        rename: function(moduleName) {
          var regExp;
          regExp = void 0;
          regExp = new RegExp('../' + grunt.config.get('config.path.dist') + '/templates');
          moduleName = moduleName.replace(regExp, 'app');
          return moduleName;
        }
      },
      nis_ui: {
        src: ['<%= config.path.dist %>/templates/**/*.tpl.html'],
        dest: '<%= config.path.dist %>/js/<%= config.destFileName.jsTemplate %>'
      }
    },
    imagemin: {
      main: {
        files: [
          {
            expand: true,
            cwd: '<%= config.path.srcImg %>',
            src: ['*.png', '*.svg', '*.ico', '*.gif'],
            dest: '<%= config.path.dist %>/img'
          }
        ]
      }
    },
    fonts: {
      files: [
        {
          expand: true,
          cwd: 'src/fonts',
          src: ['**/*.png', '**/*.svg', '**/*.eot', '**/*.ttf', '**/*.woff', '**/*.otf'],
          dest: '<%= config.path.dist %>/fonts/'
        }
      ]
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: '<%= config.path.vendor %>/bootstrap/dist/css',
            src: ['*.min.css'],
            dest: '<%= config.path.dist %>/css'
          }, {
            expand: true,
            cwd: '<%= config.path.vendor %>/font-awesome/css',
            src: ['*.min.css'],
            dest: '<%= config.path.dist %>/css'
          }, {
            expand: true,
            cwd: '<%= config.path.vendor %>/font-awesome/fonts',
            src: ['*.*'],
            dest: '<%= config.path.dist %>/fonts'
          }, {
            expand: true,
            cwd: '<%= config.path.vendor %>/angular-ui-grid',
            src: ['*.woff', '*.ttf', '*eot'],
            dest: '<%= config.path.dist %>/fonts'
          }, {
            expand: true,
            cwd: '<%= config.path.vendor %>/angular-mocks',
            src: ['*.js'],
            dest: '<%= config.path.dist %>/js'
          },
          {
              expand: true,
              cwd: '<%= config.path.vendor %>/angular-ui-grid',
              src: ['*.min.css'],
              dest: '<%= config.path.dist %>/css'
          }
        ]
      }
    },
    less: {
      production: {
        options: {
          cleancss: false
        },
        files: {
          '<%= config.path.dist %>/css/ui-grid-custom.css': ['ui-grid-custom.css/ui-grid.less']
        }
      }
    },
    production: {
      options: {
        cleancss: false
      },
      files: {
        'public/css/style.css': ['public/less/main.less', 'public/app/**/*.less']
      }
    },
    exec: {
      buildDependencies: {
        command: '<%= config.npmInstallCommand %>'
      },
      bower: {
        command: '<%= config.bowerInstallCommand %>'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-js2coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('jsToCoffee', ['clean',
        'js2coffee', 'coffee:src_coffeee', 'coffee:unit_config_coffeee']);
  grunt.registerTask('local', ['clean', 'concat:nis_ui','concat:jsLib', 'concat:config', 'concat:unit', 'concat:unit_config', 'concat:css', 'concat:index', 'copy', 'htmlmin:jsSrc', 'html2js:nis_ui', 'imagemin']);
  grunt.registerTask('default', ['clean', 'js2coffee', 'concat', 'copy', 'htmlmin:jsSrc', 'html2js:nis_ui', 'imagemin', 'coffee', 'karma:unit']);
  grunt.registerTask('build', ['clean', 'coffee', 'concat:jsLib', 'concat:css', 'concat:index', 'concat:development', 'copy', 'htmlmin:coffeeSrc', 'html2js:nis_ui', 'imagemin', 'karma:unit']);
  grunt.registerTask('production', ['clean', 'coffee', 'concat:jsLib', 'concat:css', 'concat:index', 'copy', 'htmlmin:coffeeSrc', 'html2js:nis_ui', 'imagemin', 'uglify:coffeeJs2min', 'uglify:jsLib', 'uglify:html2js', 'karma:unit']);
  grunt.registerTask('unit', ['karma:unit']);
};