'use strict';

angular.module('OldSchool').filter('capitalize', function () {
    return function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
});