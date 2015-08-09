var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('sass', function() {
  return gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'));
});

gulp.task('js', function() {
  return gulp.src('node_modules/foundation-sites/js/vendor/modernizr.js')
    .pipe(gulp.dest('js/vendor'));
});

gulp.task('watch', function() {
    gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'js', 'watch']);
