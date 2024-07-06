<template>
        <el-header>
            <div>
                <img src="../assets/imgs/login-logo.png" alt="">
                <span> 后台管理系统 </span>
            </div>
            <el-button type="info" @click="tuichu">退出登录</el-button> 
        </el-header>
</template>

<script>
export default {
    name:'HomeHeader',
    methods:{
        tuichu(){
            //清空token
            sessionStorage.clear()
            //自动跳转登录页
            this.$router.replace('/login')
        }
    }
}
</script>

<style scoped>
.el-header{
    position:relative;
    width:100%;
    background-color: rgb(1, 73, 117);
    font-size:20px;
    color:aliceblue;
    display:flex;
    justify-content:space-between;
    align-items:center;

}
.el-header div {
    display:flex;
    align-items:center;
}
.el-header img{
    width:35px;
    height:35px;
    margin-right:10px;
    border-radius:50%;
    background-color: aliceblue;
}
</style>