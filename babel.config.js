/*
 * @Author: your name
 * @Date: 2021-07-14 01:30:10
 * @LastEditTime: 2021-07-28 05:56:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\babel.config.js
 */
// 这是项目发布阶段需要用到的 babel 插件
// const prodPlugins = []
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: ['transform-remove-console']
}
