module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['coffee-files', 'reports/*.*'],
    jsinspect: {
        generate: {
        options: {
            threshold:   30,
            diff:        true,
            identifiers: false,
            failOnMatch: true,
            suppress:    100,
            reporter:    'json',
            outputPath : 'reports/duplication.json'
        },
        src: ['coffee-files/**/*.js']
        }
    },
    coffee: {
      coffee_to_js: {
        options: {
          bare: true
        },
        expand: true,
        flatten: false,
        cwd: "D:/Accion/Metrics/Aric/codebase/portals/ngap/action-builder/src/coffee",
        src: ["**/*.coffee"],
        dest: 'coffee-files',
        ext: ".js"
      }
    },
    customComplexityReport: {
        generate:{
        src: ['coffee-files/**/*.js'],
        exclude: ['generated/build/src/lib.js'],
        options: {
            breakOnErrors: true,
            format: 'json',
            jsLintXML: 'reports/report.json',
            checkstyleXML: 'reports/checkstyle.json',
            pmdXML: 'reports/pmd.json',
            errorsOnly: false,
            cyclomatic: [3, 7, 12],
            halstead: [8, 13, 20],
            maintainability: 100,
            hideComplexFunctions: false,
            broadcast: false
          }
        }
    },
    concat: {    
        dist: {
            src: ['tasks/reporters/JSON/DuplicationJSON/start.json', 
            'reports/duplication.json', 'tasks/reporters/JSON/DuplicationJSON/end.json'],
            dest: 'reports/duplication.json',
        }
        },
  });
 
 grunt.loadNpmTasks('grunt-contrib-coffee');
 grunt.loadNpmTasks('grunt-contrib-clean');
 grunt.loadNpmTasks('grunt-contrib-concat');
 grunt.loadNpmTasks('grunt-jsinspect');
 
 grunt.registerMultiTask('customComplexityReport', 'complexreport', function(){
    //This file is created from grunt complexity as we dont have an option to have json file.
    //var timeoutId = setTimeout(function() {
        //clearTimeout(timeoutId);
        var complexity = require('./tasks/complexity.js');
        var Complexity = new complexity(grunt, this.options());
        
        grunt.log.write('Loaded dependencies...').ok();
        var files = this.filesSrc,
                excludedFiles = this.data.exclude;

            // Exclude any unwanted files from 'files' array
            if (excludedFiles) {
                grunt.file.expand(excludedFiles).forEach(function (e) { files.splice(files.indexOf(e), 1); });
            }   
        
        
            // Set defaults
            var options = Complexity.normalizeOptions(this.options(Complexity.defaultOptions));

            var reporter = Complexity.buildReporter(files, options);

            Complexity.analyze(reporter, files, options);

            return options.breakOnErrors === false || this.errorCount === 0;
    //}, 5000);
    
  });
   
  grunt.registerTask('compile-coffee', ['clean', 
  'coffee',
  'customComplexityReport:generate', 
  'jsinspect:generate', 
  'concat']);
  
  grunt.registerTask('compile-js', ['clean',
  'customComplexityReport:generate', 
  'jsinspect:generate', 
  'concat']);
  
};
