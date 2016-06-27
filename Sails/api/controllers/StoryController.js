/**
 * StoryController
 *
 * @description :: Server-side logic for managing stories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var StoryService = require('../services/UsersService');
module.exports = {
create:function(req, res){
       StoryService.createNewStory(req.params.all())
       .then(function(createdStory){
           return res.json(createdStory);
       })
       .catch(res.negotiate);
   },
   getNavigationList:function(req, res){
       StoryService.getNavigation(req.params.all()).then(function(resolve){
           return res.json(resolve);
       }).catch(res.negotiate);
   }
};

