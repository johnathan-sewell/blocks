var cheerio = require("gulp-cheerio");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
	
gulp.task("svgstore", function () { 
return gulp 
	.src("icons/*.svg") 
	.pipe(svgmin()) 
	.pipe(svgstore({ fileName: "sprite.svg", prefix: "icon-" })) 
	.pipe(cheerio({ run: function ($) { $("[fill]").removeAttr("fill"); }, parserOptions: { xmlMode: true } })) 
	.pipe(gulp.dest("includes/"));
});