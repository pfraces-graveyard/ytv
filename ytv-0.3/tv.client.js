var domready = require('domready')
  , shoe = require('shoe')
  , dnode = require('dnode');

domready(function () {
  var stream = shoe('/dnode')
    , g = document
    , rem;

  var d = dnode({
    play: function (id) {
      g.getElementById('content').innerHTML = ''
        + '<embed src="https://www.youtube.com/v/' + id
        + '?autoplay=1&controls=0&version=3" '
        + 'type="application/x-shockwave-flash" allowfullscreen="true" '
        + 'allowScriptAccess="always" width="100%" height="100%"></embed>';
    }
  });
  d.on('remote', function (remote) {
    remote.subscribe({type: 'tv'}, function () {
      rem = remote;
    });
  });
  d.pipe(stream).pipe(d);
});
