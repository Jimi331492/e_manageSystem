/*
 * @Author: your name
 * @Date: 2021-07-14 01:30:10
 * @LastEditTime: 2021-09-30 15:14:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\main.js
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import axios from 'axios'
import { regionData } from 'element-china-area-data'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// // 导入富文本编辑器
// import { QuillEditor } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/vue-quill.snow.css'
// // // 导入富文本编辑器样式

// import moment from 'moment'
// import Message from 'element-plus/lib/el-message/src/message'
// import { ElButton, ElInput, ElForm, ElFormItem, ElMessage } from 'element-plus'

// 配置请求的路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

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
app.use(router).use(ElementPlus, { locale }).mount('#app')
// app.config.globalProperties.$message = Message 不用全集配置 好像已经自己配置好了

// app.filter('dateFormat', function(orginVal) {
//   const dt = new Date(orginVal * 1000)
//   const y = dt.getFullYear()
//   const m = (dt.getMonth() + 1 + '').padStart(2, '0')
//   const d = (dt.getDay + '').padStart(2, '0')
//   const hh = (dt.getHours + '').padStart(2, '0')
//   const mm = (dt.getMinutes + '').padStart(2, '0')
//   const ss = (dt.getSeconds + '').padStart(2, '0')
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })
// app.use(VueQuillEditor)
// app.component('VueQuillEditor', VueQuillEditor)
// app.component(ElButton.name, ElButton)
// app.component(ElInput.name, ElInput)
// app.component(ElMessage.name, ElMessage)
// app.component(ElForm.name, ElForm)
// app.component(ElFormItem.name, ElFormItem)
