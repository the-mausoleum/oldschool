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

            console.log(tracker.listRequirements('lunar-diplomacy'))
            console.log(tracker.computeTotalRequirements('lunar-diplomacy'));

            console.log(tracker.recommendNext());

            var xp = new XP();
        });
    });
}).end();

function extractStats(raw) {
    var stats = {};

    var skills = ['overall', 'attack', 'defence', 'strength', 'constitution', 'ranged', 'prayer', 'magic', 'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting', 'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming', 'runecrafting', 'hunter', 'construction'];

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

function grep(array, key, value) {
    for (var i in array) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
}

var XP = function () {
    this.chart = {};

    this.init = function () {
        var xp, sum, last, diff;

        for (var level = 1; level < 100; level++) {
            last = xp;
            sum = 0;

            for (var x = 1; x <= level - 1; x++) {
                sum += Math.floor(x + 300 * Math.pow(2, x / 7));
            }

            xp = Math.floor(sum / 4);

            diff = xp - last;

            this.chart[level] = {
                xp: xp,
                diff: diff
            };
        }
    };

    this.atLevel = function (level) {
        return this.chart[level].xp;
    };

    this.forLevel = function (level, currExp) {
        return this.chart[level].xp - currExp;
    };

    this.getLevel = function (currExp, gainedExp) {
        var newExp = parseInt(currExp) + parseInt(gainedExp);

        for (var i = 1; i < 100; i++) {
            if (newExp >= this.chart[i].xp) {
                continue;
            }

            return i;
        }

        return 99;
    };

    this.init();
};

var Quests = function (questList, stats) {
    this.list = questList;
    this.stats = stats;
    this.completed = {
        count: 0,
        percent: 0,
        list: {}
    };

    this.findQuest = function (questName) {
        return grep(this.list, 'slug', questName) || grep(this.list, 'name', questName);
    };

    this.findAvailable = function () {
        var available = [];

        for (var i in this.list) {
            var canDo = true;
            var skillReqs = this.list[i].requirements.skills;
            var questReqs = this.list[i].requirements.quests;

            if (this.completed.list[this.list[i].slug]) {
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

    this.hasSkillRequirements = function (questName) {
        var hasStats = true;
        var quest = this.findQuest(questName);
        var skillReqs = quest.requirements.skills;

        for (var i in skillReqs) {
            if (this.stats[i].level < skillReqs[i]) {
                hasStats = false;
            }
        }

        return hasStats;
    };

    this.hasQuestRequirements = function (questName) {
        var hasQuests = true;
        var quest = this.findQuest(questName);
        var questReqs = quest.requirements.quests;

        for (var i in questReqs) {
            if (!this.completed.list[questReqs[i]]) {
                hasQuests = false;
            }
        }

        return hasQuests;
    };

    this.hasRequirements = function (questName) {
        return this.hasSkillRequirements(questName) && this.hasQuestRequirements(questName);
    };

    this.completeQuest = function (quest) {
        this.completeQuests([quest]);
    };

    this.completeQuests = function (quests) {
        for (var i in quests) {
            this.completed.list[quests[i]] = true;
            this.completed.count++;
        }
    };

    this.getCompleted = function () {
        return {
            count: this.completed.count,
            percent: Math.round((this.completed.count / this.list.length) * 100),
            quests: Object.keys(this.completed.list)
        };
    };

    this.computeTotalRequirements = function (questName) {
        var quest = this.findQuest(questName);

        var skillReqs = quest.requirements.skills;
        var questReqs = quest.requirements.quests;

        var totalSkills = {};
        var totalQuests = [];

        for (var i in skillReqs) {
            totalSkills[i] = skillReqs[i];
        }

        for (var i in questReqs) {
            var priorReqs = this.computeTotalRequirements(questReqs[i]);

            for (var j in priorReqs.skills) {
                if (typeof totalSkills[j] === 'undefined' || priorReqs.skills[j] > totalSkills[j]) {
                    totalSkills[j] = priorReqs.skills[j];
                }
            }

            for (var j in priorReqs.quests) {
                if (totalQuests.indexOf(priorReqs.quests[j]) === -1) {
                    totalQuests.push(priorReqs.quests[j]);
                }
            }

            if (totalQuests.indexOf(questReqs[i]) === -1) {
                totalQuests.push(questReqs[i]);
            }
        }

        return {
            skills: totalSkills,
            quests: totalQuests
        };
    };

    this.recommendNext = function () {
        var xp = new XP();
        var recommended = [];

        var neededExp = {};

        for (var i in this.list) {
            if (this.completed.list[this.list[i].slug]) {
                continue;
            }

            var skillReqs = this.list[i].requirements.skills;
            var total = 0;

            neededExp[this.list[i].slug] = 0;

            for (var j in skillReqs) {

                if (skillReqs[j] > this.stats[j].level) {
                    neededExp[this.list[i].slug] += xp.forLevel(skillReqs[j], this.stats[j].xp);
                }
            }
        }

        var lowest = {};

        for (var i in neededExp) {
            if (typeof lowest.xp === 'undefined' || neededExp[i] < lowest.xp) {
                lowest.quest = i;
                lowest.xp = neededExp[i];

                if (this.hasQuestRequirements(i)) {
                    recommended.push(i);
                }
            } else if (lowest.xp === neededExp[i]) {
                if (this.hasQuestRequirements(i)) {
                    recommended.push(i);
                }
            }
        }

        return recommended;
    };
};