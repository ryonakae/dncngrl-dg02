import gulp from 'gulp';
import path from '../path';
import env from '../env';
import runSequence from 'run-sequence';


// default task
gulp.task('default', () => {
  // development
  if(!env.isProduction){
    runSequence('cleanBuild', ['copyFile', 'image:sprite'], ['jade', 'stylus', 'browserify', 'image:min'], 'bs:init', 'watch');
  }

  // production
  else {
    runSequence('clearCache', 'cleanBuild', ['copyFile', 'image:sprite'], ['jade', 'stylus', 'browserify', 'image:min'], 'rev:addHash', 'rev:replace');
  }
});