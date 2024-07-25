<template>
  <div>
    <Bread nameone="商品管理" nametwo="商品列表"></Bread>
    <el-card class="box-card">
      <!-- 搜索商品 -->
      <el-input
        clearable
        placeholder="请输入内容"
        class="input-with-select"
        v-model.trim="params.query"
        @change="getGoods()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getGoods()"
        ></el-button>
      </el-input>
      <el-button type="primary" @click="addGoods">添加商品</el-button>
      <!-- 表头 -->
      <el-table :data="goods" height="550" border style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="650">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="80">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot:="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editGoods(scope.row.goods_id)"
              @close="unshow"
            ></el-button>

            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "GoodsList",
  data() {
    return {
      // 分类数据
      options: [],
      propOptions: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 参数列表
      params: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      goods: [],
      //新增商品
      dialogVisible: false,
      newGoods: {
        goods_name: "",
        goods_cat: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: [],
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
    };
  },
  mounted() {
    this.getGoods();
  },
  methods: {
    //清空表单
    unshow(form) {
      this.$refs[form].resetFields();
      if (form === "newCate") {
        this.selectedOptions = [];
        this.newCate.cat_pid = 0;
        this.newCate.cat_level = 0;
      }
    },
    // 获取所有分类数据
    async getAllList() {
      const { data } = await this.$http.get("categories");
      // 错误弹窗：返回值false则错误，true则正确
      if (!this.$errorDialog(data)) return;
      this.options = data.data;
    },
    //获取商品数据
    async getGoods() {
      const { data } = await this.$http.get("goods", { params: this.params });
      if (!this.$errorDialog(data)) return;
      this.params.pagenum = parseInt(data.data.pagenum)
      this.total = data.data.total;
      //先将时间格式化再赋值
      data.data.goods.forEach((item) => {
        item.add_time = this.formattedDate(item.add_time)
      });
      this.goods = data.data.goods;
    },
    // 时间格式
    formattedDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      const second = date.getSeconds().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      return formattedDate;
    },
    // 分页
    handleSizeChange(pageSize) {
      this.params.pagesize = pageSize
      this.getGoods()
    },
    handleCurrentChange(currentPage) {
      this.params.pagenum = currentPage
      this.getGoods()
    },
    //添加商品，跳到新路由
    addGoods() {
      this.$router.push({name:'add'})
    },
    //编辑商品
    async editGoods(id){
      //根据id找到对应信息，再传过去
      const {data} = await this.$http.get(`goods/${id}`)
      if (!this.$errorDialog(data,200)) return;
      this.$router.push({name:'edit'})
      this.$nextTick(()=>{
        this.$bus.$emit('edit',data.data)
      })
      
      
    },
    //删除商品
    delGoods(id){
      this.$delItem(`goods/${id}`,this.getGoods)
    }
  },
};
</script>

<style scoped>
.el-input-group {
  width: 30%;
  margin-bottom: 10px;
}
.el-input {
  margin-right: 10px;
}
.el-table {
  margin-bottom: 15px;
}
</style>