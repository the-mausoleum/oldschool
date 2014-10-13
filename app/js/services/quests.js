'use strict';

angular.module('OldSchool').factory('Quests', ['grep', 'XP', function (grep, XP) {
    return function (questList, stats) {
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

        this.computeNeededExp = function (questName) {
            var xp = new XP();
            var quest = this.findQuest(questName);
            var skillReqs = quest.requirements.skills;
            var neededExp = {
                total: 0
            };

            for (var i in skillReqs) {
                neededExp[i] = 0;

                if (skillReqs[i] > this.stats[i].level) {
                    neededExp[i] = xp.forLevel(skillReqs[i], this.stats[i].xp);

                    neededExp.total += neededExp[i];
                }
            }

            return neededExp;
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
                var slug = this.list[i].slug;

                neededExp[slug] = this.computeNeededExp(slug).total;
            }

            var lowest = {};

            for (var i in neededExp) {
                if (typeof lowest.xp === 'undefined' || neededExp[i] < lowest.xp) {
                    if (this.hasQuestRequirements(i)) {
                        lowest.quest = i;
                        lowest.xp = neededExp[i];

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
}]);