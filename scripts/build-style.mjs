import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import path from 'path'
import sass from 'sass'
const handleSass = gulpSass(sass)

const root = path.join(process.cwd(), '../')

function buildStyle(){
  return gulp.src(path.join(root, 'packages/styles/**/*.scss'))
    .pipe(handleSass.sync().on('error', handleSass.logError))
    .pipe(gulp.dest(path.join(root,'styles')))
}

export default buildStyle