
var path = require('path'),
	gulp = require('gulp'),
	webpack = require('gulp-webpack-build'),
	testem = require('gulp-testem');

var src = './',
	dest = './',
	webpackOptions = {
	},
	webpackConfig = {
		useMemoryFs: true
	},
	CONFIG_FILENAME = webpack.config.CONFIG_FILENAME;

gulp.task('webpack', [], function() {

	return gulp.src(path.join(CONFIG_FILENAME), { base: path.resolve(src) })
		.pipe(webpack.configure(webpackConfig))
		.pipe(webpack.overrides(webpackOptions))
		.pipe(webpack.compile())
		.pipe(webpack.format({
			version: false,
			timings: true
		}))
		.pipe(webpack.failAfter({
			errors: true,
			warnings: true
		}))
		.pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
	var dirs = ['src', 'attributes', 'spec'];

	gulp.watch(['src/*.js', 'attributes/*', 'spec/*.js']).on('change', function(event) {
		if (event.type === 'changed') {
			gulp.src(event.path, { base: path.resolve(src) })
				.pipe(webpack.closest(CONFIG_FILENAME))
				.pipe(webpack.configure(webpackConfig))
				.pipe(webpack.overrides(webpackOptions))
				.pipe(webpack.watch(function(err, stats) {
					gulp.src(this.path, { base: this.base })
						.pipe(webpack.proxy(err, stats))
						.pipe(webpack.format({
							verbose: true,
							version: false
						}))
						.pipe(gulp.dest(dest));
				}));
		}
	});
});

gulp.task('testem', function () {
    gulp.src([''])
        .pipe(testem({
            configFile: 'testem.json'
        }));
});

gulp.task('default', ['webpack', 'watch', 'testem']);
