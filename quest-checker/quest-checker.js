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

            var tracker = new Quests(JSON.parse(data), stats);

            tracker.completeQuests(['black-knights-fortress', 'cooks-assistant', 'creature-of-fenkenstrain', 'demon-slayer', 'druidic-ritual', 'dorics-quest', 'the-digsite', 'dragon-slayer', 'elemental-workshop-1', 'elemental-workshop-2', 'fishing-contest', 'goblin-diplomacy', 'imp-catcher', 'the-knights-sword', 'pirates-treasure', 'priest-in-peril', 'prince-ali-rescue', 'the-restless-ghost', 'romeo-and-juliet', 'rune-mysteries', 'sheep-shearer', 'a-souls-bane', 'tears-of-guthix', 'vampire-slayer', 'waterfall-quest', 'witchs-potion', 'nature-spirit']);

            console.log(tracker.listRequirements('lunar-diplomacy'));
            console.log(tracker.computeTotalRequirements('lunar-diplomacy'));

            console.log(tracker.recommendNext());

            var xp = new XP();
        });
    });
}).end();
