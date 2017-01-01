var validator = require("validator")
var getVehicleMasterList = require('./getVehicleMasterList')
var Promise = require('bluebird')


/**
 * Download a list of all the vehicles.
 */
Parse.Cloud.define("getVehicles", function(request, response) {
  getVehicleMasterList().then(response.success, response.error)
});


/**
 * Given a user, if the user was set to change his password, reset it manuallt.
 */
Parse.Cloud.define("signupAddedUser", function(request, response) {
  response.success({})
})
