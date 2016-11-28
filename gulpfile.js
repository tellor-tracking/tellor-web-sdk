const gulp = require('gulp');
const rollup = require('rollup-stream');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const babel = require('rollup-plugin-babel');

const paths = {
    watch: 'src/{*,**/*}',
    destDir: 'dist/',
    webSDK: {
        src: 'src/index.js',
        destName: 'tellor.js',
        moduleName: 'window.Tellor'
    }
};

function buildRollupTask(config) {
    return rollup({
        entry: config.src,
        format: 'iife', // 'amd', 'cjs', 'es6', 'iife', 'umd'
        moduleName: config.moduleName,
        plugins: [babel({
            exclude: 'node_modules/**'
        })]
    })
        .on('error', function(error) {
            this.emit('end');
            console.error(error.stack);
        })
        .pipe(source(config.destName))
        .pipe(plumber({
            errorHandler: function(error) {
                this.emit('end');
                console.error(error);
            }
        }))
        .pipe(buffer())
        .pipe(gulp.dest(paths.destDir))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(paths.destDir));
}


gulp.task('build-web-sdk', function() {
    return buildRollupTask(paths.webSDK);
});


gulp.task('watch', function() {
    gulp.watch(paths.watch, ['build-web-sdk']);
});

gulp.task('default', ['build-web-sdk', 'watch']);