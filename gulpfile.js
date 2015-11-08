'use strict';

var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    rigger = require('gulp-rigger'),
    changed = require('gulp-changed'),
	cssmin = require('gulp-cssmin'),
    connect = require('gulp-connect'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css');

var onError = function (err){  
  console.log(err);
};

var path = {
    build: { 
        html: 'html/',
        css: 'html/css/',
        js: 'html/js',
        img: 'html/img/',
        libs: 'html/libs',
        fonts: 'html/fonts/',
        iconfont: 'html/fonts/iconfont/'
    },
    dev: { 
        html: 'dev/*.*', 
        css: 'dev/css/**/*.css',
        less: 'dev/less/all.less',
        js: 'dev/js/**/*.js',
        img: 'dev/img/**/*.*',
        iconfont: 'dev/img/iconfont/*.svg',
        sprites: 'dev/img/sprites/*.*',
        libs: 'dev/libs/**/*.js',
        fonts: 'dev/fonts/**/*.*'
    },
    watch: { 
        html: 'dev/*.*',
        templates: 'dev/templates/*.*',
        css: 'dev/css/**/*.css',
        less: 'dev/less/**/*.less',
        js: 'dev/js/**/*.js',
        img: 'dev/img/**/*.*',
        iconfont: 'dev/img/iconfont/*.svg',
        sprite: 'dev/img/sprites/*.*',
        libs: 'dev/libs/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    clean: './html'
};
 
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

gulp.task('html:build', function(){
    gulp.src(path.dev.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(connect.reload());
   
})

gulp.task('js:build', function () {
    gulp.src(path.dev.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(connect.reload());

});

gulp.task('libs:build', function () {
    gulp.src(path.dev.libs) 
    .pipe(gulp.dest(path.build.libs))
    .pipe(connect.reload());
   
});

gulp.task('sprite:build', function() {
    var spriteData = 
        gulp.src(path.dev.sprites) 
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'icons.less',
            cssFormat: 'less',
            algorithm: 'top-down',
            imgPath: '../img/sprite.png'
        }));
    spriteData.img.pipe(gulp.dest('./dev/img')); 
    spriteData.css.pipe(gulp.dest('./dev/less')); 
    
});

gulp.task('less:build', function () {
    gulp.src(path.dev.less) 
    .pipe(less()).on('error', function(err){
        console.log(err);
    })  
    .pipe(prefixer()) 
    .pipe(gulp.dest(path.build.css))
    .pipe(connect.reload());
});

gulp.task('css:build', function () {
    gulp.src(path.dev.css) 
    .pipe(changed(path.build.css))
    .pipe(cssmin())
    .pipe(gulp.dest(path.build.css))
    .pipe(connect.reload());
});

gulp.task('image:build', function () {
    gulp.src([path.dev.img, '!dev/img/sprites/*.*', '!dev/img/iconfont/*.*'])
    .pipe(changed(path.build.img))
    .pipe(imagemin({
        progressive: true,
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(connect.reload());
});

gulp.task('image:optimize', function(){
    gulp.src(path.dev.img) 
    .pipe(gulp.dest(path.build.img))
    .pipe(connect.reload());
});

gulp.task('fonts:build', function() {
    gulp.src(path.dev.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(connect.reload());
});

gulp.task('iconfont:build', function(){
  gulp.src([path.dev.iconfont], {base:'dev/'})
    .pipe(iconfontCss({
      fontName: 'icons',
      path: 'css',
      targetPath: '../../../dev/less/fonticons.less',
      fontPath: '../fonts/iconfont/',
      cssClass:'fico'
    }))
    .pipe(iconfont({
      fontName: 'icons',
      formats: ['ttf', 'eot', 'woff', 'svg'],
      appendUnicode: true
     }))
    .pipe(gulp.dest(path.build.iconfont));
});

gulp.task('build', [
    'html:build',
    'libs:build',
    'js:build',
    'sprite:build',
    'css:build',
    'less:build',
    'image:build',
    'fonts:build',
    'iconfont:build'
]);


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['connect', 'build', 'watch']);

gulp.task('watch', function(){
    watch([path.watch.templates], function(event, cb) {
        gulp.start('html:build');
    }); 

    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    }); 

    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });

    watch([path.watch.less], function(event, cb) {
        gulp.start('less:build');
    });

    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });

    watch([path.watch.libs], function(event, cb) {
        gulp.start('libs:build');
    });

    watch([path.watch.img,'!dev/img/sprites/*.*','!dev/img/iconfont/*.*'], function(event, cb) {
        gulp.start('image:build');
    });

    watch([path.watch.iconfont], function(event, cb) {
        gulp.start('iconfont:build');
    });

    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite:build');
    });

    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });

});