/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var FileSystemService = require('../services/FileSystemService');
module.exports = {
	
	fileuploadPage: function (req,res){
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
    '<form action="http://localhost:1338/filesystem/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="report" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
    )
  },
  readMetricJSON: function(req, res){
   
    req.validate({
      id: 'string',
      path: 'string'
    });
    
    FileSystemService._readMetricsJSON({path: req.param('path')})
      
    
  },  
  uploadLargeFile:function(req, res){        
        req.file('report').upload({
        adapter: require('skipper-gridfs'),
            uri: 'mongodb://localhost:27017/test.bucket'
        }, function (err, filesUploaded) {
        if (err) return res.negotiate(err);
        return res.json(filesUploaded);
        });  
  },
  upload: function  (req, res) {
    console.log('uploading ....');
	  req.file('report').upload({
    // don't allow the total upload size to exceed ~1GB
      maxBytes: 1000000000,
	    dirname: require('path').resolve(sails.config.appPath, '/Accion/Metrics/reports')
      },function whenDone(err, uploadedFiles) {
          if (err) {            
            sails.log(err);
            return res.negotiate(err);
          }
          sails.log("\n Files are uploaded successfully.");
          // If no files were uploaded, respond with an error.
          if (uploadedFiles.length === 0){
            return res.badRequest('No file was uploaded');
          }
          
          FileSystemService.processUploadedFiles(req.headers, uploadedFiles).then(function(resolveData){
              return res.json(resolveData);
          }, function(rejectedData){
              return res.negotiate(rejectedData);
          }).catch(function(ex){
              return res.negotiate(ex);
          })
          
          
    
    
    
    // Stream the file down
    
    
    /*
	return res.json({
        message: uploadedFiles.length + ' file(s) uploaded successfully!',
        files: uploadedFiles,
        description: uploadedFiles[0].fd,
        content:content,
		    Url: require('util').format('%s/user/avatar/%s', sails.config.appUrl, (req.session.me || 'admin'))
      });
      */
 /*
    // Save the "fd" and the url where the avatar for a user can be accessed
    User.update(req.session.me, {

      // Generate a unique URL where the avatar can be downloaded.
      avatarUrl: require('util').format('%s/user/avatar/%s', sails.getBaseUrl(), req.session.me),

      // Grab the first file and use it's `fd` (file descriptor)
      avatarFd: uploadedFiles[0].fd
    })
    .exec(function (err){
      if (err) return res.negotiate(err);
      return res.ok();
    });
	*/
  });
	  
	 /* 
    req.file('report').upload(function (err, files) {
      if (err)
        return res.serverError(err);

      return res.json({
        message: files.length + ' file(s) uploaded successfully!',
        files: files
      });
    });
	*/
	
	
  }
};

