/**
 * JsLintReportController
 *
 * @description :: Server-side logic for managing jslintreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var constant = require('../constant/constant');
var utilService = require('../services/UtilService');
var query = require('../query/query.json');
module.exports = {
    getQuery: function(path, params){
        var qr = JSON.parse(JSON.stringify(query[path]));
        return qr;
        //Need to update query param here.
    },
    transformReponse:function(queryType, response){
        if(queryType == 'rubyLintReport')
        {
            var responseObj =[{data:[]}];
            for(var key in response[0].data)
            {
                if(key != 'header' && key != "SUM")
                {
                    var obj = {file:{name:key, aggregate:{sloc:{physical:response[0].data[key].code}, cyclomatic:0,totalFunction:0}}}
                    responseObj[0].data.push(obj);

                }
            }
            return responseObj;
        }
        return response;
    },
    executeQuery: function (model, type, params, cb) {
        var qr = this.getQuery(type, params), self = this;
        model.native(function (err, collection) {
            if (err) {
                cb({ error: err });
            } else {                
                // This code has to remove once we implement in getQuery
                //Modiyfing mongo queryparameter.
                switch(type)
                {
                    case 'jsLintReport':
                    case 'jsDashboardInfo':                    
                    case 'rubyDashboardInfo':
                    qr[0].$match.storyId = params.storyId;
                    break;
                    case 'rubyLintReport':
                        qr.storyId = params.storyId;
                    break;
                    
                }
               
                collection.aggregate(qr).toArray(function (err, data) {
                    cb(null, self.transformReponse(type, data));
                });
            }
        });
    },
    returnReponse:function(err, data, res)
    {
        if (err) {
            return res.send(err, 500);
        }
        return res.json(data);
    },
   
    getLoc: function (req, res) {
        var storyId = req.param('storyId'), lang = req.param('lang'),self= this;
        if (!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }
        if (!lang) {
            return res.badRequest('`lang` parameter is required');
        }
        var queryObj = {model:'',type:'', params:''}
        switch (lang) {
            case constant.REPORTS.LANG.JS:
                    queryObj.model = JsLintReport;
                    queryObj.type = 'jsLintReport';
                    queryObj.params = {storyId:storyId};                
                break;
            case constant.REPORTS.LANG.RUBY:
                    queryObj.model = RubyLintReport;
                    queryObj.type = 'rubyLintReport';
                    queryObj.params = {storyId:storyId};               
                break;
            default:
                return res.badRequest(utilService.stringFormat('`%s` language is not supported', lang));
        }

        this.executeQuery(queryObj.model, queryObj.type, queryObj.params, function(err, data){
            return self.returnReponse(err, data, res);}
        );

    },
   
    
    
    getDashboardInfo: function (req, res) {
        var storyId = req.param('storyId'), lang = req.param('lang'),self= this;
        if (!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }
        if (!lang) {
            return res.badRequest('`lang` parameter is required');
        }
        var queryObj = {model:'',type:'', params:''}
        switch (lang) {
            case constant.REPORTS.LANG.JS:
                    queryObj.model = JsLintReport;
                    queryObj.type = 'jsDashboardInfo';
                    queryObj.params = {storyId:storyId};                
                break;
            case constant.REPORTS.LANG.RUBY:
                    queryObj.model = RubyLintReport;
                    queryObj.type = 'rubyDashboardInfo';
                    queryObj.params = {storyId:storyId};               
                break;
            default:
                return res.badRequest(utilService.stringFormat('`%s` language is not supported', lang));
        }

        this.executeQuery(queryObj.model, queryObj.type, queryObj.params, function(err, data){
            return self.returnReponse(err, data, res);}
        );
        
    }
    
};

