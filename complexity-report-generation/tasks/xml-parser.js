var xml2js = require('xml2js'),
 fs = require('fs'),
 parser = require('xml2json');

 var violationPath = './java-tasks/violations.xml';
 var locPath = './java-tasks/loc.xml';
 var duplicationPath = './java-tasks/duplication.xml';


module.exports = function(grunt) {
var xmlToJsonParser = {

  parseXmlToJson: function(filePath){
          var xmlToJson = fs.readFileSync(filePath, 'utf8');
          return parser.toJson(xmlToJson);
  }, 

  parseViolationJson: function(){
    var violationJson =   this.parseXmlToJson(violationPath);
        var violationReport = {
              reportType : "JAVA-PMD",
              data : []
          };
          violationReport.data.push({'file':JSON.parse(violationJson).pmd.file});
        var fileLength = violationReport.data[0].file.length;
        for(var j = 0; j < fileLength; j++)
        {
        var report = violationReport.data[0].file[j].violation;
        for(var i = 0;  i < report.length;  i++)
          {
            var priorityCount = report[i]['priority'];
            report[i].complexityCyclomatic = priorityCount;
            report[i].msg = report[i]['$t'];

            if(priorityCount < 2){
             report[i]['priority'] = 'info';
          }else if(priorityCount >= 2 && priorityCount < 4){
            report[i]['priority'] = 'warning';
          }else if(priorityCount >= 4){
            report[i]['priority'] = 'error';
          }
          delete report[i].$t;
        }
      }
        fs.writeFileSync('./java-reports/java-violation.json', JSON.stringify(violationReport));
  },  

  /*parseLocJson: function(){
      var locJson = this.parseXmlToJson(locPath);
      var locReport = {
          reportType : "JAVA-LOC",
      data : []
      };
      locReport.data.push({'file':JSON.parse(locJson).pmd.file});

      var report = locReport.data[0].file.violation;
      for(var i = 0;  i < report.length;  i++)
        {
          var priorityCount = report[i]['priority'];
          report[i].complexityCyclomatic = priorityCount;
          report[i].msg = report[i]['$t'];

          if(priorityCount < 2){
            report[i]['priority'] = 'info';
          }else if(priorityCount >= 2 && priorityCount < 4){
            report[i]['priority'] = 'warning';
          }else if(priorityCount >= 4){
            report[i]['priority'] = 'error';
          }
          delete report[i].$t;
        }
    fs.writeFileSync('./java-reports/java-loc.json', JSON.stringify(locReport));
    },*/

  parseDuplicationJson: function(){
         var duplicationJson = this.parseXmlToJson(duplicationPath);
         var duplicationReport = {
              reportType : "JAVA-DUPLICATION",
              data : []
          };
         duplicationReport.data.push(JSON.parse(duplicationJson));
          fs.writeFileSync('./java-reports/java-duplication.json', JSON.stringify(duplicationReport));
    }
    
  }
   return xmlToJsonParser;
};

