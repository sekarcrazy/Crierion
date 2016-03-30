/**
 * File System Service
 *
 * @description :: Business-side logic for managing stories
 * 
 */

var StoryService = require('./StoryService'),
ReportService = require('./ReportService'),
utilService = require('./UtilService'),
Promise = require("bluebird"),
constant = require('../constant/constant');;

module.exports = {
  create:function(data){
       // here you call your models, add object security validation, etc...
      return FileSystem.create(data);      
    },
    _readMetricsJSON: function(param)
    {
        if(param.path)
        {
        var SkipperDisk = require('skipper-disk'), fileAdapter = SkipperDisk(/* optional opts */);
        return new Promise(function(resolve, reject) {
            fileAdapter.read(param.path, function(err, data) {
                if(err){
                    sails.log("\n Error occured while reading the file from " + param.path);
                    reject("Error occured while reading the file from " + param.path);
                }
                try{
                    var jsonContent = JSON.parse(data);
                    jsonContent.uploadedPath = param.path;
                    sails.log("Successfully read the document. \n It is pushing into mongo from the below mentioned path " + param.path
                    + "\n It is processing....");
                    resolve(jsonContent);
                }
                catch (e){
                sails.log("\n Failed to parse JSON file. Please check " + param.path + " file.");
                resolve({error:"failed to parse JSON file. Please check " + param.path + " file."}); 
                }            
            }); 
        });
        }
    },
    processUploadedFiles: function(headers, uploadedFiles){
        var FileSystemService= this;
        function finallySendResponse(rejectResponse, ex){
            rejectResponse({error: "Failed to process uploadedFiles.", exception:ex});
        }
        return new Promise(function(resolveResponse, rejectResponse) {
        var isCorruptedFilePresent = false, 
        filteredFiles = uploadedFiles.filter(function(file){
              if(file.size <= 15400000) {
                  return true;
              }else{
                  file.error= "Error occured. Application wont support more than 15.4 MB size.";
                  isCorruptedFilePresent = true;
                  return false;
              }
          });
          StoryService.createNewStory({
              storyType: headers["report-type"] || "ARIC",
              storyName:headers["report-name"] || "Latest Report",
              projectName:headers["project-name"] || "Test",
              lang:(headers["lang"] && headers["lang"].toLowerCase()) || "js"
            }).then(function(createdStory){                
                
                var uploadedFilesCount = filteredFiles.length, iterationCount = 0;
                
                utilService.promiseWhile(function() {
                    // Condition for stopping
                    return iterationCount < uploadedFilesCount;
                }, function() {
                    // The function to run, should return a promise
                    return new Promise(function(resolve, reject) {
                        //Push file system
                        sails.log("Picked " + (iterationCount + 1) + " file and making an entry in file system colection in Mongo");
                        FileSystemService.create({
                            storyId:createdStory.id,
                            filePath:filteredFiles[iterationCount].fd,
                            filename:filteredFiles[iterationCount].filename,
                            size:filteredFiles[iterationCount].size
                            
                         }).then(function(){}).catch(function(ex){
                             sails.log(ex);
                             reject();
                             finallySendResponse(rejectResponse,ex);
                         });                        
                         
                        sails.log("Reading a metrics from uploaded files.");
                        //push into report service
                        FileSystemService._readMetricsJSON({path: filteredFiles[iterationCount].fd})
                            .then(function(fileContent){
                                fileContent.storyId = createdStory.id;                                    
                                    if(fileContent.error){
                                       filteredFiles[iterationCount].error = fileContent.error;
                                       iterationCount++;
                                       resolve();
                                    }else if(createdStory.lang == constant.REPORTS.LANG.JS){                                        
                                        ReportService.insertJSReport(fileContent, function(err){
                                            if(err){
                                                filteredFiles[iterationCount].error = err.error;
                                            }
                                            iterationCount++;
                                            resolve();
                                        });
                                    }
                                }).catch(function(ex){  sails.log(ex); reject(); finallySendResponse(rejectResponse,ex)});
                            });
                }).then(function() {
                    // Notice we can chain it because it's a Promise, this will run after completion of the promiseWhile Promise!
                    var message = uploadedFiles.length + ' file(s) uploaded '+ (isCorruptedFilePresent ? 'failed' : 'successfully') + '!';
                    sails.log(message);
                    resolveResponse({
                        message: message,
                        files: uploadedFiles,
                        story:createdStory
                        //Url: require('util').format('%s/user/avatar/%s', sails.config.appUrl, 'admin')
                    });
                    //return res.json();
                });
            }).catch(function(ex){
                finallySendResponse(rejectResponse,{error: "Failed to process uploadedFiles.", exception:ex});
            
            });
            
        });
    }
};