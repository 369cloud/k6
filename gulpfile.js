var gulp = require('gulp'), //基础库
    concat = require('gulp-concat'), //合并文件
    connect = require('gulp-connect'),
    less = require('gulp-less'), //less解析
    minifycss = require('gulp-minify-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    clean = require('gulp-clean'), //清空文件夹
    del = require('del'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'), //livereload
    paths = {
        root: './',
        dist: {
            root: 'dist/'
        },
        source: {
            root: 'src/'
        },
        examples: {
            root: 'examples/',
            index: 'examples/contains.html'
        }
    },
    native = {
        filename: 'k6',
        jsFiles: [
            'src/k6.js',
            'src/app.js',
            'src/component.js',
            'src/window.js',
            'src/view.js',
            'src/accelerometer.js',
            'src/actionSheet.js',
            'src/audio.js',
            'src/camera.js',
            'src/contacts.js',
            'src/database.js',
            'src/device.js',
            'src/downloader.js',
            'src/eventListener.js',
            'src/gallery.js',
            'src/geolocation.js',
            'src/httpManager.js',
            'src/log.js',
            'src/message.js',
            'src/networkinfo.js',
            'src/os.js',
            'src/popover.js',
            'src/progress.js',
            'src/properties.js',
            'src/screen.js',
            'src/socketManager.js',
            'src/storage.js',
            'src/zip.js',
            'src/require.js',
            'src/plugin/tabMark.js'
        ]
    },
    banner = {
        header: [
            '/**',
            ' * Released on: <%= date.year %>-<%= date.month %>-<%= date.day %>',
            ' * =====================================================',
            ' * <%= name %> v1.0.1 (http://docs.369cloud.com/engine/jssdk/JS-SDK)',
            ' * =====================================================',
            ' */',
            ''
        ].join('\n'),
        footer: [
            '/**',
            ' * Released on: <%= date.year %>-<%= date.month %>-<%= date.day %>',
            ' */',
            ''
        ].join('\n')
    },
    date = {
        year: new Date().getFullYear(),
        month: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' ')[new Date().getMonth()],
        day: new Date().getDate()
    };



// 清空dist样式
gulp.task('cleanDist', function(cb) {
    return del([paths.dist.root]);
});

//co脚本处理
gulp.task('dist-native', function(cb) {
    gulp.src(native.jsFiles) //要合并的文件
        .pipe(concat(native.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(header(banner.header, {
            date: date,
            name: 'K6'
        }))
        .pipe(gulp.dest(paths.dist.root))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(header(banner.header, {
            date: date,
            name: 'K6'
        }))
        .pipe(gulp.dest(paths.dist.root))
        .on('finish', function() {
            cb();
        });
});



gulp.task('build', gulp.series('cleanDist', 'dist-native'));

/* =================================
    Watch
================================= */

gulp.task('watch', function(cb) {
    var server = livereload();
    livereload.listen();
    gulp.watch(paths.source + '**/*.*', gulp.series('build'));
    cb();
});



gulp.task('connect', function(cb) {
    connect.server({
        root: [paths.root],
        port: '3002'
    });
    cb();
});

gulp.task('open', function(cb) {
    gulp.src(paths.examples.index).pipe(open('', {
        url: 'http://localhost:3002/' + paths.examples.index
    }));
    cb();
});

gulp.task('default', gulp.series('build', 'connect', 'open', 'watch'));