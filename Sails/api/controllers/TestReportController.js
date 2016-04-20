/**
 * PmdReportController
 *
 * @description :: Server-side logic for managing pmdreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getTestSummary: function (req, res) {
        var storyId = req.param('storyId');
        if(!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }
        TestReport.find({ storyId: storyId })        
        .exec(function (err, audiences) {
           if (err) {
                  return res.negotiate(err);
          }
     
      //audiences.sort(function (a, b) { return a.name == null ? -1 : a.name.localeCompare(b.name); });

      return res.json(audiences);
  });


    },
    
    getTestReport: function (req, res) {
        var storyId = req.param('storyId');
        if(!storyId) {
            return res.badRequest('`storyId` parameter is required');
        }
         PmdReport.native(function(err, collection){
            if(err){
                return res.send(err, 500);
            } else {
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

