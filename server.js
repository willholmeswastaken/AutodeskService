//express is used for our routing
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var config = require('./config-view-and-data.js');
var Process = require('./Process.js');

var app = express();
var server = http.createServer(app);
var api = require('./routes/api');

app.use('/', express.static(path.resolve(__dirname, 'www')));
app.use('/api', api);

app.post('/PostDrawing',
    function (req, resp) {
        var filename = path.basename(req.body);
        var filepath = './rawfiles/' + filename;
        fs.writeFile(filepath, req.body);
        var urn = Process.postDrawing(filepath);
        return urn;
    });


server.listen(process.env.PORT || 3000,
    process.env.IP || "0.0.0.0",
    function() {
        console.log("server started");
    });


//dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bGVhbnBpZW1hbnVmYWN0dXJpbmcxMjMtYnVja2V0L3Rlc3QuZHdm <- urn