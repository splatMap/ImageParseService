var Q = require('q');
var request = require('request');
var fs = require('fs');
var url = require('url');
var path = require('path');


module.exports = {
    requestImage: function(imageUrl, fsPath) {
        var urlPath = url.parse(imageUrl)
        console.log(path);
        paths = urlPath.pathname.split('/')
        var fileName = path.join(fsPath, paths[paths.length - 1]);
        var deferred = Q.defer();

        request(imageUrl)
            .on('end', function(response) {
                debugger;
                console.log("done loading", imageUrl);
                deferred.resolve({
                    fileName : fileName
                });
            })
            .on('error', function(error) {
                deferred.reject(error);
            })
            .pipe(fs.createWriteStream(fileName));

        return deferred.promise;
    }
}
