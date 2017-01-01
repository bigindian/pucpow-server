var _ = require('underscore')
var recursiveQuery = require('./recursiveQuery')


var cache = null
var getVehicleMasterList = function () {
  var results = {}
  var promises = []
  var queries = []

  // if a cache was set, then we return it
  if (cache != null) return Parse.Promise.when(cache)

  // Helper function to get the query values
  function getQuery (className) {
    var allAlbums = []
    var Class = Parse.Object.extend(className)
    var query = new Parse.Query(Class)
    return recursiveQuery(query, 0, allAlbums).then()
  };

  // Start quering the values..
  promises.push(getQuery('VehicleManufacturers'))
  promises.push(getQuery('VehicleModels'))
  promises.push(getQuery('VehicleMakes'))

  return Parse.Promise.when(promises)
  .then(function (results) {
    var vehicleManufacturers = results[0]
    var vehicleModels = results[1]
    var vehicleMakes = results[2]

    _.each(vehicleMakes, function(make) {
      if (make.model == null) return

      var modelObjectId = make.model.objectId
      var foundModel = _.findWhere(vehicleModels, {objectId: modelObjectId})

      if (foundModel == null) return

      if (foundModel.makes == null) foundModel.makes = []
      foundModel.makes.push(make)
      delete make.model
    })

    _.each(vehicleModels, function(model) {
      if (model.manufacturer == null) return

      var manufacturerObjectId = model.manufacturer.objectId
      var foundManufacturer = _.findWhere(vehicleManufacturers, {objectId: manufacturerObjectId})

      if (foundManufacturer == null) return

      if (foundManufacturer.models == null) foundManufacturer.models = []
      foundManufacturer.models.push(model)
      delete model.manufacturer
    })

    // Save into the cache and set an expiry timeout of 1 min
    cache = vehicleManufacturers
    setTimeout(function () { cache = null },  60000)

    return vehicleManufacturers
  })
}


module.exports = getVehicleMasterList
