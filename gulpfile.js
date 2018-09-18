var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    sassGlob     = require('gulp-sass-glob');

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.scss') //берем источник
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) //преобразуем в css
        // .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) //добавляем префиксы
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) //добавляем префиксы
        .pipe(cssnano())
        .pipe(gulp.dest('app/css')) //выгружаем в папку css
        .pipe(gulp.dest('dist/css')) //выгружаем в папку css
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function () {
    return gulp.src([
        // 'app/libs/jquery/jquery-3.3.1.min.js',
        // 'app/libs/owlcarousel/js/owl.carousel.min.js',
        // 'app/libs/owlcarousel/js/owl.carousel2.thumbs.min.js'
    ])
        .pipe(concat('libs.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('app/js'))
});

gulp.task('css-libs', ['sass'], function () {
    return gulp.src([
        // 'app/libs/owlcarousel/css/owl.carousel.min.css'
    ])
        .pipe(concat('libs.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('clean' ,function () {
    return del.sync('dist');
});

gulp.task('clear' ,function () {
    return cache.clearAll();
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function () {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/sass/blocks/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('app/js/**/*.js');
});

gulp.task('build', ['img', 'sass', 'scripts'], function () {
    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css',
        'app/css/owl.theme.default.css'
    ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);