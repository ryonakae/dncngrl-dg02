import gulp from 'gulp';
import path from '../path';
import env from '../env';
import jade from 'gulp-jade';
import plumber from 'gulp-plumber';


// jade
gulp.task('jade', () => {
  return gulp
    .src([
      path.source.root + '**/*.jade',
      '!' + path.source.root + '**/_*.jade'
    ])
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(path.build.root))
    .on('end', () => {
      if(!env.isProduction) gulp.start('bs:reload');
    });
});