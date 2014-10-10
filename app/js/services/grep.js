'use strict';

angular.module('OldSchool')
    .factory('grep', [function () {
        return function (array, key, value) {
            for (var i in array) {
                if (array[i][key] === value) {
                    return array[i];
                }
            }
        };
    }]);