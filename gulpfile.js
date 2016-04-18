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
        filename: 'native',
        jsFiles: [
            'src/native.js',
            'src/native/app.js',
            'src/native/component.js',
            'src/native/window.js',
            'src/native/view.js',
            'src/native/accelerometer.js',
            'src/native/actionSheet.js',
            'src/native/audio.js',
            'src/native/camera.js',
            'src/native/contacts.js',
            'src/native/database.js',
            'src/native/device.js',
            'src/native/downloader.js',
            'src/native/eventListener.js',
            'src/native/gallery.js',
            'src/native/geolocation.js',
            'src/native/httpManager.js',
            'src/native/log.js',
            'src/native/message.js',
            'src/native/networkinfo.js',
            'src/native/os.js',
            'src/native/popover.js',
            'src/native/progress.js',
            'src/native/properties.js',
            'src/native/screen.js',
            'src/native/socketManager.js',
            'src/native/storage.js',
            'src/native/zip.js',
            'src/native/require.js',
            'src/native/plugin/tabMark.js'
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
            name: 'Native'
        }))
        .pipe(gulp.dest(paths.dist.root))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(header(banner.header, {
            date: date,
            name: 'Native'
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
    gulp.watch(paths.source + '**/*.*', gulp.series('dist-js'));
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