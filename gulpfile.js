var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var styleInject = require("gulp-style-inject");
var removeCode = require('gulp-remove-code');
var replace = require('gulp-string-replace');
var uncss = require('uncss');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var htmlmin = require('gulp-htmlmin');

// var reload = browserSync.reload;

function sassCompile() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
    gulp.watch('app/scss/**/*.scss', sassCompile);
    gulp.watch('app/*.html').on('change', browserSync.reload);
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
}

function uncss() {
    return gulp.src('app/css/app.css')
        .pipe(uncss({
            html: ['app/index.html'],
            ignore: [ // These support basic bootstrap functions
                /\.affix/,
                /\.disabled/,
                // /\.alert/,
                /\.close/,
                /\.collapse/,
                /\.fade/,
                /\.has/,
                // /\.help/,
                /\.in/,
                /\.modal/,
                /\.open/,
                /\:hover/,
                // /\.popover/,
                // /\.tooltip/,
                // These support tab-collapse.js
                /\.visible-xs/,
                /\.hidden-xs/,
                /.panel.*/
            ]
        }))
        .pipe(gulp.dest('app/css'));
}

function build() {
    return gulp.src('app/index.html')
        .pipe(removeCode({
            production: true
        }))
        .pipe(inject(gulp.src(['app/js/app.js']), {
            starttag: ' //<!-- inject:js -->',
            transform: function(filePath, file) {
                // return file contents as string
                return file.contents.toString('utf8');
            }
        }))
        .pipe(styleInject())
        .pipe(replace('https://us.flukecal.com', ''))
        .pipe(replace('<!-- endinject -->', ''))
        .pipe(replace('//<!-- inject:js -->', ''))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dist/'));
}

exports.sassCompile = sassCompile;
exports.uncss = uncss;
exports.watch = watch;
exports.build = build;





// ---------------------------------------------------OLD Code Block -------------------------------------------------------------------//

// function browserSync (done) {
//   browserSync.init({
//     server: {
//       baseDir: 'app'
//     },
//   });
//   done();
// }

// function watch_files(){
//   gulp.watch('app/scss/**/*.scss', sass); 
//   gulp.watch('app/*.html', browserync); 
//   gulp.watch('app/js/**/*.js', browserSync); 
// }








//-------------------------------------------------Gulp 4 Syntax----------------------------------------------------------------------//


// gulp.task("default", gulp.series(cb, bc));

// var imagemin = require('gulp-imagemin');
// var imageminJpegRecompress = require('imagemin-jpeg-recompress');
// var cache = require('gulp-cache');

// function images () {
//   return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
//     // Caching img that ran through imagemin
//     .pipe(imagemin([
//       imagemin.gifsicle({
//         interlaced: true
//       }),
//       imageminJpegRecompress({
//         loops: 1,
//         min: 40,
//         max: 60,
//         quality: 'medium',
//         progressive: true,
//         strip: true
//       }),
//       imagemin.optipng({
//         optimizationLevel: 7
//       }),
//       imagemin.svgo({
//         plugins: [{
//           removeViewBox: true
//         }, {
//           cleanupIDs: false
//         }]
//       })
//     ]))
//     .pipe(gulp.dest('dist/img'));
// }