<template>
  <div>
    <!-- 面包屑导航 -->
    <Bread nameone="权限管理" nametwo="权限列表"></Bread>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table :data="rightsData" height="650" border style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <!-- 作用域插槽 设置状态样式-->
          <template v-slot:="scope">
            <!-- 条件渲染 -->
            <el-tag v-if="scope.row.level==='0'">等级一</el-tag>
            <el-tag type="success" v-if="scope.row.level==='1'">等级二</el-tag>
            <el-tag type="warning" v-if="scope.row.level==='2'">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data(){
    return {
      rightsData:[],
      level:''
    }
  },
  mounted(){
    this.getRightsList()
  },
  methods:{
    // 获取权限列表
    async getRightsList(){
      const {data} = await this.$http.get('rights/list')
      this.$errorDialog(data)
      this.rightsData = data.data
    },

  }
};
</script>

<style>
</style>