<!--
 * @Author: your name
 * @Date: 2021-07-14 01:30:10
 * @LastEditTime: 2021-08-01 14:27:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\README.md
-->
# e_managesystem一个基于Vue3+ElementUI Plus的电商后台管理系统

## 项目预览
#### [点击预览](https://www.mmgoodstudy.icu/e_manageSystem_Preview/)

## 功能
用于管理用户账号，商品分类，商品信息，订单，数据统计等业务功能
![Image text](https://cdn.jsdelivr.net/gh/Jimi331492/cdn/img/aboutProject/e_mS_1.png)

## 开发模式
电商后台管理系统整体采用前后端分离的开发模式,其中前端项目是基于Vue技术栈的SPA项目
![Image text](https://cdn.jsdelivr.net/gh/Jimi331492/cdn/img/aboutProject/e_mS_2.png)

## 项目技术栈
* Vue3
* Vue-router
* ElementUI Plus
* Axios
* Echarts

## 项目依赖
### 运行依赖
* axios => 发送请求
* echarts => 数据可视化
* lodash => js工具库,该项目用到深拷贝与对象合并
* moment => 时间格式化处理工具库
* nprogress => 进度条库

### 开发依赖
* babel => es6+语法转换
* eslint/babel-eslint => 语法检查
* less/less-loader => less语法
* babel-plugin-transform-remove-console => 移除console
* babel/plugin-syntax-dynamic-import => 将import 的写法自动转换为按需引入的方式

## 项目优化
### 项目优化策略
* 生成打包报告
通过命令行参数形式生成报告=>vue-cli-service build --report
通过可视化ui面板直接查看报告(通过控制台和分析面板)
* 通过vue.config.js修改webpack的默认配置
``` vue.config.js
 const externals = {vue:'Vue'} //需要从外部引入的依赖项，减小打包体积
 // cdn的引用注意先后顺序，例 ElementUI Plus是基于Vue3开发的 必须先引用Vue再引用ElementUI Plus 不然会导致白屏，组件加载不出来
 const cdn={
     css:[url],
     js:[url]
 }

 module.exports = {
     //生产模式以./相对路径为根目录，不然打包部署后可能会导致白屏
     publicPath: process.env.NODE_ENV === 'production' ? './' : '/', 
     outputDir: 'dist' //打包后输出的文件夹名

     //chain模式配置Webpack
     chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
        config
            .entry('app')
            .clear()
            .add('./src/main-prod.js') //配置不同的入口文件
        config.externals(externals)// 配置从外部获取依赖项，减小打包体积
        config.plugin('html').tap(args => {
            args[0].isProd = true //首页内容定制
            args[0].cdn = cdn // 还需要再index.html中用<link><script>forEach导入各个cdn文件
            return args
        })
        })

        //开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
        config
            .entry('app')
            .clear()
            .add('./src/main-dev.js')
        config.plugin('html').tap(args => {
            args[0].isProd = false
            return args
        })
    })
     }
 }
```

* 为开发模式与发布模式指定不同的打包入口(在vue.config.js配置)
开发模式入口文件 src/main-dev.js
发布模式入口文件 src/main-prod.js

* 第三方库启用CDN
在public/index.html文件头部,将main-prod中的已经进行配置的import(样式表)删除替换为cdn引入

* 首页内容定制 (在vue.config.js配置)

## 项目展示
#### 通过GitHub Page + 后端API公共接口 实现预览
1.在GitHub里先创建一个库，并打开GitHub Page服务
2.将打包生成的dist文件夹上传到GitHub里的库中
3.输入网址即可查看

#### 注意事项
1.Vue项目中路由得用Hash模式，不然可能无法预览
2.公共API得是Https，并开启Enforce HTTPS(在GitHub库里的Setting下的Page项最下面)

## 最后说明
由于各种原因，所以没有单独的写后端，为了省钱也没有配置服务器来，所以此方法只能展示，预览项目
但我觉得很香，这也算是我第一个项目了，经过这个项目，我学习到了很多，例如前后端分离开发，SPA单页面应用
总结就是ElementUI Plus很强大，对于Vue我可能还需要一点时间来继续深入的理解