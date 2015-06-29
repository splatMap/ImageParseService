// load environment variables;
require('dotenv').load();

var Firebase = require('firebase');
var Q = require('q');
var uuid = require('uuid');
var mkdirp = require('mkdirp');
var requester = require('./src/imageRequest');
var runner = require('./src/runner');
var path = require('path');
var uploadToS3 = require('./src/s3plyUploader');
var exec = require( 'child_process' ).exec;
var tmpPath = 'tmp';


exec( 'rm -r ' + tmpPath, function ( err, stdout, stderr ){

});
var cloudsRef = new Firebase('https://splatmap.firebaseio.com/clouds');
var processedRef = new Firebase('https://splatmap.firebaseio.com/processedClouds');

cloudsRef.on('child_added', function(value) {
    try {
    var cloud = value.val();
    console.log('cloud ADDED', cloud);
    /*debugger;*/
    // don't process the ones that have been already processed;
    if (cloud.processed) return;

    cloud.id = uuid.v4();

    var baseDir = path.resolve(path.join('tmp', cloud.id));
    var inputDir = path.join(baseDir, 'in');
    // make the directories
    mkdirp.sync(baseDir);
    mkdirp.sync(inputDir);

    var promises = cloud.images.map(function(imgUrl) {
        return requester.requestImage(imgUrl, inputDir);
    });

    Q.all(promises)
        .then(function(images) {
            return runner(inputDir, baseDir)
        })
        .then(function(plys) {
            console.log(plys);
            var uploadFiles = plys.map(function(ply) {
                return uploadToS3(cloud.id, ply);
            });

            Q.all(uploadFiles)
                .then(function(files) {
                    console.log('files!\n', files)
                    cloud.processed = true;
                    if (!files) {
                        return;
                    }
                    cloud.plys = files;
                    processedRef.push(cloud);
                });

        })
    } catch (e) {
        console.log('coudl not process');
    }
});
