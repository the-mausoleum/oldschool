'use strict';

var grep = function (array, key, value) {
    for (var i in array) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
};