'use strict';

angular.module('OldSchool')
    .controller('QuestsCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.quests = [];
        $scope.completed = {};

        $http.get('../quest-checker/quests.json')
            .success(function (data, status, headers, config) {
                $scope.quests = data;
            })
            .error(function (data, status, headers, config) {
                console.log(data);
            });

        $scope.updateQuestList = function (slug) {
            
        };
    }]);