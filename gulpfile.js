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

require('gulp-notifiable-task')

gulp.notifiableTask('default', ['build'])

gulp.notifiableTask('build', sequence('clean', ['build:js', 'build:css', 'build:image', 'build:misc'], 'hashsum', 'build:html'))

gulp.task('clean', ['clean:js', 'clean:css', 'clean:html'])

gulp.task('clean:js', () => del('dist/js'))
gulp.task('clean:css', () => del('dist/css'))
gulp.task('clean:html', () => del('dist/*.html'))

gulp.task('hashsum', () => {
  return gulp.src('dist/**/*.{png,gif,jpg,css,js}')
    .pipe(hashsum({
      dest: 'dist',
      json: true,
      filename: 'hashsum.json'
    }))
})

gulp.notifiableTask('build:js', () => {
  gulp.src('src/js/*.js')
    .pipe(named())
    .pipe(webpackstream(require('./webpack.config.js'), webpack()))
    .pipe(gulp.dest('dist/js'))
})

gulp.notifiableTask('build:css', () => {
  gulp.src('src/sass/*.sass')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'))
})

gulp.notifiableTask('build:html', sequence('compile:html', 'replacehashsum:html'))

gulp.task('compile:html', () => {
  return gulp.src('src/pug/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
})

gulp.task('replacehashsum:html', () => {
  const sums = require('./dist/hashsum.json')

  const replacements = Object.keys(sums).map(sum => [sum, sum + '?' + sums[sum]])

  return gulp.src('dist/**/*.html')
    .pipe(replace(replacements))
    .pipe(gulp.dest('dist'))
})

gulp.notifiableTask('build:image', () => {
  gulp.src('src/images/**/*.{png,gif,jpg}')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})

gulp.notifiableTask('build:misc', () => {
  gulp.src('src/assets/**')
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('watch', sequence('build', ['watch:js', 'watch:css', 'watch:html', 'watch:image']))

gulp.task('watch:js', () => gulp.watch('src/js/**/*.js', ['build:js']))
gulp.task('watch:css', () => gulp.watch('src/sass/**/*.sass', ['build:sass']))
gulp.task('watch:html', () => gulp.watch('src/pug/**/*.pug', ['compile:html']))
gulp.task('watch:image', () => gulp.watch('src/images/**/*.{png,jpg,gif}', ['build:image']))

