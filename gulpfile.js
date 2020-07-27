'use strict'

const src = 'src',
      distSrc = 'dist',
      fontsSrc = '/fonts',
      sassSrc = src + '/sass/**/*.sass',
      cssSrc = src + '/css/*.css',
      htmlSrc = './*.html',
      jsSrc = src + '/js/*.js',
      imgSrc = src + '/img/*.{png,jpg,gif}',
      cssDest = src + '/css';

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require ('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');


gulp.task('sass', function() {
    return gulp.src(sassSrc)
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(gulp.dest(cssDest));
});

gulp.task('watch', function () { 
	gulp.watch(sassSrc, gulp.series('sass')); 
});

gulp.task('browser-sync', function() {
    var files = [htmlSrc, cssSrc, jsSrc, imgSrc];

    browserSync.init(files, {
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', gulp.parallel(gulp.series('sass', 'watch'), 'browser-sync'));

gulp.task('clean', function() {
    return del([distSrc]);
});

gulp.task('copyfonts', function() {
    return gulp.src('./node_modules/font-awesome/fonts/**/*.*')
                .pipe(gulp.dest(distSrc + fontsSrc));
});

gulp.task('imagemin', function() {
    return gulp.src(imgSrc)
                .pipe(
                    imagemin({
                        optimizationLevel: 3,
                        progressive: true,
                        interlaced: true
                    })
                ).pipe(gulp.dest(distSrc + '/img'));
});

gulp.task('usemin', function() {
    return gulp.src(htmlSrc)
                .pipe(flatmap(function(stream, file) {
                    return stream.pipe(usemin({
                        css: [rev()],
                        html: [function() { return htmlmin({collapseWhitespace: true}) }],
                        js: [uglify(), rev()],
                        inlinejs: [uglify()],
                        inlinecss: [cleanCss(), 'concat']
                    }))
                }))
                .pipe(gulp.dest(distSrc + '/'));
});

gulp.task('build', gulp.series(
    'clean', 
    'copyfonts',
    'imagemin',
    'usemin'
));