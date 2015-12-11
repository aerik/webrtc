var portnum = 9000;

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var url = require('url');
var app = express();
var curpath = __dirname;

var invitations = {};

app.use(bodyParser.json({ extended: false }));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // to support URL-encoded bodies

app.post('/offer',function(req,resp){
	//console.log("received a post " + JSON.stringify(req.body));
	var respTxt = "";
	if(req.body.offer){
		var invite = makeId();
		//overkill - ensure unique
		while(invitations[invite]) invite = makeId();
		invitations[invite] = { "offer" : req.body.offer };
		respTxt = invite;
	}
	resp.writeHead(200, { "Content-Type": "text/plain"});
	resp.end(respTxt);
});

app.post('/answer',function(req,resp){
	var parsed = url.parse(req.url);
  var invite = parsed.query;
 	console.log("got an answer to " + invite);
	var respTxt = "";
	//need more checks here
	if(invitations[invite]){
		if(req.body.answer){
			invitations[invite] = { "answer" : req.body.answer };
			respTxt = invite;
		}
	}
	resp.writeHead(200, { "Content-Type": "text/plain"});
	resp.end(respTxt);
});

app.get('/accept', function (req, resp) {
  var parsed = url.parse(req.url);
  var invite = parsed.query;
  console.log("accepting " + invite);
  var respTxt = "not found";
  try{
		if(invitations.hasOwnProperty(invite)){
			respTxt = invitations[invite].offer;
		}
  }catch(e){
		console.log("Error: " + e.message);
  }
	resp.writeHead(200, { "Content-Type": "text/plain"});
	resp.end(respTxt);
});

app.get('/answered', function (req, resp) {
  var parsed = url.parse(req.url);
  var invite = parsed.query;
  var respTxt = "";
  try{
		if(invitations.hasOwnProperty(invite)){
			respTxt = invitations[invite].answer;
		}
  }catch(e){
		console.log("Error: " + e.message);
  }
	resp.writeHead(200, { "Content-Type": "text/plain"});
	resp.end(respTxt);
});

app.get('/list', function (req, resp) {
  resp.send(JSON.stringify(invitations));
});

app.get('/test', function (req, resp) {
  var filename = path.join(curpath, "test.htm");
  var fileStream = fs.createReadStream(filename);
	fileStream.on('error', function (error) {
			resp.writeHead(404, { "Content-Type": "text/plain"});
			resp.end("file not found");
			console.log("Error sending file");
	});
	fileStream.on('open', function() {
			var mimeType = "text/html";
			resp.writeHead(200, {'Content-Type': mimeType});
	});
	fileStream.pipe(resp);
});

var server = app.listen(portnum, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

/*********** functions *************/
function makeId(){
    var text = "";
    var possible = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}