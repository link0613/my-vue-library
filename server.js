var express = require("express");
var app     = express();
var path    = require("path");

app.use(express.static(path.join(__dirname, '/dist')));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/dist/index.html'));
  //__dirname : It will resolve to your project folder.
});


app.listen(3000);

console.log("Running at Port 3000");