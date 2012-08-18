"use strict";

function table(rowset) {
    var t = '',
        tablen = rowset.length,
        header = [],
        col,
        i,
        j;

    if (!tablen) {
        return;
    }

    t += '<table>';
    t += '<tr>';

    for (col in rowset[0]) {
        if (rowset[0].hasOwnProperty(col)) {
            header.push(col);
            t += '<td><strong>' + col + '</strong></td>';
        }
    }

    t += '</tr>';

    for (i = 0; i < tablen; i++) {
        t += '<tr>';

        for (j = 0; j < header.length; j++) {
            t += '<td>' + rowset[i][header[j]] + '</td>';
        }

        t += '<td><input type="text" ' +
            'onkeydown="' +
                'if (event.keyCode === 13) ' +
                    'setStock(' + i + ', this.value)' +
            '"/></td>';
        t += '</tr>';
    }

    t += '</table>';

    return t;
}
