var gulp = require('gulp');

var cache = require('gulp-cached');
var remember = require('gulp-remember');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

var less = require('gulp-less-sourcemap');
var minifyCss = require('gulp-minify-css');

var jade = require('gulp-jade');

var rsync = require('gulp-rsync');
var install = require('gulp-install');

var del = require('del');
var notifier = require('node-notifier');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;

require('dotenv').load();
var env = process.env;

var paths = {
  views: [
    'app/views/**/*.jade'
  ],
  images: [
    'app/favicon.ico', 'app/images/**/*.*'
  ],
  dist: [
    'package.json',
    'public/fonts/**/*',
    'public/images/**/*',
    'public/favicon.ico',
    'lib/**/*.json'
  ],
  misc: [
    'app/misc/**/{*,.*,*.*}'
  ]
};

function webpackTask(config) {
  return function (cb) {
    webpack(config, function (err, stats) {
      if (err) {
        throw new gutil.PluginError('webpack', err);
      }
      gutil.log('[webpack]', stats.toString({
        colors: true
      }));
      cb();
    });
  }
}

gulp.task('clean', function (cb) {
  del([ 'public', 'dist' ], cb);
});

gulp.task('webpack', webpackTask(require('./webpack.dev.config')));

gulp.task('views', function () {
  return gulp.src(paths.views)
    .pipe(jade({
      locals: {
        dist: false
      }
    }))
    .pipe(gulp.dest('public/'));
});

gulp.task('views:watch', function () {
  gulp.watch(paths.views, [ 'views' ]);
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(gulp.dest('public'));
});

var client = [ 'views' ];

gulp.task('dist:views', function () {
  return gulp.src(paths.views)
    .pipe(jade({
      locals: {
        dist: true
      }
    }))
    .pipe(gulp.dest('dist/public/'));
});

gulp.task('dist:babel', function () {
  return gulp.src([ 'app.js', 'lib/**/*.js' ], { base: '.' })
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('dist:copy', function () {
  return gulp.src(paths.dist, { base: '.' })
    .pipe(gulp.dest('dist'));
});

gulp.task('dist:install', [ 'dist:copy' ], function () {
  return gulp.src('dist/package.json')
    .pipe(install({ production: true }));
});

gulp.task('dist:logs', function (cb) {
  mkdirp('dist/logs', cb);
});

gulp.task('dist:misc', function () {
  return gulp.src(paths.misc)
    .pipe(gulp.dest('dist'));
});

gulp.task('dist:webpack', webpackTask(require('./webpack.dist.config.js')));

gulp.task('dist', [ 'dist:copy', 'dist:webpack', 'dist:views', 'dist:babel', 'dist:install', 'dist:logs', 'dist:misc' ]);

gulp.task('deploy', [ 'dist' ], function () {
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

gulp.task('watch', [ 'views:watch' ]);

gulp.task('server', function (cb) {
  var proc = spawn('npm', [ 'start' ], {
    stdio: 'inherit'
  });
  proc.on('exit', cb);
});

gulp.task('webpack-dev-server', function () {
  var config = require('./webpack.dev.config');
  config.entry.unshift('webpack/hot/only-dev-server');
  config.entry.unshift('webpack-dev-server/client?http://localhost:8081');
  var compiler = webpack(config);
  new WebpackDevServer(compiler, {
    contentBase: './public/',
    publicPath: '/assets/',
    hot: true,
    historyApiFallback: true,
    proxy: {
      '*': 'http://localhost:8080'
    },
    stats: { colors: true, progress: true }
  }).listen(8081, 'localhost', function (err) {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', 'Webpack dev server error', err);
      }
      gutil.log('[webpack-dev-server]', 'Webpack dev server listening at localhost:8081');
    });
});

gulp.task('default', [ 'server', 'webpack-dev-server' ].concat(client).concat([ 'watch' ]));
