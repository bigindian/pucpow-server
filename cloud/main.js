var validator = require("validator")
var getVehicleMasterList = require('./getVehicleMasterList')
var createThumbnail = require('./createThumbnail')
var Promise = require('bluebird')
var sharp = require('sharp')
var request = require('request').defaults({ encoding: null })


/**
 * Download a list of all the vehicles.
 */
Parse.Cloud.define("getVehicles", function(req, res) {
  getVehicleMasterList().then(res.success, res.error)
});


/**
 * Given a user, if the user was set to change his password, reset it manually
 * here.
 */
Parse.Cloud.define("signupAddedUser", function(req, res) {
  res.success({})
})


Parse.Cloud.beforeSave("VehicleDocuments", function(req, res) {
  if (req.object.dirty('document') && req.object.get('document') != null) {
    var doc = req.object.get("document");
    createThumbnail(doc.name(), doc.url())
    .then(function (thumbnail) {
      req.object.set('thumbnail', thumbnail)
      res.success()
    })
    .catch(console.log)
  } else res.success()
})
