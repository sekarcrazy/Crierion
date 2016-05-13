/**
 * PmdReportController
 *
 * @description :: Server-side logic for managing pmdreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var constant = require('../constant/constant');
var utilService = require('../services/UtilService');
module.exports = {
	getJsViolationsCount:function(storyId, cb){  
        PmdReport.native(function(err, collection){
                if(err){
                    cb({ error: err });
                } else {
                collection.aggregate([
                        {$match: { storyId: storyId } },
                        {$unwind: '$data'}, 
                        {$unwind: '$data.file.violations'}, 
                        {$group: {
                        _id: '$data.file.violations.priority',
                        "count":  {$sum: 1}      
                        }}
                    ]).toArray(function(err, data){
                         cb(null, data);
                        });
                    }
        });
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
            
    },
    
    getRubyViolationsCount:function(storyId, cb){
        RubyPmd.native(function(err, collection){
                if(err){
                     cb({ error: err });
                } else {
                collection.aggregate([
                        {$match: { storyId: storyId} },
                        {$unwind: '$data.files'}, 
                        {$unwind: '$data.files.offenses'}, 
                        {$group: {
                        _id: '$data.files.offenses.severity',
                        "count":  {$sum: 1}      
                        }}
                    ]).toArray(function(err, data){
                         cb(null, data);
                        });
                    }
        });
    },
    getViolationsCount: function (req, res) {
        var storyId = req.param('storyId'), lang = req.param('lang');
        if (!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }
        if (!lang) {
            return res.badRequest('`lang` parameter is required');
        }
        switch (lang) {
            case constant.REPORTS.LANG.JS:
                this.getJsViolationsCount(storyId, function (err, data) {
                    if (err) {
                        return res.send(err, 500);
                    }
                    return res.json(data);
                });
                break;
            case constant.REPORTS.LANG.RUBY:
                this.getRubyViolationsCount(storyId, function (err, data) {
                    if (err) {
                        return res.send(err, 500);
                    }
                    return res.json(data);
                });
                break;
            default:
                return res.badRequest(utilService.stringFormat('`%s` language is not supported', lang));
        }

    }
};

