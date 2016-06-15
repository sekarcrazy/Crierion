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
        if(report.length){
           for(var i = 0;  i < report.length;  i++)
            {
              var priorityCount = report[i]['priority'];
              report[i].complexityCyclomatic = priorityCount;
              report[i].msg = report[i]['$t'];

              if(priorityCount < 2){
               report[i]['priority'] = 'info';
            }else if(priorityCount >= 2 && priorityCount < 3){
              report[i]['priority'] = 'warning';
            }else if(priorityCount >= 3){
              report[i]['priority'] = 'error';
            }
            delete report[i].$t;
          }
        } else{
          var priorityCount = report['priority'];
          report.complexityCyclomatic = report['priority'];
          report.msg = report['$t'];
          if(priorityCount < 2){
               report['priority'] = 'info';
            }else if(priorityCount >= 2 && priorityCount < 4){
              report['priority'] = 'warning';
            }else if(priorityCount >= 4){
              report['priority'] = 'error';
            }
            delete report.$t;
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
         var temp = duplicationReport.data[0];
          var a = temp['pmd-cpd'].duplication;
          // var count = 0;
          for(var i = 0;i<a.length;i++){
            var myArray = [];
            if(a[i].codefragment)
            {
              myArray = a[i].codefragment.split("\n");
            }
            
            a[i].codefragment = myArray;
            var codecount = myArray.length;
            a[i].codelines = codecount;

            // count = count + (a[i].codelines*a[i].file.length);
            }
            // console.log(count);52784
          fs.writeFileSync('./java-reports/java-duplication.json', JSON.stringify(duplicationReport));
    }
    
  }
   return xmlToJsonParser;
};
