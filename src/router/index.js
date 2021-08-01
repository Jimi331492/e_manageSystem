/*
 * @Author: your name
 * @Date: 2021-07-14 01:30:10
 * @LastEditTime: 2021-07-31 05:44:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\router\index.js
 */
import { createRouter, createWebHashHistory } from 'vue-router'
// import { createRouter, createWebHashHistory } from 'vue-router'
// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
const Welcome = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')

// import Users from '../components/user/Users'
const Users = () =>
  import(/* webpackChunkName: "user" */ '../components/user/Users')

// import Roles from '../components/right/Roles'
// import Rights from '../components/right/Rights'
const Roles = () =>
  import(/* webpackChunkName: "right" */ '../components/right/Roles')
const Rights = () =>
  import(/* webpackChunkName: "right" */ '../components/right/Rights')

// import Orders from '../components/order/Orders'
const Orders = () =>
  import(/* webpackChunkName: "order" */ '../components/order/Orders')

// import Goods from '../components/goods/Goods'
// import Params from '../components/goods/Params'
// import Add from '../components/goods/addGoods'
// import Categories from '../components/goods/Categories'
const Goods = () =>
  import(/* webpackChunkName: "goods" */ '../components/goods/Goods')
const Params = () =>
  import(/* webpackChunkName: "goods" */ '../components/goods/Params')
const Categories = () =>
  import(/* webpackChunkName: "goods" */ '../components/goods/Categories')
const Add = () =>
  import(/* webpackChunkName: "goods" */ '../components/goods/addGoods')

// import Reports from '../components/report/Reports'
const Reports = () =>
  import(/* webpackChunkName: "report" */ '../components/report/Reports')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/orders', component: Orders },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/reports', component: Reports },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/categories', component: Categories },
      { path: '/goods/add', component: Add }
    ]
  }
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'notFound',
  //   component: notFound // 引入 组件
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表哪个路径跳转而来
  // next()函数表示放行 next('./login')强制跳转
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
