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
          , view = '<ul>\n'
          , i;

        for (i = 0; i < len; i++) {
          view += '<li>\n'
            + '<div class="list-item">\n'
            + '<a href="/rc/' + data[i].id + '">\n'
            + '<div style="float:left; padding-right:5px">\n'
            + '<img src="' + data[i].thumb + '" />\n'
            + '</div>\n'
            + '<div>\n'
            + '<ul>\n'
            + '<li>\n'
            + '<strong>' + data[i].title + '</strong>'
            + '</li>\n'
            + '<li>\n'
            + data[i].seconds
            + '</li>\n'
            + '</ul>\n'
            + '</div>\n'
            + '<div style="clear:both"></div>\n'
            + '</a>\n'
            + '</div>\n'
            + '</li>\n'
        }

        document.getElementById("results").innerHTML = view;
      }); 
    }
  };

  d.on('remote', function (remote) {
    remote.subscribe({type: 'rc'}, function () {
      rem = remote;
    });
  });
  d.pipe(stream).pipe(d);
});
