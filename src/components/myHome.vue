<template>
  <button @click="tuichu">退出登录</button>
</template>

<script>
export default {
    name:'Home',
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

<style>

</style>