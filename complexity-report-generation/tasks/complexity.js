/*global module:false*/
var cr = require('complexity-report');

module.exports = function(grunt, options) {

	var format = (options && options.format) || "xml";
	var MultiReporter = require('./reporters/multi')(grunt);
	var ConsoleReporter = require('./reporters/Console')(grunt);
	var Reporter = format == "json" && require('./reporters/JSON')(grunt) || require('./reporters/XML')(grunt);
	var JSLintReporter =  (format == "json" && require('./reporters/JSON/JSLintJSON')(grunt, Reporter) || require('./reporters/JSLintXML')(grunt, Reporter));
	var checkstyleReporter = (format == "json" && require('./reporters/JSON/CheckstyleJSON')(grunt, Reporter) || require('./reporters/CheckstyleXML')(grunt, Reporter));
	var pmdReporter = (format == "json" && require('./reporters/JSON/PmdJSON')(grunt, Reporter) || require('./reporters/PmdXML')(grunt, Reporter));

	var Complexity = {

		defaultOptions: {
			breakOnErrors: true,
			errorsOnly: false,
			cyclomatic: [3, 7, 12],
			halstead: [8, 13, 20],
			maintainability: 100,
			hideComplexFunctions: false
		},

		normalizeOptions: function(options) {
			// Handle backward compatibility of thresholds
			if (options.cyclomatic instanceof Array === false) {
				options.cyclomatic = [
					options.cyclomatic
				];
			}

			if (options.halstead instanceof Array === false) {
				options.halstead = [
					options.halstead
				];
			}

			return options;
		},

		buildReporter: function(files, options) {
			var reporter = new MultiReporter(files, options);
			//reporter.addReporter(ConsoleReporter);

			if (options.jsLintXML) {
				reporter.addReporter(JSLintReporter);
			}

			if (options.checkstyleXML) {
				reporter.addReporter(checkstyleReporter);
			}

			if (options.pmdXML) {
				reporter.addReporter(pmdReporter);
			}

			if (options.broadcast && options.broadcast === true) {
				var eventReporter = require('./reporters/event-reporter')(grunt);
				reporter.addReporter(eventReporter);
			}

			return reporter;
		},

		isComplicated: function(data, options) {
			var complicated = false;

			if (data.complexity.cyclomatic > options.cyclomatic[0]) {
				complicated = true;
			}

			if (data.complexity.halstead.difficulty > options.halstead[0]) {
				complicated = true;
			}

			return complicated;
		},

		isMaintainable: function(data, options) {
			var expected = options.maintainability;
			var actual = data.maintainability;

			return expected <= actual;
		},

		assignSeverity: function(data, options) {
			var levels = [
				'info',
				'warning',
				'error'
			];

			if (options.cyclomatic.length === 1 && options.halstead.length === 1) {
				// backward compatibility here: any issue will raise a warning
				if (data.complexity.cyclomatic > options.cyclomatic[0] || data.complexity.halstead.difficulty > options.halstead[0]) {
					data.severity = 'warning';
				}
			} else {
				levels.forEach(function(level, i) {
					if (data.complexity.cyclomatic > options.cyclomatic[i] || data.complexity.halstead.difficulty > options.halstead[i]) {
						data.severity = levels[i];
					}
				});
			}

			return data;
		},

		reportComplexity: function(reporter, analysis, filepath, options) {
			var complicatedFunctions = [];

			if (options.hideComplexFunctions !== true) {
				complicatedFunctions = analysis.functions.filter(function(data) {
					return this.isComplicated(data, options);
				}, this).map(function(data) {
					return this.assignSeverity(data, options);
				}, this);
			}

			grunt.fail.errorcount += complicatedFunctions.length;

			reporter.complexity(filepath, complicatedFunctions, analysis);

		},

		reportMaintainability: function(reporter, analysis, filepath, options) {
			var valid = this.isMaintainable(analysis, options);

			if (!options.errorsOnly || !valid) {
				reporter.maintainability(filepath, valid, analysis);
			}

			if (!valid) {
				grunt.fail.errorcount++;
			}
		},

		analyze: function(reporter, files, options) {
			reporter.start();

			files.map(function(filepath) {
				var content = grunt.file.read(filepath), path = filepath,
                formattedPath = (options.pathFormatter && options.pathFormatter(path)) || filepath; 
                formattedPath = formattedPath || filepath;
				return {
					filepath: formattedPath,
					analysis: cr.run(content, options)
				};
			}).sort(function (info1, info2) {
				return info1.analysis.maintainability - info2.analysis.maintainability;
			}).forEach(function (info) {
				this.reportMaintainability(reporter, info.analysis, info.filepath, options);
				this.reportComplexity(reporter, info.analysis, info.filepath, options);
			}, this);

			reporter.finish();
			console.log("Files are generated successfully.");
		}
	};

	return Complexity;

};
