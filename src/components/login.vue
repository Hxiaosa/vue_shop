<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <!-- 注意element组件要在对应js文件中按需导入 -->
      <!-- ref是表单的实例对象 -->
      <!-- :model是element中固定的v-bind单向数据绑定，是表单数据对象 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <!-- 注意密码要设置类型为密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>

        <!-- 两个按钮 -->
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
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    resetLoginForm() {
      // 这里的this就是表单实例对象
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 传入的参数为一个回调函数，传入两个参数，传入成功与否的布尔值和未通过校验的字段
      // 将返回的结果进行解构赋值，提取出data数据赋值为res对象 data: res
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')

        // 1、将登录成功之后的token保存到客户端的sessionStorage中
        // 1.1 项目中除了登录之外的其他API接口，必须在登录后才能访问；
        // 1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中；

        window.sessionStorage.setItem('token', res.data.token)
        // 2、通过编程式导航跳转到后台主页，路由地址是/home）
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
//最外层大页面
.login_container {
  background-color: #c55b48;
  height: 100%;
}

//圆形盒子
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  // 也可以居中
  // left: 0;
  // right: 0;
  // top: 0;
  // bottom: 0;
  // margin:auto;

  //装图像的
  .avatar_box {
    height: 80px;
    width: 80px;
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
    padding: 0 20px;
    padding-bottom: 10px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
