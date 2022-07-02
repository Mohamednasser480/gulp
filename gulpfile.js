const gulp = require("gulp");
const processhtml = require('gulp-processhtml');
const opts = {/* plugin options */ };
const { src, dest, watch, parallel, series } = require("gulp")

const htmlMin = require('gulp-htmlmin');
function minifyHTML() {
    return src('project/*.html')
    .pipe(processhtml(opts))
        .pipe(htmlMin({ collapseWhitespace: true, removeComments: true }))
        
        .pipe(gulp.dest('dist'))
}
exports.html = minifyHTML
//////////////////////////////////////////////////////////////////////////////////////////////////
var cleanCss = require('gulp-clean-css');
function cssMinify() {
    return src("project/css/**/*.css")
        .pipe(concat('style.min.css'))
        .pipe(cleanCss())
        .pipe(processhtml(opts))
        .pipe(dest('dist/assets/css'))
}
exports.css = cssMinify
//////////////////////////////////////////////////////////////////////////////////////////////////
const imagemin = require('gulp-imagemin');
function imgMinify() {
    return gulp.src('project/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}
exports.img = imgMinify
//////////////////////////////////////////////////////////////////////////////////////////////////

const concat = require('gulp-concat');
const terser = require('gulp-terser');
function jsMinify() {
    return src('project/js/**/*.js',{sourcemaps:true})
    
        //concate all js files in all.min.js
        .pipe(concat('all.min.js'))
        //use terser to minify js files
        .pipe(terser())
        //create source map file in the same directory
        .pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsMinify
//////////////////////////////////////////////////////////////////////////////////////////////////

//sass task
const sass = require('gulp-sass')(require('sass'));
function sassMinify() {
    return src(["project/sass/**/*.scss", "project/css/**/*.css"],{sourcemaps:true})
        .pipe(sass()) // Using gulp-sass to convert sass to css
        //concate all js files in all.min.js
        .pipe(concat('style.sass.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css',{sourcemaps:'.'}))
      }
//////////////////////////////////////////////////////////////////////////////////////////////////
var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

//watch task
function watchTask() {
    watch('project/*.html',series(minifyHTML, reloadTask))
    watch('project/js/**/*.js',series(jsMinify, reloadTask))
    watch(["project/css/**/*.css","project/sass/**/*.scss"], series(sassMinify,reloadTask));
}
exports.default = series( parallel(imgMinify, jsMinify, sassMinify, minifyHTML), serve,watchTask)




