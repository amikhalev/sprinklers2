var gulp = require('gulp');

var cache = require('gulp-cached');
var remember = require('gulp-remember');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');

var minifyCss = require('gulp-minify-css');
var less = require('gulp-less-sourcemap');

var jade = require('gulp-jade');

var rsync = require('gulp-rsync');
var install = require('gulp-install');
var gls = require('gulp-live-server');

var del = require('del');
var notifier = require('node-notifier');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var mkdirp = require('mkdirp');
var glob = require('glob');

require('dotenv').load();
var env = process.env;

var paths = {
  scripts: [
    'app/scripts/**/**.{js,jsx}'
  ],
  less: [
    'app/less/**/*.less'
  ],
  views: [
    'app/views/**/*.jade'
  ],
  fonts: [
    'app/bower_components/bootstrap/dist/fonts/*'
  ],
  lint: [
    'app.js',
    'gulpfile.js',
    'lib/**/*.js',
    'app/scripts/**/*.{js,jsx}'
  ],
  dist: [
    'app.js',
    'package.json',
    'public/fonts/**/*',
    'public/*.html',
    'lib/**/*'
  ],
  misc: [
    'app/.env'
  ]
};

gulp.task('clean', function (cb) {
  del(['public', 'dist'], cb);
});

function scripts(b) {
  return b
    .bundle()
    .on('error', function (err) {
      gutil.log('[browserify] error:');
      gutil.log(err.toString());
      notifier.notify({
        title: '[browserify] error',
        message: err.toString()
      });
    })
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/scripts'));
}

var scriptEntries = paths.scripts.map(function (pattern) {
  return glob.sync(pattern);
}).reduce(function (scs, sc) {
  return scs.concat(sc);
}, []);

var bundler = browserify({
  entries: scriptEntries,
  debug: true
}).transform(babelify);

var watcher = watchify(bundler);
watcher.on('update', function () {
  gutil.log('[watchify] updating');
  return scripts(watcher)
    .on('end', function () {
      notifier.notify({
        title: '[watchify]',
        message: 'updated scripts'
      });
    });
});
watcher.on('log', gutil.log);

gulp.task('scripts', scripts.bind(null, bundler));
gulp.task('scripts:watch', scripts.bind(null, watcher));

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(cache('less'))
    .pipe(less({
      sourceMap: {
        sourceMapFileInline: true
      }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(remember('less'))
    .pipe(concat('all.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/styles'));
});

gulp.task('less:watch', function () {
  gulp.watch(paths.less, ['less']);
});

gulp.task('views', function () {
  gulp.src(paths.views)
    //.pipe(cache('views'))
    .pipe(jade())
    //.pipe(remember('views'))
    .pipe(gulp.dest('public/'));
});

gulp.task('views:watch', function () {
  gulp.watch(paths.views, ['views']);
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:watch', function () {
  gulp.watch(paths.lint, ['lint']);
});

var client = ['scripts', 'less', 'views', 'fonts', 'lint'];

gulp.task('dist:scripts', function () {
  return gulp.src('public/scripts/all.js')
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('dist/public/scripts'));
});

gulp.task('dist:less', function () {
  return gulp.src('public/styles/all.css')
    .pipe(minifyCss())
    .on('error', gutil.log)
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/public/styles'));
});

gulp.task('dist:copy', client, function () {
  return gulp.src(paths.dist, {base: '.'})
    .pipe(gulp.dest('dist'));
});

gulp.task('dist:install', ['dist:copy'], function () {
  return gulp.src('dist/package.json')
    .pipe(install({production: true}));
});

gulp.task('dist:logs', function (cb) {
  mkdirp('dist/logs', cb);
});

gulp.task('dist:misc', function () {
  return gulp.src(paths.misc)
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['dist:copy', 'dist:scripts', 'dist:less', 'dist:install', 'dist:logs', 'dist:misc']);

gulp.task('deploy', ['dist'], function () {
  return gulp.src('dist')
    .pipe(rsync({
      root: 'dist',
      hostname: env.DEPLOY_HOSTNAME,
      port: env.DEPLOY_PORT || 22,
      destination: env.DEPLOY_DESTINATION,
      username: env.DEPLOY_USERNAME,
      incremental: true,
      progress: true,
      compress: true,
      recursive: true,
      update: true
    }))
    .on('end', function () {
      notifier.notify({
        title: 'Finished deploying',
        message: 'Deployed to ' + env.DEPLOY_HOSTNAME
      });
    });
});

gulp.task('watch', ['scripts:watch', 'less:watch', 'views:watch', 'lint:watch']);

var server;
gulp.task('run', client.concat(['watch']), function () {
  server = gls.new(['app.js'], {env: {NODE_ENV: 'development'}});
  return server.start();
});

gulp.task('default', ['run']);
