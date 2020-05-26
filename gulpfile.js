const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concatCss = require('gulp-concat-css');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

gulp.task('css', function () {
    return gulp.src('src/css/*.css')
        .pipe(autoprefixer())
        .pipe(concatCss('/css/main.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'))
});

gulp.task('copy', () => {
    return gulp.src([
        'src/*.html',
        '!src/index-src.html',
        'src/img/**/*.*',
        'src/js/lib/**/*.*'
      ], {base : 'src'})
      .pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
    return gulp.src([
        'src/js/**/*.*',
        '!src/js/lib/**/*.*'
        ], {base : 'src'})
        // .pipe(babel({
        //     presets: ['@babel/env'] // es6 -> es5
        // }))
        //.pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel('copy', 'css', 'js'));


