<template>
  <div>
    <Bread nameone="商品管理" nametwo="编辑商品"></Bread>
    <el-card class="box-card">
      <el-alert
        title="编辑商品信息"
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

            <Infomation ref="Infomation" :form="form" :activeIndex="activeIndex"></Infomation>
  
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1" >
  
            <ProductParams
              :cateID="cateID"
              ref="ProductParams"
              :form="form"
            ></ProductParams>
         
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2" >
     
            <ProductAttributes
              :cateID="cateID"
              ref="ProductAttributes"
              :form="form"
            ></ProductAttributes>
       
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
         
            <ProductImages
              :cateID="cateID"
              ref="ProductImages"
              :form="form"
            ></ProductImages>
      
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <ProductContent :form="form" ref="ProductContent"></ProductContent>
          <el-button type="primary" style="margin: 10px 0" @click="editProduct">编辑商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Infomation from "../RroductInfomation.vue";
import ProductParams from "../ProductParams.vue";
import ProductAttributes from "../ProductAttributes.vue";
import ProductImages from "../ProductImages.vue";
import ProductContent from "../ProductContent.vue";
import Completion from "../Completion.vue";

export default {
  components: {
    Infomation,
    ProductParams,
    ProductAttributes,
    ProductImages,
    ProductContent,
    Completion,
  },
  data() {
    return {
      activeIndex: "0",
      //分类id
      cateID: 0,
      form: "",
    };
  },
  mounted() {
    
    //接收传来的数据
    this.$bus.$on("edit", (data) => {
      this.form = data;
    });
    //获取分类id
    this.$bus.$on("getCateID", (id) => {
      this.cateID = id;
    });
  },
  beforeDestroy() {
    this.$off("getCateID");
    this.$off("edit");
  },
  methods: {
    //Tab栏切换预验证
    beforeleave(newName, oldName) {
      //标识符，通过改变值来决定是否切换，0切1不切
      let flag = 0;
      //基本信息：表单一预验证
      if (oldName === "0") {
        let infoResult = this.$refs["Infomation"].validateHandle();
        if (!infoResult) {
          flag = 1;
          return false;
        }
      }
    },
    //编辑商品
    async editProduct() {
      let addInfo = {
        goods_name: this.$refs["Infomation"].newGoods.goods_name,
        goods_cat: this.$refs["Infomation"].newGoods.goods_cat.join(","),
        goods_price: this.$refs["Infomation"].newGoods.goods_price,
        goods_number: this.$refs["Infomation"].newGoods.goods_number,
        goods_weight: this.$refs["Infomation"].newGoods.goods_weight,
        goods_introduce: this.$refs["ProductContent"].content,
        pics: this.$refs["ProductImages"].pics,
        attrs: [],
      };
      //处理动态参数
      this.$refs["ProductParams"].paramsList.forEach((item) => {
        const a = {
          attr_id: item.attr_id,
          attr_value: item.attr_value ? item.attr_value.join(",") : item.attr_vals.join(","),
        };
        addInfo.attrs.push(a);
      })
      //处理静态属性
      this.$refs["ProductAttributes"].onlyList.forEach((item) => {
        const a = {
          attr_id: item.attr_id,
          attr_value: item.attr_value || item.attr_vals,
        }
        addInfo.attrs.push(a);
      })
      //提交到服务器
      const { data } = await this.$http.put(
        `goods/${this.form.goods_id}`,
        addInfo
      );
      // 错误弹窗：返回值false则错误，true则正确
      if (!this.$errorDialog(data))  return
      //提交成功后弹出提示框，重新渲染数据
      this.$message({
        message: "修改成功！",
        type: "success",
      });
      this.$router.push("/goods");
    },
  },
};
</script>

<style scoped>
.el-steps {
  margin: 10px 0;
}
</style>