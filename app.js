var express = require('express')
  , http = require('http')
  , path = require('path')
  , shoe = require('shoe')
  , dnode = require('dnode');

var app = express()
  , server
  , sock
  , clients = [];

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

sock = shoe(function (stream) {
  var d = dnode(function (client) {
    function webGet (_url, cb) {
      var http = require('http');
      var url = require('url');
      var buf = '';

      var req = http.request(url.parse(_url), function (res) {
        res.on('data', function (chunk) {
          buf += chunk;
        });
        res.on('end', function () {
          cb(buf);
        });
      });
      req.end();
    }

    this.subscribe = function (props, cb) {
      props.dnode = client;
      clients.push(props);
      cb();
    };

    this.ytvsearch = function (terms, start, cb) {
      var MAX_RESULTS = 5;

      var results = []
        , url = 'http://gdata.youtube.com/feeds/api/videos?'
          + 'q=' + terms.replace(' ', '+')
          + '&start-index=' + start
          + '&max-results=' + MAX_RESULTS
          + '&v=2'
          + '&alt=json';

      webGet(url, function (data) {
        var res = JSON.parse(data)
          , entry = res.feed.entry || []
          , entryCount = entry.length
          , i
          , itemRaw
          , item;

        for (var i = 0; i < entryCount; i++) {
          itemRaw = entry[i].media$group;
          item = {
            id: itemRaw.yt$videoid.$t,
            title: itemRaw.media$title.$t,
            seconds: itemRaw.yt$duration.seconds,
            thumb: itemRaw.media$thumbnail[0].url
          }
          results.push(item);
        }

        cb(results);
      });
    };

    this.play = function (id) {
      var i;

      for (i = 0; i < clients.length; i++) {
        if (clients[i].type === 'tv') {
          clients[i].dnode.play(id);
        }
      }
    };

    this.pause = function () {
      var i;

      for (i = 0; i < clients.length; i++) {
        if (clients[i].type === 'tv') {
          clients[i].dnode.pause();
        }
      }
    };
  });
  d.pipe(stream).pipe(d);
});
sock.install(server, '/dnode');
