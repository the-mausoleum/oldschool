'use strict';

angular.module('OldSchool')
    .controller('StatsCtrl', ['$scope', '$http', function ($scope, $http) {
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

        var player = 'Max Deviant';

        $http.get('http://localhost:3000/stats/' + player)
            .success(function (data, status, headers, config) {
                $scope.stats = data;
            }).error(function (data, status, headers, config) {
                console.log(data);
            });

        $scope.generateTooltip = function (skill, exp) {
            skill = skill.charAt(0).toUpperCase() + skill.slice(1);

            var tooltip = skill + ' XP: ' + exp + '\u000ANext level at: ' + NaN + '\u000ARemaining XP: ' + NaN;

            return tooltip;
        };
    }]);