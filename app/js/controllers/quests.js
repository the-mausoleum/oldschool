'use strict';

angular.module('OldSchool')
    .controller('QuestsCtrl', ['$scope', '$stateParams', '$http', 'grep', function ($scope, $stateParams, $http, grep) {
        $scope.quests = [];
        $scope.completed = {};

        $scope.slug = $stateParams.slug;

        $http.get('../data/quests.json')
            .success(function (data, status, headers, config) {
                $scope.quests = data;

                if ($stateParams.slug) {
                    $scope.quest = grep($scope.quests, 'slug', $stateParams.slug);
                }
            })
            .error(function (data, status, headers, config) {
                console.log(data);
            });

        $scope.updateQuestList = function (slug) {
            
        };
    }]);