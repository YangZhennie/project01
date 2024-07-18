<template>
  <div>
    <Bread nameone="商品管理" nametwo="添加商品"></Bread>
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-tabs
        tab-position="left"
        v-model="activeIndex"
        :before-leave="beforeleave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form
            label-position="top"
            :model="newGoods"
            :rules="newRules"
            ref="newGoods"
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
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        <el-tab-pane label="完成" name="5">完成</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      // 分类数据
      options: [],
      propOptions: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      newGoods: {
        goods_name: "",
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
      },
      // newGoods: {
      //     goods_name: "",
      //     goods_cat: [],
      //     goods_price: 0,
      //     goods_number: 0,
      //     goods_weight: 0,
      //     goods_introduce: "",
      //     pics: [],
      //     attrs: [],
      // },
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
    };
  },
  mounted() {
    this.getAllList();
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
      if (this.newGoods.goods_cat.length !== 3) this.newGoods.goods_cat = [];
    },
    //Tab栏切换
    beforeleave(newName, oldName) {
      //标识符，通过改变值来决定是否切换，0切1不切
      let flag = 0;
      //表单一预验证
      this.$refs.newGoods.validate(async (isTrue, obj) => {
        if (!isTrue) flag = 1;
      });

      if (flag === 1) return false;
    },
  },
};
</script>

<style scoped>
.el-steps {
  margin: 10px 0;
}
</style>