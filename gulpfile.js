const gulp = require('gulp')
const sequence = require('gulp-sequence')
const webpackstream = require('webpack-stream')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const hashsum = require('gulp-hashsum')
const named = require('vinyl-named')
const del = require('del')
const imagemin = require('gulp-imagemin')
const replace = require('gulp-batch-replace')
const webpack = require('webpack')

gulp.task('default', ['build'])

gulp.task('build', sequence('clean', ['prepare', 'build:js', 'build:css', 'build:image', 'build:misc'], 'hashsum', 'build:html'))

gulp.task('clean', ['clean:js', 'clean:css', 'clean:html'])

gulp.task('clean:js', () => del('dist/js'))
gulp.task('clean:css', () => del('dist/css'))
gulp.task('clean:html', () => del('dist/*.html'))

gulp.task('prepare', ['prepare:bootstrap'])

gulp.task('prepare:bootstrap', () => {
  return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('dist/static'))
})

gulp.task('hashsum', () => {
  return gulp.src('dist/**/*.{png,gif,jpg,css,js}')
    .pipe(hashsum({
      dest: 'dist',
      json: true,
      filename: 'hashsum.json'
    }))
})

gulp.task('build:js', () => {
  return gulp.src('src/js/*.js')
    .pipe(named())
    .pipe(webpackstream(require('./webpack.config.js'), webpack))
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(gulp.dest('dist/js'))
})

gulp.task('build:css', () => {
  return gulp.src('src/sass/*.sass')
    .pipe(sass())
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('build:html', sequence('compile:html', 'replacehashsum:html'))

gulp.task('compile:html', () => {
  return gulp.src('src/pug/**/*.pug')
    .pipe(pug())
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(gulp.dest('dist'))
})

gulp.task('replacehashsum:html', () => {
  const sums = require('./dist/hashsum.json')

  const replacements = Object.keys(sums).map(sum => [sum, sum + '?' + sums[sum]])

  return gulp.src('dist/**/*.html')
    .pipe(replace(replacements))
    .pipe(gulp.dest('dist'))
})

gulp.task('build:image', () => {
  return gulp.src('src/images/**/*.{png,gif,jpg}')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})

gulp.task('build:misc', () => {
  return gulp.src('src/assets/**')
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('watch', sequence('build', ['watch:js', 'watch:css', 'watch:html', 'watch:image']))

gulp.task('watch:js', () => gulp.watch(['src/js/**/*.js', 'src/library/**/*.js', 'src/vue/**/*.vue'], ['build:js']))
gulp.task('watch:css', () => gulp.watch('src/sass/**/*.sass', ['build:css']))
gulp.task('watch:html', () => gulp.watch('src/pug/**/*.pug', ['compile:html']))
gulp.task('watch:image', () => gulp.watch('src/images/**/*.{png,jpg,gif}', ['build:image']))
