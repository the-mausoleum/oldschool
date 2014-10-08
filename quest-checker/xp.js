'use strict';

var xp, sum, last, diff;

for (var i = 1; i < 100; i++) {
    last = xp;
    sum = 0;

    for (var j = 1; j <= i - 1; j++) {
        sum += Math.floor(j + 300 * Math.pow(2, j / 7));
    }

    xp = Math.floor(sum / 4);

    diff = xp - last;

    console.log(i, xp, diff);
}