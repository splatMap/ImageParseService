var Firebase = require('firebase');
var Q = require('q');
var uuid = require('uuid');
var mkdirp = require('mkdirp');
var requester = require('./src/imageRequest');
var runner = require('./src/runner');
var path = require('path');


var cloudsRef = new Firebase('https://splatmap.firebaseio.com/clouds');
cloudsRef.on('child_added', function(value) {
    var cloud = value.val();
    console.log('cloud ADDED', cloud);
    /*debugger;*/
    // don't process the ones that have been already processed;
    if (cloud.points) return;

    cloud.id = uuid.v4();

    var baseDir = path.resolve(path.join('tmp', cloud.id));
    var inputDir = path.join(baseDir, 'in');
    // make the directories
    mkdirp.sync(inputDir);
    mkdirp.sync(outputDir);

    var promises = cloud.images.map(function(imgUrl) {
        return requester.requestImage(imgUrl, inputDir);
    });

    Q.all(promises)
        .then(function(images) {
            runner(inputDir, baseDir);
        });
});
