'use strict';

angular.module('OldSchool')
    .filter('exp', function () {
        return function (num) {
            num = num || '';

            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
    });