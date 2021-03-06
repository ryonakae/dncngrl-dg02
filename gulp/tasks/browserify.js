import gulp from 'gulp';
import path from '../path';
import env from '../env';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import glob from 'glob';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify';
import bs from './browserSync';


// bundleScript function
const bundleScript = (isProduction) => {
  const srcFiles = glob.sync('./' + path.source.javascripts + '*.js');
  const srcPath = './' + path.source.javascripts;
  const destPath = './' + path.build.javascripts;
  let b;

  srcFiles.forEach((file) => {
    const options = {
      entries: file,
      transform: [[babelify, { 'presets': ['es2015'] }]]
    };

    // b (bundler)
    if(isProduction){
      b = browserify(options);
    } else {
      options.cache = {};
      options.packageCache = {};
      options.fullPaths = true;
      options.debug = true; // enable source map
      b = watchify(browserify(options));
    }

    // bundle function
    const bundle = () => {
      const bundleFile = file.replace(/.+\/(.+)\.js/g, '$1') + '.js';

      b
        .bundle()
        .on('error', (err) => {
          gutil.log('Browserify Error: \n' + gutil.colors.red(err.message));
        })
        .pipe(source(bundleFile))
        .pipe(buffer())
        .pipe(gulpif(isProduction, uglify({ preserveComments: 'some' })))
        .pipe(gulp.dest(destPath))
        .on('end', () => {
          gutil.log('Finished', "'" + gutil.colors.cyan('Browserify Bundled') + "'", gutil.colors.green(bundleFile));
          if(!isProduction && bs.active) gulp.start('bs:reload');
        });
    };

    // do bundle function
    b.on('update', bundle);
    bundle();
  });
};


// browserify or watchify
gulp.task('browserify', () => {
  return bundleScript(env.isProduction);
});