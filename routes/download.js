
/*
 * GET users listing.
 */

var fs = require('fs');

exports.list = function(req, res){
    var file = new fs.ReadStream('node_doc.html');
    console.log(file);
    sendFile(file, res);
    res.send("respond with a resource" + req.url);
};

function sendFile(file, res) {
    file.pipe(res);

    file.on('error', function(err) {
        res.statusCode = 500;
        res.end("Server Error");
        console.error(err);
    });
}