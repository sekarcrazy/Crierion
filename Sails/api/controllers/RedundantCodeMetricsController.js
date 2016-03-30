/**
 * RedundantCodeMetricsController
 *
 * @description :: Server-side logic for managing redundantcodemetrics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getRedundantCodeCount:function(req, res){
        var storyId = req.param('storyId');
        if(!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }        
         RedundantCodeMetrics.native(function(err, collection){
            if(err){
                return res.send(err, 500);
            } else {
            collection.aggregate([
                {$match: { storyId: storyId } },
                {$unwind: '$data'}, 
                {$unwind: '$data.instances'}, 
                {$group: {
                _id: '$data.instances.path',
                "count":  {$sum: 1}      
                }}
            ]).toArray(function(err, data){
                                return res.json(data);
                                });
                            }
                        });
                }
};

