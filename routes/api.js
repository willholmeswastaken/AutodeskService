//Holmes AutoDesk A360 Node.JS API Service

//This is getting the view and data package
var lmv = require('view-and-data');
//This is getting our configuration file.
var config = require('../config-view-and-data');
//Then we set our default bucket key which is our folder name to store our files in essentially.
config.defaultBucketKey = 'leanpiemanufacturing123-bucket';
//Large model viewer (lmv)
lmv = new lmv(config);

//This will route the get calls for the get token.
var express = require('express');
var router = express();

router.get('/refreshToken',
    function(req, res) {
        lmv.getToken()
            .then(function(lmvRes) {
                res.send(lmvRes.access_token);
            });
    });

module.exports = router;