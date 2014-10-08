'use strict';

var http = require('http');
var fs = require('fs');

var hiscoresUrl = 'http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=';

var playerName = 'Max Deviant';

http.get(hiscoresUrl + playerName, function (res) {
    var data = [];

    res.on('data', function (chunk) {
        data.push(chunk);
    });

    res.on('end', function () {
        var stats = extractStats(data.join().split('\n'));

        fs.readFile('quests.json', 'utf8', function (err, data) {
            if (err) {
                console.log(err);

                return;
            }

            var questList = JSON.parse(data);

            var tracker = new Quests(questList);

            console.log(tracker.findAvailable(stats));
        });
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
            rank: row[0],
            level: row[1],
            xp: row[2]
        };
    }

    return stats;
}

function grep (array, key, value) {
    for (var i in array) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
};

var Quests = function (questList) {
    this.list = questList;

    this.findAvailable = function (stats) {
        var available = [];

        for (var i in this.list) {
            var canDo = true;
            var skillReqs = this.list[i].requirements.skills;

            for (var j in skillReqs) {
                if (stats[j].level < skillReqs) {
                    canDo = false;
                }
            }

            if (canDo) {
                available.push(this.list[i].slug);
            }
        }

        return available;
    };
};
