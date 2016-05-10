import gulp from 'gulp';
import path from '../path';
import env from '../env';


// copy files
gulp.task('copyFile', () => {
  return gulp
    .src(
      [
        path.source.fonts + '**/*',
        // path.source.root + 'assets/videos/**/*'
      ],
      { base: path.source.root }
    )
    .pipe(gulp.dest(path.build.root))
    .on('end', () => {
      if(!env.isProduction) gulp.start('bs:reload');
    });
});