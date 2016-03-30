module.exports = function(grunt, JSONReporter) {
	var pmdReporter = function(filenames, options) {
		this.init(options, 'pmdXML', __dirname);
        this.reportType = "PMD";
	};
	pmdReporter.prototype = new JSONReporter();	
	pmdReporter.prototype.formatJSON = function(data){
		var fileInfo = {}
		fileInfo.file ={name: data.filepath, violations:[]};
                  for(var i =0, j=data.complexFunctions.length;i<j;i++)
                  {
                        var violation = {}, info = data.complexFunctions[i];
                        violation.beginline = info.line;
                        violation.class=info.filepath;
                        violation.method=info.name;
                        violation.priority=info.severity;
                        violation.rule="ComplexityViolation";
                        violation.complexityCyclomatic=info.complexity.cyclomatic;
                        violation.message = "The Complexity is too high. The value is " + info.complexity.cyclomatic;                        
                        fileInfo.file.violations.push(violation);
                  }
		return fileInfo;
	}
	
	return pmdReporter;
};
