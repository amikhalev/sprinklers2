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
var glob = require('glob');
var spawn = require('child_process').spawn;

require('dotenv').load();
var env = process.env;

var paths = {
  scripts: [
    'app/scripts/**/**.{js,jsx}'
  ],
  styles: [
    'app/styles/app.less'
  ],
  views: [
    'app/views/**/*.jade'
  ],
  fonts: [
    'app/bower_components/bootstrap/dist/fonts/*'
  ],
  images: [
    'app/favicon.ico', 'app/images/**/*.*'
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
    'public/images/**/*',
    'public/favicon.ico',
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

var bundler = browserify({
  entries: scriptEntries,
  debug: true,
  fullPaths: true
}).transform(babelify);


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

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(cache('styles'))
    .pipe(sourcemaps.init())
    .pipe(less({
      sourceMap: {
        sourceMapFileInline: true
      }
    }))
    .on('error', function (error) {
      gutil.log(gutil.colors.red(error.message));
      notifier.notify({
        title: 'Less compilation error',
        message: error.message
      });
    })
    .pipe(remember('styles'))
    .pipe(concat('all.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/styles'));
});

gulp.task('styles:watch', function () {
  gulp.watch(paths.styles, ['styles']);
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

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(gulp.dest('public'));
});

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(eslint())
    .pipe(eslint.format('node_modules/eslint-friendly-formatter'));
});

gulp.task('lint:watch', function () {
  gulp.watch(paths.lint, ['lint']);
});

var client = ['scripts', 'styles', 'views', 'fonts', 'lint'];

gulp.task('dist:scripts', ['scripts'], function () {
  return gulp.src('public/scripts/all.js')
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/public/scripts'));
});

gulp.task('dist:styles', ['styles'], function () {
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
    .pipe(babel())
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

gulp.task('dist', ['dist:copy', 'dist:scripts', 'dist:styles', 'dist:views', 'dist:babel', 'dist:install', 'dist:logs', 'dist:misc']);

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

gulp.task('watch', ['scripts:watch', 'styles:watch', 'views:watch', 'lint:watch']);

gulp.task('run', function (cb) {
  var proc = spawn('npm', ['start'], {
    stdio: 'inherit'
  });
  proc.on('exit', cb);
});

gulp.task('default', ['run'].concat(client).concat(['watch']));
