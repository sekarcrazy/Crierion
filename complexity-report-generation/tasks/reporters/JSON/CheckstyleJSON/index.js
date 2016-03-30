module.exports = function(grunt, JSONReporter) {
	var checkstyleReporter = function(filenames, options) {
		this.init(options, 'checkstyleXML', __dirname);
        this.reportType = "CHECKSTYLE";
	};
	checkstyleReporter.prototype = new JSONReporter();
	
	checkstyleReporter.prototype.formatJSON = function(data){
		var fileInfo = {};
		fileInfo.file ={name: data.filepath, errors:[]};
                  for(var i =0, j=data.complexFunctions.length;i<j;i++)
                  {
                        var error = {}, info = data.complexFunctions[i];
                        error.line = info.line;
                        error.severity = info.severity;
                        error.message="Cyclomatic: " + info.complexity.cyclomatic;
                        error.Halstead = info.complexity.halstead.difficulty.toPrecision(5);
                        error.Effort = info.complexity.halstead.effort.toPrecision(5);
                        error.Vocabulary = info.complexity.halstead.vocabulary;
                        error.volume = info.complexity.halstead.volume.toPrecision(5);
                        error.source = data.escape(info.name);
                        fileInfo.file.errors.push(error);
                  }
		return fileInfo;
	}
	
	return checkstyleReporter;
};
