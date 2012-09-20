var domready = require('domready')
  , shoe = require('shoe')
  , dnode = require('dnode')
  , ko = require('knockout-client');

domready(function () {
  var stream = shoe('/dnode')
    , server
    , model
    , ytplayer;

  window.onYouTubePlayerReady = function (playerId) {
    model.message('player loaded');
    ytplayer = document.getElementById("myytplayer");
  }

  var d = dnode({
    play: function (id) {
      if (ytplayer) {
        ytplayer.loadVideoById(id, 0, 'default');
      } else {
        var params = {allowScriptAccess: "always"};
        var atts = {id: "myytplayer"};
        try {
          swfobject.embedSWF('http://www.youtube.com/v/' + id + '?enablejsapi=1'
            + '&playerapiid=ytplayer&version=3&controls=0&autoplay=1', 
            'ytapiplayer', '100%', '100%', '8', null, null, params, atts);
          model.message('loading player');
        } catch (e) {
          model.message(e);
        }
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
      server = remote;
    });
  });
  d.pipe(stream).pipe(d);

  function ViewModel() {
    var self = this;

    self.message = ko.observable('waiting for data');
  };
  model = new ViewModel();
  ko.applyBindings(model);
});
