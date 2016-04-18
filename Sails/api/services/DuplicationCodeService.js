/**
 * StoryService
 *
 * @description :: Business-side logic for managing stories
 * 
 */
var Promise = require("bluebird");
module.exports = {
    
    getRedundantCodeBlockCount:function(reqParams){
        var storyId = reqParams.storyId;
        return new Promise(function(resolve, reject) {
         RedundantCodeMetrics.native(function(err, collection){
            if(err){
                reject({error: "Failed to get duplication code total count."});
                //return res.send(err, 500);
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
                    resolve(data);
                    //return res.json(data);
                    });
                }
            });
        });
    },
    getRedundantCodeLinesCount:function(reqParams, res){
        var storyId = reqParams.storyId; 
        return new Promise(function(resolve, reject) {              
         RedundantCodeMetrics.native(function(err, collection){
            if(err){
                reject({error: "Failed to get duplication lines of code count."});
                //return res.send(err, 500);
            } else {
            collection.aggregate([
                {$match: { storyId: storyId } },
                {$unwind: { path: '$data', preserveNullAndEmptyArrays:true,includeArrayIndex:'dataIndex'}}, 
                {$unwind: { path: '$data.instances', preserveNullAndEmptyArrays:true,includeArrayIndex:'instanceIndex'}},
                {$unwind: { path: '$data.instances.lines', preserveNullAndEmptyArrays:true,includeArrayIndex:'lineIndex'}},
                {$group:
                  { _id : {id: "$data.id", instanceInd: "$instanceIndex", path:'$data.instances.path'},
           			start: { $first: "$data.instances.lines" },
           			end: { $last: "$data.instances.lines" }
         		  }
                 },
                 {$group : {
             		_id : '$_id.path',
           		    numberOfDups: { $sum: 1 },
           		    totalDuplicatedLines: { $sum: { $subtract: [ "$end", "$start"] } }
        		}},
        		{ "$project": {
        			"_id": 0,
        			 "path": "$_id",
       				 "totalDuplicatedLines": "$totalDuplicatedLines",
        			"numberOfDups":"$numberOfDups",
    		    }}
            ]).toArray(function(err, data){
                    resolve(data);
                    //return res.json(data);
                    });
                }
            });
        });
    }
};