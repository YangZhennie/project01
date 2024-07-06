<template>
  <el-aside :width="die? '64px':'200px'">
    <el-menu 
        router
        :collapse="die"
        :collapse-transition="false"
        unique-opened
        background-color="rgb(15, 61, 109)"
        text-color="#fff"
        active-text-color="#409EFF">
      <div class="zhedie" @click="zhedie">|||</div>

      <el-submenu :index="`${item.id}`" v-for="item in menuList" :key="item.id">
        <!-- 一级菜单 -->
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="`${obj.path}`" v-for="obj in item.children" :key="obj.id">
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
        die:false,
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

      },
      zhedie(){
        this.die = !this.die
      }
    }
}
</script>

<style scoped>
.el-aside{
    background-color: rgb(15, 61, 109);
}
.el-menu{
  border-right:none;
}
.zhedie{
  width:100%;
  height:30px;
  line-height:30px;
  background-color: rgb(41, 59, 118);
  color:aliceblue;
  text-align:center;
}
</style>