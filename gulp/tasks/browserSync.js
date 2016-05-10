import gulp from 'gulp';
import path from '../path';
import browserSync from 'browser-sync';


// browserSync
gulp.task('bs:init', () => {
  return browserSync.init({
    open: false,
    notify: false,
    reloadDelay: 300,
    server: {
      baseDir: path.build.root,
      // logLevel: 'debug',
      // logConnections: true
    }
  });
});


gulp.task('bs:reload', () => {
  return browserSync.reload();
});