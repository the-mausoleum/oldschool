'use strict';

angular.module('OldSchool').controller('QuestsCtrl', ['$scope', '$stateParams', '$http', 'grep', 'Quests', function ($scope, $stateParams, $http, grep, Quests) {
    $scope.quests = [];
    $scope.completable = [];
    $scope.recommended = [];

    $scope.viewOptions = {
        showCompleted: true
    };

    $scope.slug = $stateParams.slug;

    $scope.player = 'Max Deviant';

    $http.get('http://localhost:3000/stats/' + $scope.player).success(function (data, status, headers, config) {
        $scope.stats = data;

        $http.get('../data/quests.json').success(function (data, status, headers, config) {
            $scope.quests = data;

            if ($stateParams.slug) {
                $scope.quest = grep($scope.quests, 'slug', $stateParams.slug);
                $scope.subquests = {};

                for (var i in $scope.quest.requirements.quests) {
                    var slug = $scope.quest.requirements.quests[i];

                    $scope.subquests[slug] = grep($scope.quests, 'slug', slug);
                }
            }

            $scope.tracker = new Quests($scope.quests, $scope.stats);

            $scope.updateQuestList();
        }).error(function (data, status, headers, config) {
            console.log(data);
        });
    }).error(function (data, status, headers, config) {
        console.log(data);
    });

    $scope.updateQuestList = function (slug) {
        $scope.recommended = $scope.tracker.recommendNext();
        $scope.completable = $scope.tracker.findAvailable();
    };

    $scope.isCompletable = function (slug) {
        return $scope.completable.indexOf(slug) !== -1;
    };

    $scope.isRecommended = function (slug) {
        return $scope.recommended.indexOf(slug) !== -1;
    };

    $scope.hideQuest = function (slug) {
        return $scope.tracker.completed.list[slug] && !$scope.viewOptions.showCompleted;
    };
}]);