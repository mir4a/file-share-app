var http = require('http')
  , fs = require('fs')
  , chat = require('./chat');

http.createServer(function (req, res) {
  switch (req.url) {
    case '/':
      sendFile('index.html');
      break;
    case '/upload':
      chat.upload(req, res);
      break;
    case '/download':
      chat.download(mes);
      break;
    default :
      res.statusCode = 404;
      res.send("Not found");
  }
}).listen(4000);

function sendFile(fileName, res) {
  var fileStream = fs.createReadStream(fileName);
  fileStream
    .on('error', function() {
      res.statusCode = 500;
      res.send("Server error");
    });
}