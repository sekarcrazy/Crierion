module.exports = function(grunt, JSONReporter) {
	var JSLintJSONReporter = function(filenames, options) {
		this.init(options, 'jsLintXML', __dirname);
        this.reportType = "JSLINT";
	};
    
	JSLintJSONReporter.prototype = new JSONReporter();
      
	JSLintJSONReporter.prototype.formatJSON = function(data){
		var fileInfo = {}
		fileInfo.file ={name: data.filepath, issues:[]};
                  for(var i =0, j=data.complexFunctions.length;i<j;i++)
                  {
                        var issue = {}, info = data.complexFunctions[i];
                        issue.line = info.line;
                        issue.char = data.escape(info.name);
                        issue.evidence= data.escape(info.name) + " is too complicated";
                        issue.severity = info.severity;
                        issue.reason="Cyclomatic: " + info.complexity.cyclomatic;
                        issue.Halstead = info.complexity.halstead.difficulty.toPrecision(5);
                        issue.Effort = info.complexity.halstead.effort.toPrecision(5);
                        issue.Vocabulary = info.complexity.halstead.vocabulary;
                        issue.volume = info.complexity.halstead.volume.toPrecision(5);                        
                        fileInfo.file.issues.push(issue);
                  }
		return fileInfo;
	}
	
	return JSLintJSONReporter;
};
