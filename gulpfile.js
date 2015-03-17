var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});


// use default task to launch BrowserSync and watch JS files
gulp.task('default', ['browser-sync'], function () {

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(["*.html"], [browserSync.reload]);
   // gulp.watch("js/*.js", [browserSync.reload]);
});