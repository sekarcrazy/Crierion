module.exports = function(grunt) {

	var JSONReporter = function() {};
	var fs = require('fs-extra'),
			path = require('path');

	JSONReporter.prototype = {
		iteration:0,
		init: function(options, fileKey, dirname) {
			this.options = options;
			this.jsonFilename = options[fileKey];

			if(!this.jsonFilename) {
				throw new Error('Output filename not provided!');
			}

			this.dirname = dirname;

			var outputDir = path.dirname(this.jsonFilename);

			if (outputDir !== '') {
				fs.mkdirpSync(outputDir);
			}

			fs.writeFileSync(this.jsonFilename, '');
		},

		escape: function(message) {
			return message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},

		write: function(message) {
			fs.appendFileSync(this.jsonFilename, message);
		},

		complexity: function(filepath, complexFunctions, analysis) {
			if(this.iteration)
			{
				this.write(",");
			}
			var escape = this.escape;
			this.iteration += 1;
			var message = this.formatJSON({
						filepath: filepath,
						escape: escape,
						complexFunctions: complexFunctions
					});
			var aggregate ={sloc:analysis.aggregate.complexity.sloc, 
			cyclomatic:analysis.aggregate.complexity.cyclomatic,
			cyclomaticDensity:analysis.aggregate.complexity.cyclomaticDensity,
            totalFunction:analysis.functions.length
            };			
			message.file.aggregate = aggregate;
			message = JSON.stringify(message, undefined, 4);
			this.write(message);
		},

		maintainability: function(filepath, valid, analysis) {
			// Maintainability is not written at all
		},

		start: function(analysis) {
			this.write("{ \"reportType\": \""+ this.reportType + "\" , \"data\": [");
		},

		finish: function(analysis) {
			this.write("]}");
		}
	};

	return JSONReporter;
};
