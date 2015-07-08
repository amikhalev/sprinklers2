var gulp = require('gulp');

var cache = require('gulp-cached');
var remember = require('gulp-remember');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var globby = require('globby');
var through = require('through2');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

var minifyCss = require('gulp-minify-css');
var less = require('gulp-less-sourcemap');

var rsync = require('gulp-rsync');
var install = require('gulp-install');
var gls = require('gulp-live-server');

var del = require('del');
var notifier = require('node-notifier');
var _ = require('lodash');

var env = _.defaultsDeep(process.env, require('./.env.json'));

var paths = {
  scripts: [
    'app/script/**/*.js'
  ],
  less: [
    'app/less/**/*.less'
  ],
  fonts: [
    'app/bower_components/bootstrap/dist/fonts/*'
  ],
  jshint: [
    'app.js',
    'gulpfile.js',
    'lib/**/*.js',
    'app/scripts/**/*.js'
  ],
  dist: [
    'app.js',
    'package.json',
    'views/**/*',
    'public/**/*',
    'lib/**/*'
  ]
};

gulp.task('clean', function (cb) {
  del(['public', 'dist'], cb);
});

gulp.task('scripts', function () {
  var bifyStream = through();
  bifyStream.pipe(source('all.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/script'));
  globby(paths.scripts, function (err, entries) {
    if (err) {
      return bifyStream.emit('error', err);
    }
    var bify = browserify({
      entries: entries,
      debug: true,
      transform: []
    });
    bify.bundle()
      .on('error', gutil.log)
      .pipe(bifyStream);
  });
  return bifyStream;
});

gulp.task('scripts:watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(cache('less'))
    .pipe(less({
      sourceMap: {
        sourceMapFileInline: true
      }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(minifyCss())
    .pipe(remember('less'))
    .pipe(concat('all.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/style'));
});

gulp.task('less:watch', function () {
  gulp.watch(paths.less, ['less']);
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('jshint', function () {
  return gulp.src(paths.jshint)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

var client = ['scripts', 'less', 'fonts', 'jshint'];

gulp.task('jshint:watch', function () {
  gulp.watch(paths.jshint, ['jshint']);
});

gulp.task('dist:copy', client, function () {
  return gulp.src(paths.dist, {base: '.'})
    .pipe(gulp.dest('dist'));
});

gulp.task('dist:install', ['dist:copy'], function () {
  return gulp.src('dist/package.json')
    .pipe(install({production: true}));
});

gulp.task('dist', ['dist:copy', 'dist:install']);

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

gulp.task('watch', ['scripts:watch', 'less:watch', 'jshint:watch']);

gulp.task('run', client.concat(['watch']), function () {
  var server = gls.new(['app.js'], {env: {NODE_ENV: 'development'}});
  server.start();
});

gulp.task('default', ['run']);