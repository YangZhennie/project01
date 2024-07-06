<template>
  <div class="outer-wrap">
    <!-- 登录页 -->
    <div class="login-container">
      <!-- 头像 -->
      <div class="avatar"></div>
      <!-- 表单 -->
      <el-form
        ref="loginForm"
        label-width="0px" 
        status-icon
        id="login-form" 
        :model="loginForm" 
        :rules="rules" 
       >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input 
          placeholder="请输入用户名" 
          prefix-icon="el-icon-user" 
          v-model.lazy="loginForm.username" 
          clearable id="username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input 
          placeholder="请输入密码" 
          prefix-icon="el-icon-lock"
          v-model.lazy="loginForm.password" 
          show-password id="password"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button type="primary" plain id="btn" @click="login('loginForm')">登录</el-button>
          <el-button plain id="clean" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "myLogin",
  data(){
    return {
      loginForm: {
        username:'admin',
        password:'123456',
      },
      rules:{
        username:[
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
        ],
        password:[
          { required: true, message: '密码不能为空！', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    //预校验
    login(formName){
      this.$refs[formName].validate(async isTrue => {
        if(!isTrue){
          alert('用户名或密码输入不正确！')
        }else{
          const {data} = await this.$http.post('login',this.loginForm)
          if(data.meta.status!==200) {this.$message.error(data.meta.msg); return}
          else {
            //提示弹窗
            this.$message({
            message: '登录成功！',
            type: 'success'
          })
            //保存token令牌,才能浏览其他页面
            sessionStorage.setItem('token',data.data.token)
            //编程式导航跳转主页
            this.$router.push('home')
          }
        }
      } )
    }
  }
};
</script>

<style scoped>
/*  盒子居中：两个盒子嵌套，利用子绝父相，实现盒子自适应于父盒子
    外层div的宽高设置为浏览器视窗大小，相对定位。内层div绝对定位，
    将top属性和left属性分别设置为50%，然后再设置负边距，大小分别是height和width的一半 */
.outer-wrap {
  height: 100%;
  position: relative;
  background-color: rgb(16, 63, 82);
  background: url(../assets/imgs/bg.jpeg) no-repeat center 0px;
}
.login-container {
  width: 450px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -225px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: white solid 6px;
  /* padding: 3px; */
  background-image: url('../assets/imgs/login-logo.png');
  background-position:-22px -5px;
	background-size: cover;
  position: absolute;
  left: 50%;
  margin-left: -50px;
  margin-top: -50px;
  background-color: rgb(255, 255, 255);
}

#login-form {
  position:absolute;
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  bottom:0px;
  width:84%;
  
}

</style>
