/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var through = require('through2');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var browserify = require('browserify');
var uglifyify = require('gulp-uglifyjs');
var data = require('gulp-data')
var mergeStream = require('merge-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var hbsfy = require("hbsfy");
var render = require('gulp-nunjucks-render');
var path = require('path');
var notify = require("gulp-notify");
var reload = browserSync.reload;
var config = require('./gulpconfig')
var fs = require('fs')
var sourcemaps = require('gulp-sourcemaps');
var size = require('gulp-size');
var stripcomments = require('gulp-strip-comments');

gulp.task('clean', function (done) {
    require('del')(['public'], done);
});

gulp.task('browser-sync', function () {
    browserSync({
        notify: true,//shows browser sync flag
        port: 8000,
        open: false,
        server: {
            baseDir: "public"
        }
    });
});


var exclude = path.normalize('!**/{' + config.tasks.html.excludeFolders.join(',') + '}/**')

var paths = {
    src: [path.join(config.root.src, config.tasks.html.src, '/**/*.{' + config.tasks.html.extensions + '}'), exclude],
    dest: path.join(config.root.dest, config.tasks.html.dest),
}

console.log('paths',paths);

var getData = function (file) {
    var dataPath = path.resolve(config.root.src, config.tasks.html.src, config.tasks.html.dataFile)
    console.log('dataPath',dataPath);
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
}

function handleErrors(errorObject, callback) {
    notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments)
    // Keep gulp from hanging on this task
    if (typeof this.emit === 'function') this.emit('end')
}

var dependenciesTask = function () {

    var settings = {
        src: path.join(config.root.src, config.tasks.dependencies.src, '/*.js'),
        dest: path.join(config.root.dest, config.tasks.dependencies.dest)
    }

    return gulp.src(settings.src)
        .pipe(gulp.dest(settings.dest))
        .pipe(browserSync.stream())
}

gulp.task('dependencies', dependenciesTask)


gulp.task('html',  function () {

    return gulp.src(paths.src)
        .pipe(data(getData))
        .on('error', handleErrors)
        .pipe(render({
            path: [path.join(config.root.src, config.tasks.html.src)],
            envOptions: {
                watch: false
            }
        }))
        .on('error', handleErrors)
    // .pipe(gulpif(global.production, htmlmin(config.tasks.html.htmlmin)))
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream())

});


gulp.task('css', function () {

    var settings = {
        src: path.join(config.root.src, config.tasks.css.src, '**/*.*'),
        dest: path.join(config.root.dest, config.tasks.css.dest)
    }

    return gulp.src(settings.src)
        .pipe(gulp.dest(settings.dest))
        .pipe(browserSync.stream())
})


//working  gulp.task('css', function () {
//   return gulp.src('src/css/*.scss')
//     .pipe(plugins.sourcemaps.init())
//     .pipe(plugins.sass({ outputStyle: 'compressed' }))
//     .pipe(plugins.sourcemaps.write('./'))
//     .pipe(gulp.dest('public/css'))
//     .pipe(plugins.filter('**/*.css'))
//     .pipe(reload({stream: true}));
// });

// gulp.task('misc', function () {
//   return gulp.src([
//     // Copy all files
//     'src/**',
//     // Exclude the following files
//     // (other tasks will handle the copying of these files)
//      '!src/*.html',
//     // '!src/{css,css/**}',
//      '!src/{js,js/**}'
//   ]).pipe(gulp.dest('public'));
// });


gulp.task('js', function () {
    gulp.src(['./src/javascripts/**'])
        .pipe(concat('app.js'))
        .pipe(uglifyify())
        .pipe(gulp.dest('./public/javascripts/'))
});


function createBundler(src) {

    // console.log('src', src);
    var b;

    //   if (plugins.util.env.production) {
    //     b = browserify();
    //   }
    //   else {
    b = browserify({
        cache: {}, packageCache: {}, fullPaths: true,
        debug: true
    });
    //   }

    b.transform(hbsfy);

    // if (plugins.util.env.production) {
        b.transform({
            global: true
        }, 'uglifyify');
    // }

    b.add(src);
    return b;
}



// var bundlePaths = {
//     src: [
//         'client/js/**/*.js',
//         "!client/js/**/lib/**" // Don't bundle libs
//     ],
//     dest:'build/js/'
// }



var bundlers = {
    'javascripts/app.js': createBundler([
        './src/javascripts/app.js',
        './src/javascripts/controller/addevent.controller.js',
        './src/javascripts/controller/datepicker.controller.js',
        './src/javascripts/controller/event.controller.js',
        './src/javascripts/controller/main.controllerl.js',
        './src/javascripts/controller/password.controller.js',
        './src/javascripts/controller/timepicker.controller.js',
        './src/javascripts/factory/access.factory.js',
        './src/javascripts/factory/references.factory.js',
        './src/javascripts/route/main.route.js',
        './src/javascripts/service/authentification.service.js',
        './src/javascripts/service/checkvalues.service.js',
        './src/javascripts/service/foursquare.service.js'
        ]),
    // 'javascripts/app.js': createBundler(['./src/javascripts/**', './src/dependencies/**']),
};


function bundle(bundler, outputPath) {

    //var splitPath = outputPath.split('/');
    var outputFile = "app.js";//splitPath[splitPath.length - 1];
    var outputDir = "javascripts";//splitPath.slice(0, -1).join('/');



    // console.log('splitPath',splitPath);
    // console.log('outputFile',outputFile);
    // console.log('outputDir',outputDir);


    return bundler.bundle()
    // log errors if they happen
        .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
        .pipe(source(outputFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file//plugins.
        .pipe(sourcemaps.write('./')) // writes .map file //plugins.
        .pipe(size({ gzip: true, title: outputFile }))//plugins.
        .pipe(gulp.dest('public/' + outputDir))
        .pipe(reload({ stream: true }));
}

gulp.task('watch', ['build'], function () {
    gulp.watch(['src/html/**/*.html'], ['html']);
    gulp.watch(['src/html/index.html'], ['html']);
    gulp.watch(['src/css/bootstrap/dist/css/*.css'], ['css']);
    gulp.watch(['src/javascripts/app.js'], ['js']);
    gulp.watch(['src/javascripts/**/*.js'], ['js']);

    //causes error
    Object.keys(bundlers).forEach(function (key) {
        // console.log('key',key);
        var watchifyBundler = watchify(bundlers[key]);
        watchifyBundler.on('update', function () {
            return bundle(watchifyBundler, key);
        });
        bundle(watchifyBundler, key);
    });
});

gulp.task('build', function () {
    // orig    return runSequence('clean', ['css', 'misc', 'html', 'js']);
    //   return runSequence(['css', 'misc', 'html', 'js']);
    return runSequence(['css', 'html', 'js', 'dependencies']);//,'dependencies'
});



gulp.task('x', ['clean', 'build', 'browser-sync', 'watch']);
gulp.task('serve', ['browser-sync', 'watch']);
gulp.task('default', ['build']);
