var domready = require('domready')
  , shoe = require('shoe')
  , dnode = require('dnode');

domready(function () {
  var stream = shoe('/dnode')
    , d = dnode()
    , g = document
    , rem;
  
  g.search = function (inField, e) {
    var charCode;
    
    if (e && e.which) {
      charCode = e.which;
    } else if (window.event) {
      e = window.event;
      charCode = e.keyCode;
    }

    if (charCode == 13) {
      rem.ytvsearch(inField.value, 1, 5, function (data) {
        var len = data.length
          , view = '<ul style="list-style-type:none;padding:0">\n'
          , i;

        for (i = 0; i < len; i++) {
          view += '<li onClick="play(\'' + data[i].id + '\')">\n'
            + '<div style="margin:5px;padding:5px;background-color:white">\n'
            + '<div style="float:left">\n'
            + '<img src="' + data[i].thumb + '" />\n'
            + '</div>\n'
            + '<div style="float:left">\n'
            + '<ul style="list-style-type:none;padding-left:5px">\n'
            + '<li>\n'
            + '<strong>' + data[i].title + '</strong>'
            + '</li>\n'
            + '<li>\n'
            + data[i].seconds
            + '</li>\n'
            + '<li>\n'
            + data[i].id
            + '</li>\n'
            + '</ul>\n'
            + '</div>\n'
            + '<div style="clear:both"></div>\n'
            + '</div>\n'
            + '</li>\n'
        }

        document.getElementById("results").innerHTML = view;
      }); 
    }
  };

  g.play = function (id) {
    rem.play(id);
  };

  d.on('remote', function (remote) {
    remote.subscribe({type: 'rc'}, function () {
      rem = remote;
    });
  });
  d.pipe(stream).pipe(d);
});
