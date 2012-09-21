var http = require('http')
  , path = require('path')
  , express = require('express')
  , gzippo = require('gzippo')
  , derby = require('derby')
  , app = require('../app')
  , serverError = require('./serverError');


var expressApp = express()
  , server = module.exports = http.createServer(expressApp);

derby.use(derby.logPlugin);
var store = derby.createStore({listen: server});

var root = path.dirname(path.dirname(__dirname))
  , publicPath = path.join(root, 'public');

expressApp
  .use(express.favicon())
  .use(gzippo.staticGzip(publicPath))
  .use(express.compress())
  .use(store.modelMiddleware())
  .use(app.router())
  .use(expressApp.router)
  .use(serverError(root));

expressApp.all('*', function(req) {
  throw '404: ' + req.url;
});
