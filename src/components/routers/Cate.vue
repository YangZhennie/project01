<template>
  <div>
    <Bread nameone="商品管理" nametwo="商品分类"></Bread>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showCate">添加分类</el-button>
      <el-dialog
        @close="unshow('newCate')"
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form
          :model="newCate"
          :rules="newRules"
          ref="newCate"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="newCate.cat_name"></el-input>
          </el-form-item>

          <!-- 级联选择器 -->
          <el-form-item label="父级分类">
            <div class="block">
              <el-cascader
                @change="handleChange"
                clearable
                :options="addOptions"
                :props="defaultParams"
                v-model="selectedOptions"
              >
              </el-cascader>
            </div>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <el-table
        :data="cateList"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        height="550"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <!-- 自定义索引 -->

        <el-table-column type="index" label="#" width="50"> </el-table-column>

        <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180">
          <template v-slot:="scope">
            <i
              v-if="!scope.row.cat_deleted"
              class="el-icon-success"
              style="color: lightgreen"
            ></i>
            <i
              v-if="scope.row.cat_deleted"
              class="el-icon-error"
              style="color: red"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序" width="180">
          <template v-slot:="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-if="scope.row.cat_level === 1" type="success"
              >二级</el-tag
            >
            <el-tag v-if="scope.row.cat_level === 2" type="warning"
              >三级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot:="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="getCatemsg(scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delCate(scope.row.cat_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[2, 3, 4, 5]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改弹窗 -->
      <el-dialog
        @close="unshow('editCate')"
        title="修改分类"
        :visible.sync="editVisible"
        width="50%"
      >
        <el-form
          :model="editCate"
          :rules="newRules"
          ref="editCate"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类ID">
            <el-input :value="editCate.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCate.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeCate()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      //请求参数
      params: {
        type: 3,
        pagenum: 1,
        pagesize: 2,
      },
      // 总页数
      total: 0,
      //分类数据
      cateList: [],
      newRules: {
        cat_name: [{ required: true, message: "不能为空！", trigger: "blur" }],
      },
      //级联选择器数据
      addOptions: [],
      //级联选择器配置
      defaultParams: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: "true",
      },
      //级联选择器选择结果,必须为数组
      selectedOptions: [],
      newCate: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      //修改弹窗表单
      editCate: {
        id: 0,
        cat_name: "",
      },
      //弹窗显示
      dialogVisible: false,
      editVisible: false,
    };
  },
  created() {
    this.getCateList();
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
    //获取分类数据
    async getCateList() {
      const { data } = await this.$http.get("categories", {
        params: this.params,
      });
      this.$errorDialog(data);
      this.cateList = data.data.result;
      this.total = data.data.total;

      // 删除最后一页数据时返回上一页
      //不能直接写在删除函数里：此为异步函数，要遭异步后再作判断
      if(this.cateList.length === 0 && this.params.pagenum > 1){
          this.params.pagenum--;
          this.getCateList();
        } 
    },
    // 分页
    handleSizeChange(pageSize) {
      this.params.pagesize = pageSize;
      this.getCateList();
    },
    handleCurrentChange(currentPage) {
      this.params.pagenum = currentPage;
      this.getCateList();
    },
    //显示分类数据
    async showCate() {
      //获取二级数据
      const { data } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      this.$errorDialog(data);
      this.addOptions = data.data;
      this.dialogVisible = true;
    },
    // 添加分类
    addCate() {
      //表单提交前要进行校验
      this.$addItem(
        this.$refs.newCate,
        "categories",
        this.newCate,
        this.getCateList,
      );

      this.dialogVisible = false;
    },

    //监测级联选择器父类id的变化
    //从而修改添加分类的参数
    handleChange() {
      //说明选择了父类
      if (this.selectedOptions.length > 0) {
        //可知添加的等级正好等于数组的长度
        this.newCate.cat_level = this.selectedOptions.length;
        //父类id是最后一个值
        this.newCate.cat_pid =
          this.selectedOptions[this.selectedOptions.length - 1];
      }
    },
    //显示修改数据
    getCatemsg(obj) {
      this.editCate.id = obj.cat_id;
      this.editCate.cat_name = obj.cat_name;
      this.editVisible = true;
    },
    //修改分类名称
    changeCate() {
      this.$changeItem(
        this.$refs.editCate,
        "categories/" + this.editCate.id,
        { cat_name: this.editCate.cat_name },
        this.getCateList
      );
      this.editVisible = false;
    },
    //删除分类
    async delCate(id) { 
      // 当点击确认，pormise对象返回字符串confirm,取消返回cancel
      const a = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      if (a === "cancel") return;
      const { data } = await this.$http.delete("categories/" + id);
      // 错误弹窗：返回值false则错误，true则正确
      if (!this.$errorDialog(data)) return;
      this.$message.success("删除成功！");
      //重新获取服务器数据，待total和cateList都更新后再判断
      this.getCateList();
    },
  },
};
</script>

<style scoped>
.el-button {
  margin-bottom: 10px;
}
.el-cascader{
    width:100%;
}
</style>