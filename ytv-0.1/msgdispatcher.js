"use strict";

var net = require('net');

var BROWSER_PORT = 1336
  , CLI_PORT = 1335;

var cli_server = net.createServer()
  , browser = []
  , client;

function browserBroadcast(data) {
    var i;

    for (i = 0; i < browser.length; i++) {
        browser[i].write(data);
    }
}

function clientWrite(data) {
    client.write(data);
}

net.createServer(function (socket) {
    var index = browser.push(socket) - 1;

    socket.on('close', function(data) {
        browser.splice(index, 1);
    });

    socket.on('data', function (data) {
        clientWrite(data);
    });
})
    .listen(BROWSER_PORT, function() {
        console.log('tcp server running at port ' + BROWSER_PORT);
    });

net.createServer(function (socket) {
    client = socket;

    socket.on('data', function(data) {
        browserBroadcast(data);
    });
})
    .listen(CLI_PORT, function() {
        console.log('tcp server running at port ' + CLI_PORT);
    });
