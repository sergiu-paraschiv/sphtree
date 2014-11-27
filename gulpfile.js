var gulp = require('gulp');
var watch = require('gulp-watch');
var connect = require('gulp-connect');

gulp.task('webserver', function() {
    connect.server({
        root: '',
        port: 9000,
        livereload: true
    });
});

gulp.task('livereload', function() {
    gulp.src([
            'css/**/*.css',
            '*.js',
            '*.html'
        ])
        .pipe(watch())
        .pipe(connect.reload());
});

gulp.task('default', ['webserver', 'livereload']);