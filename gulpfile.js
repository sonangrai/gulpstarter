var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var sassGlob = require("gulp-sass-glob");
var devserver = require("browser-sync");
var twig = require("gulp-twig2html");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var sourcemaps = require("gulp-sourcemaps");

//Copying the twig to HTML
gulp.task("twig", function () {
  return gulp
    .src(["src/**/*.twig", "!src/**/_*.twig"])
    .pipe(twig({}))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("dist"));
});

//Optimizing Images
gulp.task("imageMin", async () => {
  gulp.src("src/img/*").pipe(imagemin()).pipe(gulp.dest("dist/img"));
});

//Minifying Js
gulp.task("minifyJs", async () => {
  gulp
    .src("src/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(gulp.dest("dist/css"));
});

//SCSS Compiling
gulp.task("sass", async () => {
  gulp
    .src("src/sass/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/css"));
});

//Default
gulp.task(
  "build",
  gulp.series("sass", "minifyJs", "twig", "imageMin"),
  async () => {
    console.log("Ola Gulp is Walking...");
  }
);

//Watching
const watch = async () => {
  gulp.watch("src/sass/**/*.scss", gulp.series("sass", "browser-reload"));
  gulp.watch("src/js/*.js", gulp.series("minifyJs", "browser-reload"));
  gulp.watch("src/**/*.twig", gulp.series("twig", "browser-reload"));
  gulp.watch("src/img/*", gulp.series("imageMin", "browser-reload"));
  httpserver.init(serveoptions);
};

//Devserver
const serveoptions = {
  server: {
    baseDir: "./dist",
    index: "index.html",
    serveStaticOptions: {
      extensions: ["html"],
    },
  },
};
const httpserver = devserver.create();

gulp.task("browser-reload", function (cb) {
  httpserver.reload();
  cb();
});

module.exports.serve = gulp.series("build", watch);
