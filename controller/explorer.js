/**
 *  © 2016 Theenoro
 *
 *
 */

// MODULES
var fs = require('fs');
var path = require('path');
// OBJ
var explorer = {};

explorer.getCurrentFiles = function(path,callback){
  fs.readdir(path,{encoding:'utf8'}, function(err,files){
    callback(err,files);
  })
};
explorer.getCurrentDir = function(path,callback){
  fs.readdir(path,{encoding:'utf8'}, function(err, files) {
      var dirs = [];
      for (var index = 0; index < files.length; ++index) {
          var file = files[index];
          if (file[0] !== '.') {
              var filePath = path + '/' + file;
              fs.stat(filePath, function(err, stat) {
                  if (stat.isDirectory()) {
                      dirs.push(this.file);
                  }
                  if (files.length === (this.index + 1)) {
                      callback(dirs);
                  }
              }.bind({index: index, file: file}));
          }
      }
      callback(dirs);
  });
}
/*
explorer.getCurrentDir("I:\\Pictures",function(data){
  console.log(data);
});
*/
module.exports = explorer;
