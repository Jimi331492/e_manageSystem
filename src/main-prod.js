/*
 * @Author: your name
 * @Date: 2021-07-14 01:30:10
 * @LastEditTime: 2021-07-31 11:36:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\main.js
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import Nprogress from 'nprogress'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
// import locale from 'element-plus/lib/locale/lang/zh-cn'
import axios from 'axios'
import regionData from 'element-china-area-data'

// // 导入富文本编辑器
// import { QuillEditor } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/vue-quill.snow.css'
// // // 导入富文本编辑器样式

// import moment from 'moment'
// import Message from 'element-plus/lib/el-message/src/message'
// import { ElButton, ElInput, ElForm, ElFormItem, ElMessage } from 'element-plus'

// 配置请求的路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://47.108.206.212:9999/api/private/v1/'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

// 在request拦截器，展示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')

  // 最后必须return config
  return config
})
// 在response拦截器，隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

const app = createApp(App)
app.config.globalProperties.$http = axios
app.config.globalProperties.$regionData = regionData
app.use(router).use(ElementPlus).mount('#app')
// app.config.globalProperties.$message = Message 不用全集配置 好像已经自己配置好了
