var fs = require('fs');


/**
 * The various default values
 * @type {Object}
 */
var defaults = {
  SITE_NAME: 'PUC POW',
  PORT: 1234,
  PARSE_MOUNT: '/parse',
  DASHBOARD_MOUNT: '/parse-dashboard'
};


/**
 * Helper function to get the config values.
 */
var config = function (key) {
  var configJson = {};
  var configFile = __dirname + '/secrets.json'
  if (fs.existsSync(configFile)) configJson = require(configFile);

  if (process.env[key] != null) return process.env[key];
  else if (configJson[key] != null) return configJson[key];
  else if (defaults[key] != null) return defaults[key];
  else console.warn(key + ' not set in environment');
  return 'replace me'
}


module.exports = config;
