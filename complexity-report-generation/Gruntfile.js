module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['coffee-files', 'reports/*.*'],
    jsinspect: {
        generate: {
        options: {
            threshold:   300000,
            diff:        true,
            identifiers: false,
            failOnMatch: true,
            suppress:    100000,
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
        cwd: "D:/NIS/New folder/nis-ui-master/src/app/",
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
    karma: {
        unit: {
            configFile:'D:/NIS/New folder/nis-ui-master/generated/build/test/config/unit.js',// 'D:/DEV/codebase/portals/ngap/event-viewer2.5/test/karma.conf.js',//'D:/NIS/nis-ui-master/nis-ui-master/generated/build/test/config/unit.js',//'D:/ngaf_test/test/config/karma.conf.js',
            port: 9999,
            singleRun: true,
            browsers: ['PhantomJS'],
            reporters: ['coverage', 'json'],
            jsonReporter: {
                stdout: true,
                outputFile: 'F:/Project/Criterian_master/complexity-report-generation/reports/testreport.json'
            },
            preprocessors: {
                // 'D:/NIS/nis-ui-master/nis-ui-master/generated/build/src/js/app-coffee.js': ['coverage']
                // 'D:/ngaf_test/inflight-events/js/**/*.js': ['coverage']
                //'D:/DEV/codebase/portals/ngap/event-viewer2.5/src/app/components/**/*.js': ['coverage']
                'D:/NIS/New folder/nis-ui-master/generated/build/src/js/app.js': ['coverage']
            },
            coverageReporter: {
                instrumenterOptions: {
                    istanbul: { noCompact: true }
                },
                dir: 'F:/Project/Criterian_master/complexity-report-generation/reports',
                reporters: [
                  { type: 'html', subdir: 'report-html' },
                  { type: 'json-summary', subdir: 'report-json-summary', file: 'text-summary.json' },
                  { type: 'json', subdir: 'report-json', file: 'testcoverage.json' }
                ]
            },
            logLevel: 'ERROR'
        }
    }
  });
 
 grunt.loadNpmTasks('grunt-contrib-coffee');
 grunt.loadNpmTasks('grunt-contrib-clean');
 grunt.loadNpmTasks('grunt-contrib-concat');
 grunt.loadNpmTasks('grunt-jsinspect');
 grunt.loadNpmTasks("grunt-karma");
 grunt.loadNpmTasks('grunt-istanbul-coverage');
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
 grunt.registerTask('report', 'test report', function () {
     var summaryData = grunt.file.readJSON('reports/report-json-summary/text-summary.json');
     var reportData = grunt.file.readJSON('reports/testreport.json');
     var testReport = { "reportType": "TESTREPORT", "data": {} };
     var data = {};
     var pct = summaryData['total'].statements.pct;
     var getCoverage = function (item) {
         var latestReport;
         for (var key in item) {
             if (item[key].hasOwnProperty('lastResult')) {
                 latestReport = item[key].lastResult;
                 latestReport['pct'] = pct;
             }
         }
         return { 'lastResult': latestReport };
     };
     //statements
     if (reportData.hasOwnProperty('browsers')) {
         var lastResult = getCoverage(reportData.browsers);
         testReport['data'] = lastResult;
     }
     grunt.file.write('reports/testreport.json', JSON.stringify(testReport, null, 2));
 });
 grunt.registerTask('coverage', 'test coverage report', function () {
     var summaryData = grunt.file.readJSON('reports/report-json-summary/text-summary.json');
     var reportData = grunt.file.readJSON('reports/report-json/testcoverage.json');
     var coverageReport = { "reportType": "TESTCOVERAGE", "data": {} };
     var data = {};
     data['summary'] = summaryData['total'];
     delete data['summary'].linesCovered;
     data['report'] = [];
     var getCoverage = function (item) {
         var count = 0, covered = 0;
         for (var key in item) {
             if (item[key] instanceof Array) {
                 count = count + item[key].length;
                 covered = covered + item[key].filter(function (data) { return data > 0; }).length;
             } else {
                 count++;
                 if (item[key] > 0)
                     covered++;
             }
         }
         return { 'count': count, 'covered': covered };
     };
     for (var key in reportData) {
         var statements = getCoverage(reportData[key].s);
         var branches = getCoverage(reportData[key].b);
         var functions = getCoverage(reportData[key].f);
         var lines = getCoverage(reportData[key].l);
         data['report'].push({ 'file': reportData[key].path, 'statements': statements, 'branches': branches, 'functions': functions, 'lines': lines });
     }
     coverageReport['data'] = data;
     grunt.file.write('reports/testcoverage.json', JSON.stringify(coverageReport, null, 2));
 });
  grunt.registerTask('compile-coffee', ['clean', 
  'coffee',
  'customComplexityReport:generate', 
  'jsinspect:generate', 
  'concat', 'karma:unit', 'report', 'coverage']);
  
  grunt.registerTask('compile-js', ['clean',
  'customComplexityReport:generate', 
  'jsinspect:generate', 
  'concat', 'karma:unit', 'report', 'coverage']);
 
};
