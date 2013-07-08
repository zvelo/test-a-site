express = require("express")
http    = require("http")
path    = require("path")
app     = express()

# all environments
app.set "port", process.env.PORT or 3000
app.use express.favicon()
app.use express.logger("dev")
app.use express.bodyParser()
app.use express.methodOverride()
app.use app.router
app.use express.static(path.join(__dirname, "public"))
app.use "/js/vendor/when",     express.static(path.join(__dirname, "./node_modules/when"))
app.use "/js/vendor/hashmash", express.static(path.join(__dirname, "./node_modules/hashmash"))
app.use "/js/vendor/zvelonet", express.static(path.join(__dirname, "./node_modules/zveloNET.js"))
app.use "/js/vendor",          express.static(path.join(__dirname, "./node_modules/handlebars/dist"))

# development only
app.use express.errorHandler()  if "development" is app.get("env")

app.get "/", (req, res) -> res.redirect "/index.html"

http.createServer(app).listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")
