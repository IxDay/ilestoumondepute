var gulp = require('gulp');
var connect = require('gulp-connect');
var fileinclude = require('gulp-file-include');


gulp.task('watch', function () {
  gulp.watch(['./**.html', './**.svg'], ['fileinclude']);
  gulp.watch('./js/**', ['js']);
  gulp.watch('./css/**', ['css']);
  gulp.watch('./data/**', ['data']);
  gulp.watch('./img/**', ['img']);
});


gulp.task('reload', function () {
  gulp.src('./dist/**').pipe(connect.reload());
});


gulp.task('css', function () {
  gulp.src('./css/**')
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('img', function () {
  gulp.src('./img/**')
    .pipe(gulp.dest('./dist/img'));
});


gulp.task('js', function () {
  gulp.src('./js/**')
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('data', function () {
  gulp.src('./data/**')
    .pipe(gulp.dest('./dist/data'));
});

gulp.task('fileinclude', function () {
  gulp.src(['index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'));
});


gulp.task('serve', ['img', 'data', 'js', 'css', 'fileinclude', 'watch'], function () {
    connect.server({
      root: './dist/',
      livereload: true
    });
});
