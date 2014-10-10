'use strict';

angular.module('OldSchool')
    .controller('QuestsCtrl', ['$scope', '$stateParams', '$http', 'grep', 'Quests', function ($scope, $stateParams, $http, grep, Quests) {
        $scope.quests = [];
        $scope.completed = {};

        $scope.slug = $stateParams.slug;

        $http.get('../data/quests.json')
            .success(function (data, status, headers, config) {
                $scope.quests = data;

                if ($stateParams.slug) {
                    $scope.quest = grep($scope.quests, 'slug', $stateParams.slug);
                    $scope.subquests = {};

                    for (var i in $scope.quest.requirements.quests) {
                        var slug = $scope.quest.requirements.quests[i];

                        $scope.subquests[slug] = grep($scope.quests, 'slug', slug);
                    }
                }
            })
            .error(function (data, status, headers, config) {
                console.log(data);
            });

        $scope.updateQuestList = function (slug) {
            
        };
    }]);