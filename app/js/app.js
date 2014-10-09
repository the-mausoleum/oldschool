'use strict';

angular.module('OldSchool', ['ui.router']);

angular.module('OldSchool')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('stats', {
                url: '/stats',
                views: {
                    '': {
                        controller: 'StatsCtrl',
                        templateUrl: 'partials/stats.html'
                    }
                }
            })
            .state('quests', {
                url: '/quests',
                views: {
                    '': {
                        controller: 'QuestsCtrl',
                        templateUrl: 'partials/quests.html'
                    }
                }
            });

        $urlRouterProvider
            .otherwise('404');
    });