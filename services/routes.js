var install = function (app) {
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
};

exports.install = install;
