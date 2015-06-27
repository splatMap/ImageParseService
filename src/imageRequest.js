var Q = require('q');
var request = require('request');
var fs = require('fs');
var url = require('url');
var path = require('path');


module.exports = {
    requestImage: function(imageUrl, fsPath) {
        var urlPath = url.parse(imageUrl)
        paths = urlPath.pathname.split('/')
        var filename = path.join(fsPath, paths[paths.length - 1]);
        var deferred = Q.defer();

        request(imageUrl)
            .on('response', function(response) {
                response.on('end', function() {
                    console.log(filename + '\n' + response);
                    console.log("done loading", imageUrl);
                    deferred.resolve({
                        filename : filename
                    });
                })
            })
            .on('error', function(error) {
                deferred.reject(error);
            })
            .pipe(fs.createWriteStream(filename));

        return deferred.promise;
    }
}
