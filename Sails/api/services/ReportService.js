/**
 * ReportService
 *
 * @description :: Business-side logic for managing stories
 * 
 */
var utilService = require('./UtilService');
var constant = require('../constant/constant');
module.exports = {
  insertJSReport:function(data, cb){
       // here you call your models, add object security validation, etc...       
       switch(data.reportType)
       {
           case constant.REPORTS.TYPE.JSLINT:
            return JsLintReport.create(data).exec(cb);
           case constant.REPORTS.TYPE.PMD:
            return PmdReport.create(data).exec(cb);
           case constant.REPORTS.TYPE.CHECKSTYLE:
            return CheckstyleReport.create(data).exec(cb);
           case constant.REPORTS.TYPE.REDUNDANT:
               return RedundantCodeMetrics.create(data).exec(cb);
           case constant.REPORTS.TYPE.TESTREPORT:
               return TestReport.create(data).exec(cb);
           case constant.REPORTS.TYPE.TESTCOVERAGE:
               return TestCoverage.create(data).exec(cb);
       }
       if(cb)
       {
           cb({error: utilService.stringFormat('Either report type could be undefined or%s report type wont support.', 
                (data.reportType && (" " + data.reportType) || ''))
             })
       }
    }
};