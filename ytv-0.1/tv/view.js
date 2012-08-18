/*jslint browser:true */
"use strict";

var url = 'ws://' + document.location.host,
    conn = new WebSocket(url);

conn.onopen = function () {};

conn.onmessage = function (ev) {
    var req = JSON.parse(ev.data)
      , target = document.getElementById('content')
      //, res = eval(req.js);
	  , res = req.js;
    
    target.innerHTML = '<embed src="https://www.youtube.com/v/' + res + '?autoplay=1&controls=0&version=3" type="application/x-shockwave-flash" allowfullscreen="true"  allowScriptAccess="always" width="100%" height="100%"></embed>';
};
