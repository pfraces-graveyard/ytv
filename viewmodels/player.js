var domready = require('domready')
  , shoe = require('shoe')
  , dnode = require('dnode');

domready(function () {
  var stream = shoe('/dnode')
    , rem;

  var d = dnode({
    play: function (id) {
      if (ytplayer) {
        ytplayer.loadVideoById(id, 0, 'default');
      } else {
        var params = {allowScriptAccess: "always"};
        var atts = {id: "myytplayer"};
        swfobject.embedSWF('http://www.youtube.com/v/' + id + '?enablejsapi=1'
          + '&playerapiid=ytplayer&version=3&controls=0&autoplay=1', 
          'ytapiplayer', '100%', '100%', '8', null, null, params, atts);
      }
    },
    pause: function () {
      if (ytplayer.getPlayerState() === 1) {
        ytplayer.pauseVideo();
      } else {
        ytplayer.playVideo();
      }
    }
  });
  d.on('remote', function (remote) {
    remote.subscribe({type: 'tv'}, function () {
      rem = remote;
    });
  });
  d.pipe(stream).pipe(d);
});
