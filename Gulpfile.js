var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var newer = require('gulp-newer');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var closureCompiler = require('google-closure-compiler').gulp({ requireStreamInput: true });
var processhtml = require('gulp-processhtml');
var del = require('del');
////CSS
gulp.task('css', function () {
    return [
      gulp.src('main.css')
      .pipe(minifyCSS())
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
      .pipe(concat('main.min.css'))
      .pipe(gulp.dest(''))
      .pipe(gulp.dest(''))
    ];
});
gulp.task('images', ['css'], function () {
    return gulp.src('*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('images'));
});
gulp.task('app', ['images'], function () {
    return [gulp.src('./app.js', { base: './' })
        .pipe(newer('./app.min.js'))
        .pipe(closureCompiler({
            compilation_level: 'WHITESPACE_ONLY',
            js_output_file: 'app.min.js'
        }))
        .pipe(gulp.dest('./')),
        gulp.src('./app.js', { base: './' })
        .pipe(newer('./app.min.js'))
        .pipe(closureCompiler({
            compilation_level: 'WHITESPACE_ONLY',
            js_output_file: 'app.min.js'
        }))
        .pipe(gulp.dest('./'))
    ];
});
gulp.task('browserSync', ['app'],function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
gulp.task('start', function (callback) {
    runSequence(['app'],
        'browserSync');
});
gulp.task('processhtml', function () {
    // remove existing replacementlist.txt & dist folder if they exist
    del([
        'replacementlist.txt',
        'dist'
    ])

    /* options for processhtml */
    var options = {
        list: "replacementlist.txt"
    };

    return gulp.src('index.html')
        .pipe(processhtml(options))
        .pipe(gulp.dest('dist'));
});
