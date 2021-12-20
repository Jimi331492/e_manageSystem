<!--
 * @Author: your name
 * @Date: 2021-07-14 14:52:51
 * @LastEditTime: 2021-10-24 22:34:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\Home.vue
-->
<template>
  <el-container class="home-container">
    <!-- 头部内容区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="这是一个logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          router
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template #title>
              <!-- 图标 -->
              <i :class="iconsObj[index]"></i>

              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="savaNavState('/' + subitem.path)"
            >
              <template #title>
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subitem.menuName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 一级菜单的icons
      iconsObj: [
        'el-icon-user',
        'el-icon-key',
        'el-icon-shopping-cart-1',
        'el-icon-s-order',
        'el-icon-document-copy'
      ],
      // 是否折叠
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    window.sessionStorage.setItem('currentPathSize', 2)
    window.sessionStorage.setItem('currentCatePathSize', 5)
    window.sessionStorage.setItem('currentGoodsPathSize', 10)
    window.sessionStorage.setItem('currentOrderPathSize', 10)
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
      // console.log(res)
    },
    // 点击按钮折叠菜单栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接(组件)的激活状态
    savaNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 60px;
      height: 60px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
