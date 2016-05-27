/**
 * PmdReportController
 *
 * @description :: Server-side logic for managing pmdreports
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
                    case 'jsPmdReport':
                    case 'javaPmdReport':
                    case 'rubyPmdReport':
                       qr[0].$match.storyId = params.storyId;
                    break;
                }
               
                collection.aggregate(qr).toArray(function (err, data) {
                    cb(null, data);
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
    getViolationsCount: function (req, res) {
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
                    queryObj.model = PmdReport;
                    queryObj.type = 'jsPmdReport';
                    queryObj.params = {storyId:storyId};                
                break;
            case constant.REPORTS.LANG.RUBY:
                    queryObj.model = RubyPmd;
                    queryObj.type = 'rubyPmdReport';
                    queryObj.params = {storyId:storyId};               
                break;
            case constant.REPORTS.LANG.JAVA:
                    queryObj.model = JavaPmd;
                    queryObj.type = 'javaPmdReport';
                    queryObj.params = {storyId:storyId};               
                break;    
            default:
                return res.badRequest(utilService.stringFormat('`%s` language is not supported', lang));
        }

        this.executeQuery(queryObj.model, queryObj.type, queryObj.params, function(err, data){
            return self.returnReponse(err, data, res);}
        );
    },
   
    getIssuesListCount:function(req, res){
        var storyId = req.param('storyId');
        if(!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }
         PmdReport.native(function(err, collection){
            if(err){
                return res.send(err, 500);
            } 
            else {
            collection.aggregate([
                    {$match: { storyId: storyId } },                    
                    {$unwind: '$data'}, 
                    {$unwind: '$data.file.violations'}, 
                    {$group: {
                    _id: {type:'$data.file.violations.priority', cyclomatic:'$data.file.violations.complexityCyclomatic'},
                    "count":  {$sum: 1}      
                    }},
                    {$match: { '_id.type': 'error' } },
                    { "$project": {
                    "_id": 0,
                     "type": "$_id.type",
                     "cyclomatic": "$_id.cyclomatic",
                    "count": 1
                    }}
                ]).toArray(function(err, data){
                    return res.json(data);
                    });
                }
             });
            
    }
   
};

