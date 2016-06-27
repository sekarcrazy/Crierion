/**
 * StoryService
 *
 * @description :: Business-side logic for managing stories
 * 
 */
var Promise = require("bluebird");
//var storyModel =require('../models/Story');
module.exports = {
  createNewStory:function(data){
       // here you call your models, add object security validation, etc...
      return Story.create(data);
    },
   
  list:function(reqData){
      return new Promise(function(resolve, reject) {
         Story.native(function(err, collection){
            if(err){
              return reject({error: "Failed to get navigation."});
            } else {
            collection.aggregate([
                   { $sort: { storyType: 1, projectName: 1, updatedAt:1 } },
                   {
                    $group:
                        {
                        _id: {storyType:'$storyType', projectName:'$projectName', lang:'$lang'},
                        updatedAt: { $last: "$updatedAt" },
                        storyId : {$last: "$_id"},
                        storyType : {$last: "$storyType"},
                        projectName : {$last: "$projectName"},
                        lang : {$last: "$lang"}
                        }
                    },
                    { $group : { _id : "$storyType", projects: { $push: "$projectName" }, storyIds: { $push: "$storyId" }, langs: { $push: "$lang" } } }
            
            ]).toArray(function(err, data){
                    resolve(data);                    
                   });
                }
            });
        });
  }
};