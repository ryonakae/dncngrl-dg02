import gulp from 'gulp';
import path from '../path';
import env from '../env';
import jade from 'gulp-jade';
import plumber from 'gulp-plumber';
import bs from './browserSync';
import replace from 'gulp-replace';
import gulpif from 'gulp-if';


// jade
gulp.task('jade', () => {
  return gulp
    .src([
      path.source.root + '**/*.jade',
      '!' + path.source.root + '**/_*.jade'
    ])
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulpif(env.isProduction, replace('assets/', 'http://file.brdr.jp/dncngrl_02/')))
    .pipe(gulp.dest(path.build.root))
    .on('end', () => {
      if(!env.isProduction && bs.active) gulp.start('bs:reload');
    });
});