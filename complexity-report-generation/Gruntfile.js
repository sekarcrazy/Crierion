module.exports = function(grunt) {
    var args = process.argv;
    console.log(args[2], args[3]);  
    var projectName = args[3];
    var config = require('./Grunt-config.json');

    if(config[projectName])
        {
            grunt.log.write("Project Exists \r\n");
        }
        else
        {
            grunt.log.write("Project Does Not Exists \r\n");
        }
  grunt.initConfig({
    config: grunt.file.readJSON('Grunt-config.json'),
    pkg: grunt.file.readJSON('package.json'),
    clean: ['<%= config.'+projectName+'.output %>/*.*'],
    jsinspect: {
        generate: {
        options: {
            threshold:   30,
            diff:        true,
            identifiers: false,
            failOnMatch: true,
            suppress:    100000,
            reporter:    'json',
            outputPath : '<%= config.'+projectName+'.output %>/duplication.json'
        },
        src: '<%= config.'+projectName+'.src %>'
        }
    },
    coffee: {
      coffee_to_js: {
        options: {
          bare: true
        },
        expand: true,
        flatten: false,
        cwd: '<%= config.'+projectName+'.coffee2Js.cwd %>',
        src: '<%= config.'+projectName+'.src %>',
        dest: '<%= config.'+projectName+'.coffee2Js.jsDest %>',
        ext: ".js"
      }
    },
    
    customComplexityReport: {
        generate:{
            src: '<%= config.'+projectName+'.src %>',
        exclude: '<%= config.'+projectName+'.exclude %>',
        options: {
            breakOnErrors: true,
            format: 'json',
            jsLintXML: '<%= config.'+projectName+'.output %>/report.json',
            checkstyleXML: '<%= config.'+projectName+'.output %>/checkstyle.json',
            pmdXML: '<%= config.'+projectName+'.output %>/pmd.json',
            errorsOnly: false,
            cyclomatic: [3, 7, 12],
            halstead: [8, 13, 20],
            maintainability: 100,
            hideComplexFunctions: false,
            broadcast: false
          }
        }
    },
     'string-replace': {
      dist: {
        src: 'D:/ruby application/aricV3/checkstyle.json',
        dest: 'D:/ruby application/aricV3/loc.json',
        options: {
           replacements: [{
            pattern: /.rb" :/ig,
            replacement: '-rb" :'
          }]
        }
      },
    java: {
        src: 'D:/Criterion/Criterion/complexity-report-generation/java-tasks/loc.json',
        dest: 'D:/Criterion/Criterion/complexity-report-generation/java-tasks/loc.json',
        options: {
           replacements: [{
            pattern: /.java" :/ig,
            replacement: '-java" :'
          }]
        }
      }
    },
    javaReport: {
        generate:{
            src: '<%= config.'+projectName+'.src %>',
        exclude: '<%= config.'+projectName+'.exclude %>',
        }
    },
    concat: {    
        js: {
            src: ['tasks/reporters/JSON/DuplicationJSON/start.json', 
            'reports/duplication.json', 'tasks/reporters/JSON/DuplicationJSON/end.json'],
            dest: '<%= config.'+projectName+'.output %>/duplication.json',
        },
        rubyDuplication: {
            src: ['ruby-tasks/reporters/JSON/DuplicationJSON/start.json', 
            'd:/ruby application/aricV3/duplication.json', 'ruby-tasks/reporters/JSON/DuplicationJSON/end.json'],
            dest: '<%= config.'+projectName+'.output %>/ruby-duplication-code.json',
        },
        rubyLoc:{
            src: ['ruby-tasks/reporters/JSON/LinesJSON/start.json', 
            'd:/ruby application/aricV3/loc.json', 'ruby-tasks/reporters/JSON/LinesJSON/end.json'],
            dest: '<%= config.'+projectName+'.output %>/ruby-lint.json',
        },            
        rubyViolations:{
            src: ['ruby-tasks/reporters/JSON/ViolationsJSON/start.json', 
            'd:/ruby application/aricV3/violations.json', 'ruby-tasks/reporters/JSON/ViolationsJSON/end.json'],
            dest: '<%= config.'+projectName+'.output %>/ruby-violation.json',
         },
         javaLoc:{
            src: ['java-tasks/reporters/JSON/LinesJSON/start.json', 
            'd:/Criterion/Criterion/complexity-report-generation/java-tasks/loc.json', 'java-tasks/reporters/JSON/LinesJSON/end.json'],
            dest: '<%= config.'+projectName+'.output %>/java-loc.json',
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
 
 grunt.loadNpmTasks('grunt-string-replace');
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

 grunt.registerMultiTask('javaReport', 'javareport', function(){
    var parser = require('./tasks/xml-parser.js');
    var xmlparser = new parser(grunt);
    xmlparser.parseViolationJson();
    // xmlparser.parseLocJson();
    xmlparser.parseDuplicationJson();
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
 grunt.registerTask('default', ['string-replace']);
  grunt.registerTask('compile-coffee', ['clean', 
  'coffee',
  'customComplexityReport:generate', 
  'jsinspect:generate', 
  'concat']);
  
  grunt.registerTask('compile-js', ['clean',
  'customComplexityReport:generate',
  'jsinspect:generate', 
  'concat:js']);

  grunt.registerTask('compile-java', ['clean',
  'javaReport',
  'string-replace:java',
  'concat:javaLoc']);
 
  grunt.registerTask('compile-ruby', ['clean',
  'concat:rubyDuplication',
  'concat:rubyLoc',
  'concat:rubyViolations']);
};
