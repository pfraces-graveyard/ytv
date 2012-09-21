var derby = require('derby')
  , app = derby.createApp(module)
  , get = app.get
  , view = app.view
  , ready = app.ready;

derby.use(require('../../ui'));

get('/', function(page, model, params) {
  page.render({
    title: 'ytv'
  });
});

ready(function(model) {
});
