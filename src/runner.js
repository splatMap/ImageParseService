var spawn = require('child_process').spawn;

var COMMAND = 'VisualSFM'


module.exports = function runVisualSFM(inputDir, outputDir) {

    var args = [
        'sfm',
        // inputDir
        inputDir,
        outputDir + '/result.nvm'
    ];

    console.log(args);

    var vSFM = spawn(COMMAND, args);

    vSFM.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    vSFM.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    vSFM.on('close', function (code) {
      console.log('done');
    });

}
