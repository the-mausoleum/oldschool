'use strict';

var xp, sum, last, diff;

for (var level = 1; level < 100; level++) {
    last = xp;
    sum = 0;

    for (var x = 1; x <= level - 1; x++) {
        sum += Math.floor(x + 300 * Math.pow(2, x / 7));
    }

    xp = Math.floor(sum / 4);

    diff = xp - last;

    console.log(level, xp, diff);
}