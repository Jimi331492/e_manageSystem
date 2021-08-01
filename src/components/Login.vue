<!--
 * @Author: your name
 * @Date: 2021-07-14 03:01:40
 * @LastEditTime: 2021-07-29 00:27:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\login.vue
-->
<template>
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="..\assets\logo.png" alt="avatar" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    console.log('isme')
  },
  methods: {
    // 重置按钮的点击事件
    resetLoginForm() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    // 登录按钮的点击事件
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return

        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(result)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // console.log(res)
        // 1.将登录成功之后的 token， 保存到客户端的 sessionStorage 中
        // 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        // token 直营在当前网站打开期间生效，所以将 token 保存在sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页，/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #eee;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 50px 0 50px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  float: right;
}
</style>
