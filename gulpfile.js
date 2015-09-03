'use strict';

var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    rimraf = require('rimraf');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'html/',
        css: 'html/css/',
        img: 'html/img/',
        fonts: 'html/fonts/',
        js: 'html/js',
        libs: 'html/libs'
    },
    dev: { //Пути откуда брать исходники
        html: 'dev/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'dev/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        libs: 'dev/libs/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        less: 'dev/less/all.less',
        css: 'dev/css/**/*.css',
        sprites: 'dev/img/sprites/*.*',
        img: 'dev/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'dev/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
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
    gulp.src(path.dev.html) //Найдем наш main файл
    .pipe(gulp.dest(path.build.html));
    // .pipe(reload({stream: true}));    
})

gulp.task('js:build', function () {
    gulp.src(path.dev.js) //Найдем наш main файл
    .pipe(gulp.dest(path.build.js));
    // .pipe(reload({stream: true}));
});

gulp.task('libs:build', function () {
    gulp.src(path.dev.libs) 
    .pipe(gulp.dest(path.build.libs));
    // .pipe(reload({stream: true})); 
});

gulp.task('sprite:build', function() {
    var spriteData = 
        gulp.src(path.dev.sprites) // путь, откуда берем картинки для спрайта
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'icons.less',
            cssFormat: 'less',
            algorithm: 'top-down'
        }));
    spriteData.img.pipe(gulp.dest('./dev/img')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('./dev/less')); // путь, куда сохраняем стили
    // spriteData.pipe(reload({stream: true}));
});

gulp.task('less:build', function () {
    gulp.src(path.dev.less) 
    .pipe(less()) //Скомпилируем
    .pipe(prefixer()) //Добавим вендорные префиксы
    .pipe(gulp.dest(path.build.css));
    // .pipe(reload({stream: true})); //И в build

});

gulp.task('css:build', function () {
    gulp.src(path.dev.css) 
    .pipe(gulp.dest(path.build.css));
    // .pipe(reload({stream: true})); //И в build

});

gulp.task('image:build', function () {
    gulp.src(path.dev.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
        progressive: true,
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.img));
    // .pipe(reload({stream: true})); //И бросим в build
});

gulp.task('fonts:build', function() {
    gulp.src(path.dev.fonts)
    .pipe(gulp.dest(path.build.fonts));
    // .pipe(reload({stream: true}));
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

// gulp.task('webserver', function () {
//     browserSync(config);
// });

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