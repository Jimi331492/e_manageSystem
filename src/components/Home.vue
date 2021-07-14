<!--
 * @Author: your name
 * @Date: 2021-07-14 14:52:51
 * @LastEditTime: 2021-07-14 18:11:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\home.vue
-->
<template>
  <div class="">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    }
  }
}
</script>

<style lang="less" scoped></style>
