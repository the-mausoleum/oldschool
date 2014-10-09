'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var beautify = require('gulp-beautify');

var path = 'quest-checker/*.js';

gulp.task('lint', function () {
    return gulp.src(path)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('beautify', function () {
    gulp.src(path)
        .pipe(beautify({ indentSize: 4 }))
        .pipe(gulp.dest('quest-checker'));
});

gulp.task('watch', function () {
    gulp.watch(path, ['lint', 'beautify']);
});

gulp.task('default', [
    'lint',
    'beautify',
    'watch'
]);