/**
 * JsLintReportController
 *
 * @description :: Server-side logic for managing jslintreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getLOC:function(req, res){
        var storyId = req.param('storyId');
        if(!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }
         JsLintReport.native(function(err, collection){
            if(err){
                return res.send(err, 500);
            } else {
            collection.aggregate([
                { $match: { storyId: storyId } },
                { $group: { _id: '$storyId',records: { $sum: 1 }, data: { $push: '$data' } } },
                {$unwind : "$data"}, 
                {$unwind : "$data"}, 
                {$group : {
                    _id : "$_id",
                    data : {$addToSet : "$data"} // this will give you distinct, if you ant duplicate replace push
                }
            }
            ]).toArray(function(err, data){
                    return res.json(data);
                    });
                }
            });
    },
    getDashboardInfo:function(req, res){
        var storyId = req.param('storyId');
        if(!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }
        JsLintReport.native(function(err, collection){
            if(err){
                return res.send(err, 500);
            } else {
                collection.aggregate([
                {$match: {"storyId": storyId} }, 
                {$unwind: { path: '$data', preserveNullAndEmptyArrays:true}}, 
                {$group: {
                _id: '$storyId', 
                "loc": {$sum: "$data.file.aggregate.sloc.physical" },
                "totalFunction": {$sum: "$data.file.aggregate.totalFunction" },
                "files":  {$sum: 1}      
                }},
                {
                $lookup:
                    {
                    from: "redundantcodemetrics",
                    localField: "_id",
                    foreignField: "storyId",
                    as: "redundantcodemetrics"
                    }
                },
                {$unwind: { path: "$redundantcodemetrics", preserveNullAndEmptyArrays: true }},
                {$unwind: { path: '$redundantcodemetrics.data', preserveNullAndEmptyArrays:true}},
                {$unwind: { path: '$redundantcodemetrics.data.instances', preserveNullAndEmptyArrays:true}},
                {
                        $group: {     
                        _id:{storyId: '$_id',loc:'$loc', totalFunction:'$totalFunction', files:'$files', isDupsPresent:{$gt:["$redundantcodemetrics.data.instances", null]}},     
                            numberOfDups: { $sum: 1 }
                        }
                },
                { "$project": {
        			"_id": 0,
        			 "storyId": "$_id.storyId",
       				 "loc": "$_id.loc",
        			"totalFunction": "$_id.totalFunction",
        			"files":"$_id.files",
        			"numberOfDups":"$numberOfDups",
        			isDupsPresent:'$_id.isDupsPresent'
    				}}
            ],function(err, data){
                return res.json(data);
                });
            }
         });
    }
};

