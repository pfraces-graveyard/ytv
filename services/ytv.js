var shoe = require('shoe')
  , dnode = require('dnode');

var clients = [];
var sock = shoe(function (stream) {
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

exports.install = sock.install;
