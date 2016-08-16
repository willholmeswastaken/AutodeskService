
var Lmv = require('./node_modules/view-and-data/view-and-data');
var path = require('path');

var server = require('./server.js');

//only fill up requested fields, other fields are defaulted
var config = require('./config-view-and-data');

var exports = module.exports = {};

var theurn = "";
exports.targeturn = "";
var isdone = false;

exports.getToken = function() {


    var lmv = new Lmv(config);

    lmv.getToken().then(function (response) {

        console.log('Token Response:')
        console.log(response)
        //response is the token
        done(response);

    }, function (error) {
        console.log(error);
        done(error);
        });

}

exports.postDrawing = function(physicalPath) {
    //Get the bucket...
    theurn = "";
    var lmv = new Lmv(config);

    lmv.initialize().then(onInitialized, onError);

   /* this.timeout(5 * 60 * 1000); *///5 mins timeout

    var lmv = new Lmv(config);

    function onError(error) {
        console.log("we are erroring");
        console.log(error)
        done(error);
    }

    function onInitialized(response) {

        console.log("we are init");
        var createIfNotExists = true;

        var bucketCreationData = {
            bucketKey: config.defaultBucketKey,
            servicesAllowed: [],
            policy: "transient"
        };

        lmv.getBucket(config.defaultBucketKey,
            createIfNotExists,
            bucketCreationData).then(
            onBucketCreated,
            onError);
    }

    function onBucketCreated(response) {

        console.log("we are creating bucket");
        //lmv.resumableUpload(
        //    path.join(physicalPath),
        //Above we declare where the file is, below we give the bucket key that we use.
        //    config.defaultBucketKey,
        //below we then specify our file name.
        //    path.basename(physicalPath)).then(onResumableUploadCompleted, onError);

        //Physical path is the route of the file we are uploading...
        lmv.resumableUpload(
            path.join(physicalPath),
            config.defaultBucketKey,
            path.basename(physicalPath)).then(onResumableUploadCompleted, onError);
    }

    function onUploadCompleted(response) {

        console.log("we are upload complete");
        var fileId = response.objects[0].id;

        urn = lmv.toBase64(fileId);

        lmv.register(urn, true).then(onRegister, onError);
    }

    function onResumableUploadCompleted(response) {

        response.forEach(function (result) {

            console.log(result.objects);
        });

        var fileId = response[0].objects[0].id;

        urn = lmv.toBase64(fileId);

        lmv.register(urn, true).then(onRegister, onError);
    }

    function onRegister(response) {

        console.log("we are registering");
        if (response.Result === "Success") {

            console.log('Translating file...');

            lmv.checkTranslationStatus(
                urn, 1000 * 60 * 5, 1000 * 10,
                progressCallback).then(
                onTranslationCompleted
                );
        }
        else {
            done(response);
        }
    }

    function progressCallback(progress) {

        console.log(progress);
    }

    function onTranslationCompleted(response) {

        console.log("we are completing translation");
        console.log('URN: ' + response.urn);

        lmv.getThumbnail(urn).then(onThumbnail, onError);
        theurn = response.urn;

    }

    function onThumbnail(response) {

        console.log("we are thumbnailing");
        console.log('Thumbnail Size: ' + response.length);
        done();
    }

    //start the test
    lmv.initialize().then(onInitialized, onError);

}

exports.checkDone = function() {
    if (theurn == "") {
        setTimeout(exports.checkDone, 50);
        return "";
    }
    console.log("were done");
    console.log("the urn we have is: " + theurn);
    exports.targeturn = theurn;
}