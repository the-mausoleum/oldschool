'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var beautify = require('gulp-beautify');

var paths = {
    app: 'app/js/*/*.js',
    server: 'server/*.js'
};

var globs = [];

for (var i in paths) {
    globs.push(paths[i]);
}

gulp.task('lint', function () {
    return gulp.src(globs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('beautify', function () {
    var options = {
        indentSize: 4
    };

    gulp.src(paths.app)
        .pipe(beautify(options))
        .pipe(gulp.dest('app/js'));

    gulp.src(paths.server)
        .pipe(beautify(options))
        .pipe(gulp.dest('server'));
});

gulp.task('watch', function () {
    gulp.watch(paths.js, ['lint', 'beautify']);
});

gulp.task('default', [
    'lint',
    'beautify',
    'watch'
]);