'use strict';

angular.module('OldSchool', ['ui.router']);

angular.module('OldSchool').config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        views: {
            '': {
                templateUrl: 'partials/home.html'
            },
            'stats': {
                controller: 'StatsCtrl',
                templateUrl: 'partials/stats.html'
            },
            'quests': {
                controller: 'QuestsCtrl',
                templateUrl: 'partials/quests.html'
            }
        }
    }).state('stats', {
        url: '/stats',
        views: {
            '': {
                controller: 'StatsCtrl',
                templateUrl: 'partials/stats.html'
            }
        }
    }).state('quests', {
        url: '/quests',
        views: {
            '': {
                controller: 'QuestsCtrl',
                templateUrl: 'partials/quests.html'
            }
        }
    }).state('quests-details', {
        url: '/quests/:slug',
        views: {
            '': {
                controller: 'QuestsCtrl',
                templateUrl: 'partials/quests-details.html'
            }
        }
    }).state('404', {
        url: '/404',
        views: {
            '': {
                templateUrl: 'partials/404.html'
            }
        }
    });

    $urlRouterProvider.otherwise('404');
});