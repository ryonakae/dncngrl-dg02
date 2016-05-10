import gulp from 'gulp';
import path from '../path';
import env from '../env';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import revDelete from 'gulp-rev-delete-original';


// revision: add hash
gulp.task('rev:addHash', () => {
  return gulp
    .src(path.build.assets + '**/*.{js,css,png,gif,jpg,jpeg,svg,woff}')
    .pipe(gulp.dest(path.build.assets))
    .pipe(rev())
    .pipe(revDelete())
    .pipe(gulp.dest(path.build.assets))
    .pipe(rev.manifest())
    .pipe(gulp.dest(path.build.assets));
});


// revision: replace
gulp.task('rev:replace', () => {
  const manifestFile = gulp.src(path.build.assets + 'rev-manifest.json');

  return gulp
    .src(path.build.root + '**/*.{html,css,js}')
    .pipe(revReplace({ manifest: manifestFile }))
    .pipe(gulp.dest(path.build.root));
});