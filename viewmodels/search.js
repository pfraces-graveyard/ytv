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
    self.moreData = ko.observable(false);
    self.results = ko.observableArray([]);

    self.getResults = function () {
      var start = self.results().length + 1;
      server.ytvsearch(self.terms(), start, function (data) {
        if (!data.length) {
          self.moreData(false);
        }

        for (var k in data) {
          self.results.push(new SearchResult(data[k]));
        }
      });
    };
    
    self.search = function () {
      self.results([]);
      self.moreData(true);
      self.getResults();
    };
  };
  model = new ViewModel();
  ko.applyBindings(model);
});
