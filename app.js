var express = require('express')
  , http = require('http')
  , path = require('path')
  , ytv = require('./services/ytv.js');

var app = express()
  , server;

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
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.render('index', {title: 'ytv'});
});

app.get('/player', function (req, res) {
  res.render('player', {title: 'player'});
});

app.get('/id/:id', function (req, res) {
  res.render('detail', {
    title: 'detail',
    id: req.params.id
  });
});

app.get('/search', function (req, res) {
  res.render('search', {title: 'search'});
});

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
ytv.install(server, '/dnode');
