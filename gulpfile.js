const { watch, src, dest, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpackStream = require('webpack-stream');
const htmlmin = require('gulp-htmlmin');

const CONFIG = {
  src: {
    js: ['./src/js/**/*.js'],
    sass: './src/sass/**/*.scss',
    images: './src/img/**/*.*',
    html: './src/**/*.html',
  },
  docs: {
    base: './docs/',
    images: './docs/img/',
  },
};

function cssTask(done) {
  src(CONFIG.src.sass)
    .pipe(sass())
    .pipe(rename({ suffix: '.bundle' }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(CONFIG.docs.base));

  done();
}

function jsTask(done) {
  src(CONFIG.src.js)
    .pipe(
      webpackStream({
        output: {
          filename: 'main.js',
        },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: 'babel-loader',
              query: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
      })
    )
    .pipe(rename({ suffix: '.bundle' }))
    .pipe(uglify())
    .pipe(dest(CONFIG.docs.base));

  done();
}

function templateTask(done) {
  src(CONFIG.src.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(CONFIG.docs.base));
  done();
}

function imagesTask(done) {
  src(CONFIG.src.images).pipe(dest(CONFIG.docs.images));
  done();
}

function liveReload(done) {
  browserSync.init({
    server: {
      baseDir: CONFIG.docs.base,
    },
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function cleanUp() {
  return del([CONFIG.docs.base]);
}

function watchChanges() {
  watch(CONFIG.src.sass, series(cssTask, reload));
  watch(CONFIG.src.html, series(templateTask, reload));
  watch(CONFIG.src.js, series(jsTask, reload));
  watch(CONFIG.src.images, series(imagesTask, reload));
}

exports.dev = parallel(
  jsTask,
  cssTask,
  templateTask,
  imagesTask,
  watchChanges,
  liveReload
);
exports.build = series(
  cleanUp,
  parallel(jsTask, cssTask, imagesTask, templateTask)
);
