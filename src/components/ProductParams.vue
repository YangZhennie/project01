<template>

    <el-form label-position="top">
      <el-form-item 
      v-for="item in paramsList"
      :label="item.attr_name"
      :key="item.attr_id">
      <el-checkbox-group v-if="item.attr_value" v-model="item.attr_value">
        <el-checkbox 
          v-for="(item2, index) in item.attr_value"
          :label="item2"
          :key="index"
          border>
        </el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group v-else-if="item.attr_vals" v-model="item.attr_vals">
        <el-checkbox 
          v-for="(item2, index) in item.attr_vals"
          :label="item2"
          :key="index"
          border>
        </el-checkbox>
      </el-checkbox-group>
      </el-form-item>
    </el-form>

</template>

<script>
export default {
  props: ["activeIndex", "cateID","form"],
  data() {
    return {
      paramsList: [],
    };
  },
  mounted() {
    console.log('this.form.attrs',this.form.attrs)
    //编辑状态初始化,将设置的参数值回显页面
    this.$bus.$on('getshowParams',(flag)=>{
      
      if(flag!==0) return
      // 将form中对应的many数据回显给paramsList
      //先过滤出many属性的数组
      let re = this.form.attrs.filter(item=>{
        return item.attr_sel==='many'
      })
      //再对属性做变换
      re.forEach(item => {
        item.attr_value = item.attr_value.length===0?[]:item.attr_value.split(',')
      })
      this.paramsList=re
      console.log('调用了参数函数');
    })

    //获取动态参数，调用时机：当选择器变化时
    this.$bus.$on('getmany',async(flag)=>{
      if(flag!==1) return
      //当用户编辑时，调用分类id的接口
      const { data } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        { params: { sel: "many" } }
      )
      if (!this.$errorDialog(data)) return
      // 将属性拆分成数组保存
      data.data.forEach(item => {
        item.attr_vals = item.attr_vals.length===0?[]:item.attr_vals.split(',')
      })
      this.paramsList = data.data
    })
    
  },
  
  beforeDestroy(){
    this.$off('getmany')
    this.$off('getshowParams')
  },
};
</script>

<style scoped>
.el-checkbox{
  margin:0 10px 5px 0 !important;
}
</style>