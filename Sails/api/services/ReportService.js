/**
 * ReportService
 *
 * @description :: Business-side logic for managing stories
 * 
 */
var utilService = require('./UtilService');
var constant = require('../constant/constant');
module.exports = {
    _insertJSReports: function (data, cb) {
        // here you call your models, add object security validation, etc...       
        switch (data.reportType) {
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
            case constant.REPORTS.TYPE.RUBY_REDUNDANT:
                return rubyRedundant.create(data).exec(cb);
            case constant.REPORTS.TYPE.RUBY_PMD:
                return rubyPmd.create(data).exec(cb);
            case constant.REPORTS.TYPE.RUBY_CHECKSTYLE:
                return rubyCheckstyle.create(data).exec(cb);
                    
                    
        }
        if (cb) {
            cb({
                error: utilService.stringFormat('Either report type could be undefined or%s report type wont support.',
                    (data.reportType && (" " + data.reportType) || ''))
            })
        }
    },
    _insertRubyReports: function (data, cb) {
        // here you call your models, add object security validation, etc...
        switch (data.reportType) {
            case constant.REPORTS.TYPE.RUBY_LINT:
                return RubyLintReport.create(data).exec(cb);
            case constant.REPORTS.TYPE.RUBY_PMD:
                return RubyPmd.create(data).exec(cb);
            case constant.REPORTS.TYPE.RUBY_DUPLICATION:
                return RubyDuplication.create(data).exec(cb);
        }
        if (cb) {
            cb({
                error: utilService.stringFormat('Either report type could be undefined or%s report type wont support.',
                    (data.reportType && (" " + data.reportType) || ''))
            })
        }
    },
    insertReport: function (fileContent, lang, cb) {
        if (lang.toLowerCase() == constant.REPORTS.LANG.JS) {
            this._insertJSReports(fileContent, cb);
        }
        else if (lang.toLowerCase() == constant.REPORTS.LANG.RUBY) {
            this._insertRubyReports(fileContent, cb);
        } else {
            if (cb) {
                cb({ error: 'lang does not support. Right now it is supporting ruby and js lang' });
            }
        }
    }
};