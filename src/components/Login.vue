<template>
  <div class="Login">
    <div class="container">
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form :label-position="label" ref="loginformRef" :model="loginForm" class="login_form">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="输入用户名"
            prefix-icon="iconfont icon_username_real icon-icon_username_real"
            size="medium"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="输入密码"
            prefix-icon="iconfont sq-password icon-icons- "
            size="medium"
            style="width:250px"
            show-password
          />
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="loginBtn">
            登录
            <i class="iconfont log-in icon-log-in"></i>
          </el-button>
          <el-button type="info" @click="resetBtn">
            重置
            <i class="iconfont reset icon-reset"></i>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      label: 'right',
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      employee: [],

      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录按钮触发事件
    loginBtn() {
      this.$refs.loginformRef.validate(async valid => {
        // console.log(valid); // true  or  false
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        // console.log(res);
        console.log(res.status)
        // 后台返回数据成功
        if (res.status == 'success') {
          // 跳转
          this.$message({
            message: '登录成功!',
            type: 'success'
          })
          console.log(res.data)
          window.sessionStorage.setItem('user', JSON.stringify(res.data))
          this.$router.push({ path: '/home' })

          //获得员工信息res
          // const { data: employee } = await this.$http.get("/emps");
        } else {
          this.$message.error('登录失败！')
        }
      })
    },
    // 重置按钮触发事件
    resetBtn() {
      // 重置内容  需要配合表单中的prop属性才能生效
      this.$refs.loginformRef.resetFields()
      this.$message({
        message: 'reset 成功!',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  text-align: center;
  width: 200px;
  height: 200px;
  border: 2px solid #eee;
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 0 5px #ddd;
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%, 0%);
  .img {
    border-radius: 50%;
    width: 200px;
    height: 200px;
  }
}
.login_form {
  background-color: beige;
  border-radius: 4px;
  width: 400px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); // 关键！！
  padding: 20px;
}
.btn {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
  // text-align: center;
}
.container {
  background-color: rgb(27, 224, 224);
  height: 100%;
}
.Login {
  height: 100%;
}
</style>