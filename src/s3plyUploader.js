var s3 = require('s3');
var Q = require('q');
var path = require('path');
// setup the client
var client = s3.createClient({
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
});

module.exports = function uploadToS3(id, fsPath) {
    var deferred = Q.defer();


    var remoteFile = path.basename(fsPath);
    var bucketName = process.env.S3_BUCKET;
    var key = "models/" + id + '/' + remoteFile;


    var params = {
      localFile: fsPath,

      s3Params: {
        Bucket: bucketName,
        Key: key,
        ACL: 'public-read'
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      },
    };

    var fileUrl = s3.getPublicUrl(bucketName, key, "eu-west-1")

    var uploader = client.uploadFile(params);
    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
    });
    uploader.on('progress', function() {
      console.log("progress", uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
      console.log("done uploading", arguments);
      deferred.resolve(fileUrl);
    });

    return deferred.promise;
};
