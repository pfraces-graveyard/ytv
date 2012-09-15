var domready = require('domready')
  , shoe = require('shoe')
  , dnode = require('dnode');

domready(function () {
  var stream = shoe('/dnode')
    , d = dnode()
    , g = document
    , rem;
  
  g.play = function (id) {
    rem.play(id);
  };

  g.pause = function () {
    rem.pause();
  };

  d.on('remote', function (remote) {
    remote.subscribe({type: 'rc_detail'}, function () {
      rem = remote;
    });
  });
  d.pipe(stream).pipe(d);
});
