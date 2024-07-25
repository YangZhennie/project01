<template>
    <el-form label-position="top">
      <el-form-item 
      v-for="item in onlyList"
      :label="item.attr_name"
      :key="item.attr_id">
        <el-input v-if="item.attr_value" v-model="item.attr_value"></el-input>
        <el-input v-else-if="item.attr_vals" v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: ["cateID","form"],
    data() {
        return {
        onlyList: [],
        };
    },

    mounted() {
        console.log('this.form.attrs',this.form.attrs)
        //编辑状态初始化,将设置的参数值回显页面
        this.$bus.$on('getshowAtt',(flag)=>{
            
            if(flag!==0) return
            // 将form中对应的many数据回显给paramsList
            //先过滤出only属性的数组

            this.onlyList = this.form.attrs.filter(item=>{
                            return item.attr_sel==='only'
            })
            console.log('调用了静态属性函数')
           
        })
        //获取动态参数，调用时机：当选择器变化时
        this.$bus.$on('getonly',async(flag)=>{
            if(flag!==1) return
            const { data } = await this.$http.get(
                `categories/${this.cateID}/attributes`,
                { params: { sel: "only" } }
            );

            if (!this.$errorDialog(data)) return;
            this.onlyList = data.data
        })
    
    },
}
</script>

<style>

</style>