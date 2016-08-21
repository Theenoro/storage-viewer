/**
 *  © 2016 Theenoro
 *
 *
 */
var path = "Z:/nw2";
var express = require('express');
var session = require('express-session');
var app = express();
app.use(session({
  secret: 'storage-viewer',
  resave: true,
  saveUninitialized: true
}))
var explorer = require('./explorer');
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(function(req,res,next){
  if(typeof req.session.path === "undefined"){
    console.log("resett")
    req.session.path = path;
  }
  next();
})
app.use(express.static('public'));

app.get('/file/:file',function(req,res){
  console.log(req.session.path);
  res.sendFile(req.session.path+'/'+req.params.file);
})
app.post('/path',function(req,res){
  if(req.session.path.slice(-1) === "/" ){
    req.session.path = req.session.path.substring(0, req.session.path.length - 1);
  }
  req.session.path = req.session.path+'/'+req.body.path;
  console.log(req.session.path);
  if(req.body.path === '..'){
      var temp = req.session.path.split('/');
      var tempPath = "";
      for(var z = 0;z<temp.length-2;z++){
        tempPath += temp[z]+'/';
      }
      req.session.path = tempPath;
  }
  console.log(req.session.path)
  var i = 0;
  explorer.getCurrentDir(req.session.path,function(dirs){
      if(path !== req.session.path){
        dirs.push('..');
      }
      explorer.getCurrentFiles(req.session.path,function(err,files){
        if(i===0){
          res.send('{"currentPath":"'+ req.session.path +'","dirs":'+JSON.stringify(dirs)+',"files":'+JSON.stringify(files)+'}');
        }
        i++;
      })
  });
})

 app.listen(3000, function () {
   console.log('App running on Port 3000!');
 });
