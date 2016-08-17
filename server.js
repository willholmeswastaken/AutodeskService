//express is used for our routing
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var request = require('request');

var proc = require('./Process.js');
var cors = require('cors');
var bodyParser = require("body-parser");

var herokuURL = 'https://leanpiemodeller.herokuapp.com';

var platformUrl = "http://leanpie.igs-solutions.co.uk/";

var app = express();
var server = http.createServer(app);
var api = require('./routes/api');
var guid = require('guid');

//app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', express.static(path.resolve(__dirname, 'www')));
app.use('/Service', express.static(path.resolve(__dirname, 'www/UploadService.html')));
app.use('/api', api);

app.post('/drawing', function (req, res) {
    console.log(req.body.fileurl);
    console.log(req.body.ext);
    var filename = guid.raw();
    var filepath = './rawfiles/' + filename + req.body.ext;
    var file = fs.createWriteStream(filepath);
    var targeturl = platformUrl + req.body.fileurl;
    console.log("targeturl" + targeturl);
    request.get(targeturl).pipe(file);
    proc.postDrawing(filepath);
    proc.checkDone();
    function y() {
        if (proc.targeturn == "") {
            setTimeout(y, 5000);
        } else {
            console.log("weve done it");
            console.log(proc.targeturn);
            res.end(proc.targeturn);
        }
    }

    y();
})


app.post('/test', function (req, res) {
    request.get('http://leanpie.igs-solutions.co.uk/Handlers/Documents/Download.ashx?FileID=610')
        .pipe(fs
            .createWriteStream('testholmes.sldprt'));
})


server.listen(process.env.PORT || 3000,
    process.env.IP || "0.0.0.0",
    function () {
        console.log("server started");
    });


//dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bGVhbnBpZW1hbnVmYWN0dXJpbmcxMjMtYnVja2V0L3Rlc3QuZHdm <- urn