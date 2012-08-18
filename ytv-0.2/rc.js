var url = 'ws://' + document.location.host,
    conn = new WebSocket(url);

conn.onopen = function () {};

conn.onmessage = function (ev) {
    document.getElementById("results").innerHTML = ev.data;
};

function handleEnter(inField, e) {
    var charCode;
    
    if(e && e.which){
        charCode = e.which;
    }else if(window.event){
        e = window.event;
        charCode = e.keyCode;
    }

    if (charCode == 13) {
      conn.send(inField.value); 
    }
}
