#!/usr/bin/node
"use strict";

/*
    thief-cli.js - thief-runner command-line interface

    usage:
    
        $ cat /path/to/tests/*.tc.js | thief-cli.js
*/

var net = require('net');

var host = '127.0.0.1',
    port = 1335;

var client = new net.Socket();

client.connect(port, host, function () {
    var reqcount = 0;
    
    process.stdin.resume();
    process.stdin.on('data', function (chunk) {
        client.write(JSON.stringify({
            'js': chunk + ''
        }));
    });

    client.on('data', function (data) {
        var pkg = JSON.parse('[' + ('' + data).replace(/^, /, '') + ']')
          , pkglen = pkg.length
          , i;

        for (i = 0; i < pkglen; i++) {
            console.log(
                'req: ' + reqcount
              + '\tpkg: ' + i
              + '\tcli: ' + pkg[i].id
              + '\tmsg: ' + pkg[i].data
            );
        }

        reqcount++;
    });
});
