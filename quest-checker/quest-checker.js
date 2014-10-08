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

            var tracker = new Quests(questList, stats);

            tracker.completeQuests(['death-plateau', 'troll-stronghold'])

            console.log(tracker.listRequirements('troll-romance'));

            console.log(tracker.hasRequirements('troll-romance'));

            console.log(tracker.findAvailable());
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

var Quests = function (questList, stats) {
    this.list = questList;
    this.stats = stats;
    this.completed = {};

    this.findQuest = function (questName) {
        return grep(this.list, 'slug', questName) || grep(this.list, 'name', questName);
    };

    this.findAvailable = function () {
        var available = [];

        for (var i in this.list) {
            var canDo = true;
            var skillReqs = this.list[i].requirements.skills;
            var questReqs = this.list[i].requirements.quests;

            if (this.completed[this.list[i].slug]) {
                continue;
            }

            if (this.hasRequirements(this.list[i].slug)) {
                available.push(this.list[i].slug);
            }
        }

        return available;
    };

    this.listRequirements = function (questName) {
        var quest = this.findQuest(questName);

        return quest.requirements;
    };

    this.hasRequirements = function (questName) {
        var hasStats = true;
        var hasQuests = true;

        var quest = this.findQuest(questName);

        var skillReqs = quest.requirements.skills;
        var questReqs = quest.requirements.quests;

        for (var i in skillReqs) {
            if (this.stats[i].level < skillReqs[i]) {
                hasStats = false;
            }
        }

        for (var i in questReqs) {
            if (!this.completed[questReqs[i]]) {
                hasQuests = false;
            }
        }

        return hasStats && hasQuests;
    };

    this.completeQuest = function (quest) {
        this.completeQuests([quest]);
    };

    this.completeQuests = function (quests) {
        for (var i in quests) {
            this.completed[quests[i]] = true;
        }
    };
};
