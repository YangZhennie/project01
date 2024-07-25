<template>
    <el-form
    label-position="top"
    :model="newGoods"
    :rules="newRules"
    ref="forms"
    label-width="100px"
    class="demo-ruleForm"
    >
    <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="newGoods.goods_name"></el-input>
    </el-form-item>
    <el-form-item label="价格" prop="goods_price">
        <el-input
        v-model.number="newGoods.goods_price"
        type="number"
        min="0"
        ></el-input>
    </el-form-item>
    <el-form-item label="数量" prop="goods_number">
        <el-input
        v-model.number="newGoods.goods_number"
        type="number"
        min="0"
        ></el-input>
    </el-form-item>
    <el-form-item label="重量" prop="goods_weight">
        <el-input
        v-model.number="newGoods.goods_weight"
        type="number"
        min="0"
        ></el-input>
    </el-form-item>
    <el-form-item label="','分割的分类列表" prop="goods_cat">
        <!-- 级联选择器 -->
        <el-cascader
        clearable
        v-model="newGoods.goods_cat"
        :options="options"
        :props="propOptions"
        @change="handleChange"
        >
        </el-cascader>
    </el-form-item>
    </el-form>
</template>

<script>
export default {
    props:['activeIndex','form'],
    data() {
    return {
      //编辑或添加功能标识符，0为编辑初始化，1为编辑和添加(选择器都会变)。事件触发：级联选择器变化时
      flag:0,
      // 分类数据
      options: [],
      propOptions: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      newGoods: {
        goods_name: "" ,
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight:0,
      },
     newRules: {
        goods_name: [
          { required: true, message: "不能为空！", trigger: "blur" },
        ],
        goods_cat: [{ required: true, message: "不能为空！", trigger: "blur" }],
        goods_price: [
          { required: true, message: "不能为空！", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "不能为空！", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "不能为空！", trigger: "blur" },
        ],
      },
      }
    },
    // 使用 watch 监听 form 的变化
    watch: {
      form: {
        handler(newVal, oldVal) {
          
          if (newVal) {
            this.newGoods.goods_name = newVal.goods_name || '';
            this.newGoods.goods_price = newVal.goods_price || 0;
            this.newGoods.goods_number = newVal.goods_number || 0;
            this.newGoods.goods_weight = newVal.goods_weight || 0;
            this.newGoods.goods_cat = newVal.goods_cat.split(',').map(item=>{
              return parseInt(item)
            }) 
          }
        },
        immediate: true, // 立即执行一次 handler，确保初始化时也能响应
      },
      activeIndex: {
        handler(newVal, oldVal) {
          if(this.flag===0){
            // 监听tab页的切换,当切换其他页且标识符不为1(0表示分类选择器没变化)
            if(newVal==='1'){
                this.$nextTick(()=>{
                  this.$bus.$emit('getshowParams', (this.flag))
                })       
            }else if(newVal==='2'){
                this.$nextTick(()=>{
                  this.$bus.$emit('getshowAtt', (this.flag))
                })
            }
          }
        },
      },
    },
    computed:{
      // 分类id
      cateID(){
        return this.newGoods.goods_cat?this.newGoods.goods_cat[2]:''
      }
    },
    //初次加载会调用，缓存后会跳过该周期
    mounted() {
      this.getAllList()
    },

    methods: {
        // 获取所有分类数据
        async getAllList() {
            const { data } = await this.$http.get("categories");
            // 错误弹窗：返回值false则错误，true则正确
            if (!this.$errorDialog(data)) return;
            this.options = data.data;
        },
        //级联变化时
        handleChange() {
            //如果用户再次变换分类选择器，则将标识符flag更改为1
            this.flag=1
            
            this.getParamsAtt()
        },
        //获取动态和静态参数
        getParamsAtt(){
            //编辑：当选择器有数据时，先获取参数和属性，没有数据则return
            if(this.newGoods.goods_cat.length===0) return
            //添加：选择器没有数据，先判断长度，选到第三类才有效
            if (this.newGoods.goods_cat.length !== 3) 
              this.newGoods.goods_cat = []
            //把分类id传到需要该参数的组件（静态属性和参数）
            this.$bus.$emit('getCateID',this.cateID)
            //等到分类id更新后再调用该函数，因此延迟执行
            this.$nextTick(()=>{
              if(this.newGoods.goods_cat.length!== 3) return
              this.$bus.$emit('getmany',this.flag)
              this.$bus.$emit('getonly',this.flag)
            })
        },
        //表单验证，父级控制调用该方法，（时机：当tab切换时）
        validateHandle() {
            // status用来判断是否校验成功
            let status = null
            this.$refs["forms"].validate((val) => {
                if (val) {
                status = true
                }else {
                status = false
                }
            })
            return status
        },
    },
}
</script>

<style scoped>

</style>