var express = require('express')
  , http = require('http')
  , path = require('path')
  , bundler = require('./bundler.js')
  , routes = require('./services/routes.js')
  , ytv = require('./services/ytv.js');

var app = express()
  , server;

bundler.generate('player');
bundler.generate('search');
bundler.generate('detail');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});

routes.install(app);

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

ytv.install(server, '/dnode');
