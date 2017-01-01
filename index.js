/**
 * This is the start point for the Parse backend for the  service.
 *
 * It runs parse on the "/parse" endpoint and runs the parse dashbaord on the
 * "/dashboard" endpoint.
 */
var _ = require("underscore")
var morgan = require('morgan')
var express = require("express")
var fs = require("fs")
var packageJson = require("./package")
var ParseDashboard = require("parse-dashboard")
var ParseServer = require("parse-server").ParseServer
var path = require("path")
var S3Adapter = require("parse-server").S3Adapter
var configureLogger = require("parse-server/lib/logger").configureLogger
var config = require("./config")


// Prepare the local variables with options from the config file.
var port = config("PORT")
var rootUrl = config("ROOT_URL")
var parseMountPath = config("PARSE_MOUNT")
var dashboardMountPath = config("DASHBOARD_MOUNT")
var parseServerUrl = rootUrl + parseMountPath
var localParseUrl = "http://localhost:" + port + parseMountPath
var parseDashboardUrl = rootUrl + dashboardMountPath
var parseDashboardInsecure = config("DASHBOARD_INSECURE") || false
var cloudCodeDirectory = path.join(__dirname, "/cloud/main.js")

// Create the final config options
var configParse = {
  databaseURI: config("DATABASE_URI"),
  appId: config("APP_ID"),
  masterKey: config("MASTER_KEY"),
  clientKey: config("CLIENT_KEY"),

  cloud: cloudCodeDirectory,
  serverURL: localParseUrl,

  // Config the S3 files adapter for uploading to an S3 bucket
  filesAdapter: new S3Adapter(
    config("S3_ACCESS_KEY"),
    config("S3_SECRET_KEY"),
    config("S3_BUCKET"), {
      "region": config("S3_REGION"),
      "bucketPrefix": "",
      "directAccess": true
    }
  )
}

var configDashboard = {
  users: [
    {
      user: "admin",
      pass: config("DASHBOARD_PASS")
    }
  ],
  allowInsecureHTTP: parseDashboardInsecure,
  apps: [
    {
      "serverURL": parseServerUrl,
      "appId": configParse.appId,
      "masterKey": configParse.masterKey,
      "appName": packageJson.name
    }
  ]
}

console.log("running version:", packageJson.version)


// Create an express instance
var app = express()

app.use(morgan('combined'))

// Create the parse server and serve it at the "/parse" route
var parseApi = new ParseServer(configParse)
app.use(parseMountPath, parseApi)


// Create the dashboard and make it available at "/dashboard"
var allowInsecureHTTP = configDashboard.allowInsecureHTTP
var dashboard = new ParseDashboard(configDashboard, allowInsecureHTTP)
app.use(dashboardMountPath, dashboard)


// Also print warnings!
configureLogger({ level: "info" })


// Parse Server plays nicely with the rest of your web routes
app.get("/", function (req, res) {
  // Helper function to proper parse the time
  var toHHMMSS = function (value) {
    var secNum = parseInt(value, 10) // don"t forget the second param
    var hours = Math.floor(secNum / 3600)
    var minutes = Math.floor((secNum - (hours * 3600)) / 60)
    var seconds = secNum - (hours * 3600) - (minutes * 60)

    if (hours   < 10) hours = "0" + hours
    if (minutes < 10) minutes = "0" + minutes
    if (seconds < 10) seconds = "0" + seconds

    return hours + ":" + minutes + ":" + seconds
  }

  res.json({
    status: "online",
    uptime: toHHMMSS(process.uptime() + "")
  })
})


// Launch the express server!
var httpServer = require("http").createServer(app)
httpServer.listen(port, function () {
  console.log("parse server running on " + parseServerUrl)
  console.log("parse dashboard running on " + parseDashboardUrl)
})
