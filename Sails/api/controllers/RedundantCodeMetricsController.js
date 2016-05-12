/**
 * RedundantCodeMetricsController
 *
 * @description :: Server-side logic for managing redundantcodemetrics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var RedundantService = require('../services/DuplicationCodeService');
module.exports = {
	getRedundantCodeLinesCount:function(req, res){
        if (!req.param('storyId')) {
            return res.badRequest('`storyId` parameter is required');
        }
        if (!req.param('lang')) {
            return res.badRequest('`lang` parameter is required');
        }
        RedundantService.getRedundantCodeLinesCount(req.params.all()).then(function(createdStory){
            return res.json(createdStory);
        },function(error){return res.badRequest(error);})
        .catch(res.negotiate);
    },
    getRedundantFnBlockCount:function(req, res){
        if (!req.param('storyId')) {
            return res.badRequest('`storyId` parameter is required');
        }
        if (!req.param('lang')) {
            return res.badRequest('`lang` parameter is required');
        }
        RedundantService.getRedundantCodeBlockCount(req.params.all()).then(function(resolve){
            return res.json(resolve);
        },function(error){return res.badRequest(error);}).catch(res.negotiate);
    }
};

