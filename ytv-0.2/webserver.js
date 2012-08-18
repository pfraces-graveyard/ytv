var http = require('http')
  , fs = require('fs')
  , path = require('path');

function contentType(ext) {
    var ct;

    switch (ext) {
    case '.html':
        ct = 'text/html';
        break;
    case '.css':
        ct = 'text/css';
        break;
    case '.js':
        ct = 'text/javascript';
        break;
    default:
        ct = 'text/plain';
        break;
    } 

    return {'Content-Type': ct};
}

function createHttpServer (index) {
    var HTTP_OK = 200
      , HTTP_ERR_UNKNOWN = 500
      , HTTP_ERR_NOT_FOUND = 404;

    return http.createServer(function (req, res) {
        var filepath = '.' + (req.url == '/' ? index : req.url),
            fileext = path.extname(filepath);

        fs.exists(filepath, function (f) {
            if (f) {
                fs.readFile(filepath, function (err, content) {
                    if (err) {
                        res.writeHead(HTTP_ERR_UNKNOWN);
                        res.end();
                    } else {
                        res.writeHead(HTTP_OK, contentType(fileext));
                        res.end(content);
                    }
                });
            } else {
                res.writeHead(HTTP_ERR_NOT_FOUND);
                res.end();
            }
        });
    });
}

function webGet(_url, callback) {
  var http = require('http');
  var url = require('url');
  var buf = '';

  var req = http.request(url.parse(_url), function (res) {
    res.on('data', function (chunk) {
      buf += chunk;
    });
    res.on('end', function () {
      callback(buf);
    });
  });
  req.end();
}

function ytSearch (query, start, max, ws, callback) {
  var results = []
    , url = 'http://gdata.youtube.com/feeds/api/videos?'
      + 'q=' + query.replace(' ', '+')
      + '&start-index=' + start
      + '&max-results=' + max
      + '&v=2'
      + '&alt=json';

  webGet(url, function (data) {
    var res = JSON.parse(data)
      , entry = res.feed.entry
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

      callback(results, ws);
  });
}

function startWebServer(port, index) {
  var WebSocket = require('faye-websocket');

  createHttpServer(index)
    .addListener('upgrade', function (request, socket, head) {
      var ws = new WebSocket(request, socket, head);
  
      ws.onmessage = function(ev) {
        ytSearch(ev.data, 1, 5, ws, render);
      };
    })
    .listen(port, function() {
        console.log('http server running at port ' + port);
    });
}

function render (res, ws) {
  var len = res.length
    , i
    , html = '<ul style="list-style-type:none;padding:0">\n';

  for (i = 0; i < len; i++) {
    html += '<li onClick="alert(\'' + res[i].id + '\')">\n';
    html += '<div style="margin:5px;padding:5px;background-color:white">\n';
    html += '<div style="float:left">\n';
    html += '<img src="' + res[i].thumb + '" />\n';
    html += '</div>\n';
    html += '<div style="float:left">\n';
    html += '<ul style="list-style-type:none;padding-left:5px">\n';
    html += '<li>\n';
    html += '<strong>' + res[i].title + '</strong>';
    html += '</li>\n';
    html += '<li>\n';
    html += res[i].seconds;
    html += '</li>\n';
    html += '<li>\n';
    html += res[i].id;
    html += '</li>\n';
    html += '</ul>\n';
    html += '</div>\n';
    html += '<div style="clear:both"></div>\n';
    html += '</div>\n';
    html += '</li>\n';
  }

  html += '</ul>\n';
  ws.send(html);
}

startWebServer(5000, '/index.html')
