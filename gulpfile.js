const gulp  = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');

function Tasks() {
	gulp.src('*/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/'));
}

gulp.task('default', Tasks);

gulp.task('watch', function() {
	watch('*/*.js', Tasks);
})