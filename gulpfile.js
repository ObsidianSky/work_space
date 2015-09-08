'use strict';

var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    // browserSync = require('browser-sync'),
    // reload = browserSync.reload,
    rimraf = require('rimraf');

var path = {
    build: { 
        html: 'html/',
        css: 'html/css/',
        img: 'html/img/',
        fonts: 'html/fonts/',
        js: 'html/js',
        libs: 'html/libs'
    },
    dev: { 
        html: 'dev/*.html', 
        js: 'dev/js/**/*.js',
        libs: 'dev/libs/**/*.js',
        less: 'dev/less/all.less',
        css: 'dev/css/**/*.css',
        sprites: 'dev/img/sprites/*.*',
        img: 'dev/img/**/*.*', 
        fonts: 'dev/fonts/**/*.*'
    },
    watch: { 
        html: 'dev/**/*.html',
        js: 'dev/js/**/*.js',
        less: 'dev/less/**/*.less',
        css: 'dev/css/**/*.css',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*',
        libs: 'dev/libs/**/*.*'
    },
    clean: './html'
};

var config = {
    server: {
        baseDir: "./html"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Obsidian_Sky"
};

gulp.task('html:build', function(){
    gulp.src(path.dev.html)
    .pipe(gulp.dest(path.build.html));
   
})

gulp.task('js:build', function () {
    gulp.src(path.dev.js)
    .pipe(gulp.dest(path.build.js));

});

gulp.task('libs:build', function () {
    gulp.src(path.dev.libs) 
    .pipe(gulp.dest(path.build.libs));
   
});

gulp.task('sprite:build', function() {
    var spriteData = 
        gulp.src(path.dev.sprites) 
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'icons.less',
            cssFormat: 'less',
            algorithm: 'top-down'
        }));
    spriteData.img.pipe(gulp.dest('./dev/img')); 
    spriteData.css.pipe(gulp.dest('./dev/less')); 
    
});

gulp.task('less:build', function () {
    gulp.src(path.dev.less) 
    .pipe(less()) 
    .pipe(prefixer()) 
    .pipe(gulp.dest(path.build.css));
});

gulp.task('css:build', function () {
    gulp.src(path.dev.css) 
    .pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', function () {
    gulp.src(path.dev.img)
    .pipe(gulp.dest(path.build.img));
});

gulp.task('image:optimize', function(){
    gulp.src(path.dev.img) 
    .pipe(imagemin({
        progressive: true,
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function() {
    gulp.src(path.dev.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('build', [
    'html:build',
    'libs:build',
    'js:build',
    'sprite:build',
    'css:build',
    'less:build',
    'image:build',
    'fonts:build'
]);


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'watch']);

gulp.task('watch', function(){
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
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});