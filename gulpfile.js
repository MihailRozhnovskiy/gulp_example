//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

// Порядок подключения CSS файлов
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
];

// Порядок подключения JS файлов
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];

//Таск на стили CSS обработка файлов стилей
function styles() {
 //Шаблон для поиска файлов CSS
 //Все файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)
 //Обьединение файлов в один
    .pipe(concat('style.css'))
 //Добавление автопрефиксов
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
 //Минификация CSS
    .pipe(cleanCSS({level: 2}))
 //Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
 //Обновление браузера после изменеий в CSS файлах
    .pipe(browserSync.stream())
}

//Таск на скрипты JS обработка файлов скриптов
function scripts() {
//Шаблон для поиска файлов JS
//Все файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
 //Обьединение файлов в один
    .pipe(concat('script.js'))
 //Минификация JS
    .pipe(uglify({toplevel: true}))
 //Выходная папка для стилей
    .pipe(gulp.dest('./build/js'))
 //Обновление браузера после изменеий в JS файлах
    .pipe(browserSync.stream())
}

//Удалить все в указанной папке
function clean() {
    return del(['build/*'])
}

//Просматривать файлы и отслеживать изменения
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
// Следить за CSS файлами
    gulp.watch('./src/css/**/*.css', styles);
// Следить за JS файлами
    gulp.watch('./src/js/**/*.js', scripts);
// Следить за html файлами
    gulp.watch("./*.html").on('change', browserSync.reload);
}


// Таск, вызывающий функцию  styles (вызов таска - в терминале:gulp styles)
gulp.task('styles', styles);
// Таск, вызывающий функцию  scripts
gulp.task('scripts', scripts);
// Таск для очистки папки build
gulp.task('del', clean);
// Таск для отслеживания изменений
gulp.task('watch', watch);
// Таск для очистки папки build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
// Таск запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build', 'watch'));
