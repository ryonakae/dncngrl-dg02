import gulp from 'gulp';
import path from '../path';
import watch from 'gulp-watch';
import runSequence from 'run-sequence';


// watch
gulp.task('watch', () => {
  watch(path.source.root + '**/*.jade', (event) => {
    gulp.start('jade');
  });

  watch(path.source.stylesheets + '**/*.styl', (event) => {
    gulp.start('stylus');
  });

  watch([
    path.source.fonts + '*',
    // path.source.root + 'assets/videos/**/*'
  ], (event) => {
    gulp.start('stylus');
  });

  watch(path.source.images + '*', (event) => {
    gulp.start('image:min');
  });

  watch(path.source.sprite + '*', (event) => {
    runSequence('image:sprite', 'stylus');
  });
});