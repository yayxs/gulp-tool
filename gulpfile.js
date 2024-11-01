const gulp = require('gulp')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

/**
 * clean 任务
 * gulp.src 指定删除的文件路径
 * { read: false, allowEmpty: true }
 *
 * 不读取文件内容，直接删除，提高任务速度
 * allowEmpty: true 即使dist没有文件 任务正常完成
 */
gulp.task('clean', function () {
  return gulp
    .src(['./dist/*.js'], { read: false, allowEmpty: true })
    .pipe(clean())
})

/**
 * 转译和压缩
 */
gulp.task(
  'jsmin',
  // 优先执行clean 任务
  gulp.series('clean', function () {
    return (
      gulp
        // 读取src下所有的js文件
        .src(['./src/*.js'])
        // Babel 转译 转换向后兼容的JS代码
        .pipe(babel())
        .pipe(
          // 转译后的文件进行压缩
          uglify({
            mangle: {
              // 在压缩过程中保留的变量名字
              reserved: [
                // 微信小程序的API
                'wx',
                // 支付宝小程序的API
                'my',
                // 模块化关键词
                'import',
                'from',
                'module.exports',
                'export',
                'default'
              ]
            }
          })
        )
        // 输出压缩后的文件
        .pipe(gulp.dest('./dist'))
    )
  })
)

gulp.task('build', gulp.series('jsmin'))
