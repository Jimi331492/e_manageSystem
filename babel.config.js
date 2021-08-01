/*
 * @Author: your name
 * @Date: 2021-07-14 01:30:10
 * @LastEditTime: 2021-07-30 07:38:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\babel.config.js
 */

// 这是项目发布阶段需要用到的 remove-console 插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  // plugins: ['transform-remove-console']
  plugins: [...prodPlugins, '@babel/plugin-syntax-dynamic-import']

}
