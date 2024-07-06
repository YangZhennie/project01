<template>
  <el-aside width="200px">
    <el-menu 
        unique-opened
        background-color="rgb(15, 61, 109)"
        text-color="#fff"
        active-text-color="#409EFF">
        <!-- 一级菜单 -->
      <el-submenu :index="`${item.id}`" v-for="item in menuList" :key="item.id">
        <!-- 菜单模块：包含图标和文字 -->
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="`${obj.id}`" v-for="obj in item.children" :key="obj.id">
          <i class="el-icon-menu"></i>
          <span>{{obj.authName}}</span>
          </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
    name:'HomeAside',
    data(){
      return{
        menuList:'',
      }
    },
    // 数据监测，代理完成后，可以用methods方法
    // 进入首页前需要获取菜单数据
    created(){
      this.getMenuList()
    },
    methods:{
      async getMenuList(){
          const {data} = await this.$http.get('menus')
          if(data.meta.status!==200) {
            this.$message.error(data.meta.msg);return
          }
          //将获取到的数据赋给存储data，便于后续渲染页面
          this.menuList = data.data

      }
    }
}
</script>

<style scoped>
.el-aside{
    position:absolute;
    top:60px;
    bottom:0px;
    left:0px;
    background-color: rgb(15, 61, 109);
}
.el-menu{
  border-right:none;
}
</style>