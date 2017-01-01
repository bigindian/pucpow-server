// This helper function will get all the values from the Parse DB extending
// the 1000 limit.
// http://blog.benoitvallon.com/tips/the-parse-1000-objects-limit/
var recursiveQuery = function (query, batchNumber, allObjects) {
  function simpleQuery (query, batchNumber) {
    query.limit(1000)
    query.skip(batchNumber * 1000)
    return query.find().then(
      function (objects) {
        return objects.map(function (object) {
          var ret = object.toJSON()
          ret.createdAtUTC = object.get('createdAt').getTime()

          if (object.get("parent") != null) {
            ret.parent = object.get("parent").id
          }

          return ret
        })
      },
      function (error) { return error }
    )
  }

  return simpleQuery(query, batchNumber).then(function (objects) {
    // concat the intermediate objects into the final array
    allObjects = allObjects.concat(objects)

    // if the objects length is 1000, it means that we are not at the end of the list
    if (objects.length === 1000) {
      batchNumber = batchNumber + 1
      return recursiveQuery(query, batchNumber, allObjects)
    } else { return allObjects }
  })
}


module.exports = recursiveQuery
