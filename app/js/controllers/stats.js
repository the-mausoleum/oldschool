'use strict';

angular.module('OldSchool')
    .controller('StatsCtrl', ['$scope', '$filter', '$http', 'XP', function ($scope, $filter, $http, XP) {
        $scope.skills = {
            1: [
                'attack',
                'strength',
                'defence',
                'ranged',
                'prayer',
                'magic',
                'runecrafting',
                'construction'
            ],
            2: [
                'constitution',
                'agility',
                'herblore',
                'thieving',
                'crafting',
                'fletching',
                'slayer',
                'hunter'
            ],
            3: [
                'mining',
                'smithing',
                'fishing',
                'cooking',
                'firemaking',
                'woodcutting',
                'farming'
            ]
        };

        $scope.player = 'Max Deviant';

        $scope.lookup = function () {
            $http.get('http://localhost:3000/stats/' + $scope.player)
                .success(function (data, status, headers, config) {
                    $scope.stats = data;
                }).error(function (data, status, headers, config) {
                    console.log(data);
                });
        };

        $scope.generateTooltip = function (skill, exp) {
            var xp = new XP();

            skill = skill.charAt(0).toUpperCase() + skill.slice(1);

            var currLevel = xp.getLevel(exp);

            var tooltip = skill + ' XP: ' + $filter('exp')(exp) + '\u000ANext level at: ' + $filter('exp')(xp.atLevel(currLevel)) + '\u000ARemaining XP: ' + $filter('exp')(xp.forLevel(currLevel, exp));

            return tooltip;
        };

        $scope.lookup();
    }]);