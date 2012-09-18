var domready = require('domready')
  , shoe = require('shoe')
  , dnode = require('dnode')
  , ko = require('knockout-client');

domready(function () {
  var stream = shoe('/dnode')
    , d = dnode()
    , server
    , model;
  
  d.on('remote', function (remote) {
    remote.subscribe({type: 'rc'}, function () {
      server = remote;
    });
  });
  d.pipe(stream).pipe(d);

  function SearchResult (data) {
    this.url = ko.observable('/id/' + data.id);
    this.thumb = ko.observable(data.thumb);
    this.title = ko.observable(data.title);
    this.seconds = ko.observable(data.seconds);
  }

  function ViewModel() {
    var self = this;

    self.terms = ko.observable();
    self.results = ko.observableArray([]);

    self.search = function () {
      server.ytvsearch(self.terms(), 1, 5, function (data) {
        self.results([]);
        for (var k in data) {
          self.results.push(new SearchResult(data[k]));
        }
      });
    };
  };
  model = new ViewModel();
  ko.applyBindings(model);
});
