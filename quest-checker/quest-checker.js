'use strict';

var http = require('http');

var hiscoresUrl = 'http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=';

var playerName = 'Max Deviant';

http.get(hiscoresUrl + playerName, function (res) {
    var data = [];

    res.on('data', function (chunk) {
        data.push(chunk);
    });

    res.on('end', function () {
        console.log(extractStats(data.join().split('\n')));
    });
}).end();

function extractStats(raw) {
    var stats = {};

    var skills = [
        'overall',
        'attack',
        'defence',
        'strength',
        'constitution',
        'ranged',
        'prayer',
        'magic',
        'cooking',
        'woodcutting',
        'fletching',
        'fishing',
        'firemaking',
        'crafting',
        'smithing',
        'mining',
        'herblore',
        'agility',
        'thieving',
        'slayer',
        'farming',
        'runecrafting',
        'hunter',
        'construction'
    ];

    for (var i in skills) {
        var row = raw[i].split(',');

        stats[skills[i]] = {
            'rank': row[0],
            'level': row[1],
            'xp': row[2]
        };
    }

    return stats;
}