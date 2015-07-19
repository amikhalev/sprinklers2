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
var babel = require('gulp-babel');

var minifyCss = require('gulp-minify-css');
var less = require('gulp-less-sourcemap');

var jade = require('gulp-jade');

var rsync = require('gulp-rsync');
var install = require('gulp-install');

var del = require('del');
var notifier = require('node-notifier');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var mkdirp = require('mkdirp');
var glob = require('glob');
var spawn = require('child_process').spawn;

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
    'package.json',
    'public/fonts/**/*',
    'lib/**/*.json'
  ],
  misc: [
    'app/misc/**/{*,.*,*.*}'
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

var BABEL_OPTIONS = {
  optional: ['es7.classProperties']
};

var bundler = browserify({
  entries: scriptEntries,
  debug: true
}).transform(babelify.configure(BABEL_OPTIONS));


gulp.task('scripts', scripts.bind(null, bundler));
gulp.task('scripts:watch', function () {
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
  return scripts(watcher);
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
    .pipe(remember('less'))
    .pipe(concat('all.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/styles'));
});

gulp.task('less:watch', function () {
  gulp.watch(paths.less, ['less']);
});

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

gulp.task('dist:scripts', ['scripts'], function () {
  return gulp.src('public/scripts/all.js')
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/public/scripts'));
});

gulp.task('dist:less', ['less'], function () {
  return gulp.src('public/styles/all.css')
    .pipe(minifyCss())
    .on('error', gutil.log)
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/public/styles'));
});

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
  return gulp.src(['app.js', 'lib/**/*.js'], {base: '.'})
    .pipe(sourcemaps.init())
    .pipe(babel(BABEL_OPTIONS))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('dist:copy', ['fonts'], function () {
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

gulp.task('dist', ['dist:copy', 'dist:scripts', 'dist:less', 'dist:views', 'dist:babel', 'dist:install', 'dist:logs', 'dist:misc']);

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

gulp.task('run', client.concat(['watch']), function (cb) {
  var proc = spawn('npm', ['start'], {
    stdio: 'inherit'
  });
  proc.on('exit', cb);
});

gulp.task('default', ['run']);
