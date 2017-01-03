var Promise = require('bluebird')
var sharp = require('sharp')
var request = require('request').defaults({ encoding: null });

var targetThubmnailDimension = 100


var toByteArray = function (buffer) {
  return Array.prototype.slice.call(buffer, 0)
}


module.exports = function createThumbnail (name, url) {
  console.log(name, url)
  return new Promise(function (resolve, reject) {
    request.get(url, function (err, res, body) {
      if (err) return reject(err);
      var promises = {};

      // var meta = sizeOf(body);

      // Now for every image size, we perform the transform with the sharp library
      var transformer = sharp(body)
        .resize(targetThubmnailDimension, targetThubmnailDimension)
        .crop(sharp.strategy.entropy);

      // Compress and perform the transform.
      transformer
        // .quality(90)
        .toBuffer()
        .then(function(outputBuffer) {
          // Once done, we upload the file into the Parse!
          var parseFile = new Parse.File(name, toByteArray(outputBuffer))
          parseFile.save().then(function() {
            console.log(parseFile)
            resolve(parseFile)
            // The file has been saved to Parse.
          }, reject);
        }).catch(reject);
    });
  })
}


