"use strict";

/*
    thiefd.js

    manages browser testing
*/

var server = require('./git_modules/webserver/webserver.js');

var HTTP_PORT = 1337;
var HTTP_ROOT = '/view.html';

server.start(HTTP_PORT, HTTP_ROOT);
