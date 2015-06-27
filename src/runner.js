var spawn = require('child_process').spawn;
var COMMAND = 'VisualSFM'
var fs = require('fs');
var path = require('path');
var Q = require('q');

module.exports = function runVisualSFM(inputDir, outputDir) {

    var args = [
        'sfm+pmvs',
        // inputDir
        inputDir,
        outputDir + '/result.nvm'
    ];

    console.log(args);

    var deferred = Q.defer();

    var vSFM = spawn(COMMAND, args);

    vSFM.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    vSFM.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    vSFM.on('close', function (code) {
        console.log('done with code:', code);
        debugger;
        fs.readdir(outputDir, function(err, files) {
            debugger;
            var plys = [];
            var f, i;
            for (i = 0; i < files.length; i++) {
                f = files[i];
                if (path.extname(f) === '.ply') {
                    plys.push(path.join(outputDir, f));
                }
            }
            deferred.resolve(plys);
        });
    });

    return deferred.promise;

}
