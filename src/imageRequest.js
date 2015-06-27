var Q = require('q');
var request = require('request');
var fs = require('fs');
var url = require('url');


module.exports = {
    requestImage: function(imageUrl, fsPath) {
        var path = url.parse(imageUrl)
        console.log(path);
        paths = path.pathname.split('/')
        var fileName = fsPath + '/' + paths[paths.length - 1] + '.jpg';
        var deferred = Q.defer();

        request(imageUrl)
            .on('end', function(response) {
                debugger;
                console.log("done loading", imageUrl);
                deferred.resolve({
                    fileName : fileName,
                    dir: fsPath
                });
            })
            .on('error', function(error) {
                deferred.reject(error);
            })
            .pipe(fs.createWriteStream(fileName));

        return deferred.promise;
    }
}
