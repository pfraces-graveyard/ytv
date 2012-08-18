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

function ytSearch (query, start, max, callback) {
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

      callback(results);
  });
}


var argString = ''
  , argc = process.argv.length
  , i;

for (i= 2; i < argc; i++) {
  argString += process.argv[i] + ' ';
}

ytSearch(argString, 1, 5, function (res) {
  var len = res.length
    , i
    , html = '<html style="background-color:lightgrey">'
      + '<ul style="list-style-type:none;padding:0">\n';

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
  console.log(html);
});
