<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{nameone}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{nametwo}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    props:['nameone','nametwo'],
}
</script>
