
var Lmv = require('./node_modules/view-and-data/view-and-data');
var path = require('path');

//only fill up requested fields, other fields are defaulted
var config = require('./config-view-and-data');
var token = getToken();


function getToken() {


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

function postDrawing(physicalPath) {
    //Get the bucket...

    var lmv = new Lmv(config);

    lmv.initialize().then(onInitialized, onError);

    this.timeout(5 * 60 * 1000); //5 mins timeout

    var lmv = new Lmv(config);

    function onError(error) {

        console.log(error)
        done(error);
    }

    function onInitialized(response) {

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

        if (response.Result === "Success") {

            console.log('Translating file...');

            lmv.checkTranslationStatus(
                urn, 1000 * 60 * 5, 1000 * 10,
                progressCallback).then(
                onTranslationCompleted,
                onError);
        }
        else {
            done(response);
        }
    }

    function progressCallback(progress) {

        console.log(progress);
    }

    function onTranslationCompleted(response) {

        console.log('URN: ' + response.urn);

        lmv.getThumbnail(urn).then(onThumbnail, onError);
        returnurn = response.urn;
    }

    function onThumbnail(response) {

        console.log('Thumbnail Size: ' + response.length);
        done();
    }

    //start the test
    lmv.initialize().then(onInitialized, onError);

    return returnurn;
}