'use strict';

angular.module('OldSchool').factory('XP', [function () {
    return function () {
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
            var newExp = parseInt(currExp) + ((typeof gainedExp !== 'undefined') ? parseInt(gainedExp) : 0);

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
}]);