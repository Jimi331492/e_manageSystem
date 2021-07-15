/*
 * @Author: your name
 * @Date: 2021-07-14 01:30:10
 * @LastEditTime: 2021-07-15 02:38:36
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
// import Message from 'element-plus/lib/el-message/src/message'
// import { ElButton, ElInput, ElForm, ElFormItem, ElMessage } from 'element-plus'

// 配置请求的路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})

const app = createApp(App)
app.config.globalProperties.$http = axios
// app.config.globalProperties.$message = Message 不用全集配置 好像已经自己配置好了

app.use(ElementPlus, { locale })
// app.component(ElButton.name, ElButton)
// app.component(ElInput.name, ElInput)
// app.component(ElMessage.name, ElMessage)
// app.component(ElForm.name, ElForm)
// app.component(ElFormItem.name, ElFormItem)
app.use(router).mount('#app')
