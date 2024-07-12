<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{name1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{name2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    props:['nameone','nametwo'],
    data(){
        return{
            name1:this.name1,
            name2:this.name2
        }
    }
}
</script>
