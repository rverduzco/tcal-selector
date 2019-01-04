var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var cache = require('gulp-cache');
var styleInject = require("gulp-style-inject");
var removeCode = require('gulp-remove-code');
var replace = require('gulp-string-replace');
var uncss = require('gulp-uncss');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var htmlmin = require('gulp-htmlmin');

gulp.task('sass', function () {
  return gulp.src('app/scss/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('uncss', function() {
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
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  });
});

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});

gulp.task('images', function () {
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching img that ran through imagemin
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imageminJpegRecompress({
        loops: 1,
        min: 40,
        max: 60,
        quality: 'medium',
        progressive: true,
        strip: true
      }),
      imagemin.optipng({
        optimizationLevel: 7
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: true
        }, {
          cleanupIDs: false
        }]
      })
    ]))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['sass','images', 'uncss'], function () {
  return gulp.src('app/index.html')
    .pipe(removeCode({
      production: true
    }))
    .pipe(inject(gulp.src(['app/js/app.js']), {
      starttag: ' //<!-- inject:js -->',
      transform: function (filePath, file) {
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
      }
    ))
    .pipe(gulp.dest('dist/'));
});