<template>
  <div>
    <!-- 面包屑导航 -->
    <Bread nameone="权限管理" nametwo="权限列表"></Bread>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许第三级分类参数设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 选择分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            clearable
            v-model="selectedValue"
            :options="options"
            :props="propOptions"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="this.selectedValue.length !== 3 ? true : false"
            @click="addVisible = true"
            >添加参数
          </el-button>
          <!-- 表格 -->
          <el-table border :data="currentList" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot:="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  v-show="item"
                  :key="index"
                  @close="handleClose(item,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button 
                v-else class="button-new-tag" 
                size="small" 
                @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  @click="getParammsg(scope.row)"
                ></el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  @click="delParam(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="this.selectedValue.length !== 3 ? true : false"
            @click="addVisible = true"
            >添加属性
          </el-button>
          <!-- 表格 -->
          <el-table border :data="currentList" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot:="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  v-show="item"
                  :key="index"
                  @close="handleClose(item,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button 
                v-else class="button-new-tag" 
                size="small" 
                @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  @click="getParammsg(scope.row)"
                ></el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  @click="delParam(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加弹窗 -->
      <el-dialog
        @close="unshow('addParam')"
        :title="'添加'+dialogTitle"
        :visible.sync="addVisible"
        width="50%"
      >
        <el-form
          :model="addParam"
          :rules="newRules"
          ref="addParam"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="dialogTitle" prop="attr_name">
            <el-input v-model="addParam.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑弹窗 -->
      <el-dialog
        @close="unshow('editParam')"
        :title="'修改'+dialogTitle"
        :visible.sync="editVisible"
        width="50%"
      >
        <el-form
          :model="editParam"
          :rules="newRules"
          ref="editParam"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="dialogTitle" prop="attr_name">
            <el-input v-model="editParam.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      //级联选择器
      options: [],
      propOptions: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedValue: [],
      //缓存的参数对象
      paramsList: {
        only: [],
        many: [],
      },
      //tab指定的卡片名
      activeName: "many",
      //添加弹窗
      addVisible:false,
      addParam:{
        attr_name:''
      },
      //编辑弹窗
      editVisible:false,
      attr_id:'',
      editParam:{
        attr_name:'',
        attr_sel:'',
        attr_vals:''
      },
      newRules:{
        attr_name:[
          { required: true, message: "不能为空！", trigger: "blur" },
        ]
      },

     };
  },
  mounted() {
    this.getAllList();
  },
  computed: {
    //分类id
    cateID() {
      return this.selectedValue[this.selectedValue.length - 1];
    },
    //当前实际的参数对象,根据卡片名指定
    currentList() {
      return this.paramsList[this.activeName];
    },
    //弹窗标题
    dialogTitle(){
      return this.activeName==='only'? '静态属性':'动态参数'
    },
    

  },
  methods: {
    unshow(form) {
      this.$refs[form].resetFields();
    },
    //获取动态参数
    async getmany(){
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        { params: { sel: "many" } }
      );
      if (!this.$errorDialog(res)) return;
      //将数据对象的vals字符串转成数组保存
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(',')
        //新增两个属性，便于显示标签
        item.inputVisible=false
        item.inputValue=''
      })
      this.paramsList.many = res.data;
    },
    // 获取静态属性
    async getonly(){
      const { data } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        { params: { sel: "only" } }
      );
      if (!this.$errorDialog(data)) return;
      //将数据对象的vals字符串转成数组保存
      data.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(',')
        //新增两个属性，便于显示标签
        item.inputVisible=false
        item.inputValue=''
      })
      this.paramsList.only = data.data
    },
    // 获取所有分类数据
    async getAllList() {
      const { data } = await this.$http.get("categories");
      // 错误弹窗：返回值false则错误，true则正确
      if (!this.$errorDialog(data)) return;
      this.options = data.data;
    },
    //每次改变分类时重新请求获取最新的全部参数
    //将所有结果赋给指定的属性对象
     handleChange() {
      //当内容为空时，先清空之前缓存的参数对象，中断执行
      if (this.selectedValue.length !== 3) {
        this.paramsList.only = [];
        this.paramsList.many = [];
        return;
      }
      this.getmany()
      this.getonly()
    },
    //tab切换时需要显示对应参数
    handleClick() {
      console.log(this.currentList);
    },
    //添加属性或参数
    addParams(){
      //表单提交前要进行校验
      this.$addItem(
        this.$refs.addParam,
        `categories/${this.cateID}/attributes`,
        {attr_name:this.addParam.attr_name,attr_sel:this.activeName},
        this.activeName==='only'?this.getonly:this.getmany
      )
      this.addVisible=false
    },
    //修改前根据id先显示数据
    getParammsg(obj){
      this.attr_id=obj.attr_id
      this.editParam.attr_name=obj.attr_name
      this.editParam.attr_sel=obj.attr_sel
      this.editParam.attr_vals=obj.attr_vals
      this.editVisible=true
    },
    //编辑
    editParams(){
      this.$changeItem(
        this.$refs.editParam,
        `categories/${this.cateID}/attributes/${this.attr_id}`,
        this.editParam,
        this.activeName==='only'?this.getonly:this.getmany
      );
      this.editVisible = false;
    },
    //删除
    async delParam(attr_id){
      this.$delItem(`categories/${this.cateID}/attributes/${attr_id}`, this.activeName==='only'?this.getonly:this.getmany)
    },
    //新增标签
    showInput(obj){
      obj.inputVisible=true
      //自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(obj) {
      if (obj.inputValue) {
        obj.attr_vals.push(obj.inputValue)
      }
      obj.inputVisible = false;
      obj.inputValue = '';
      //更新数据
      const{data} =await this.$http.put(`categories/${this.cateID}/attributes/${obj.attr_id}`,{
        attr_name:obj.attr_name,
        attr_sel:obj.attr_sel,
        attr_vals:obj.attr_vals.join(',')
      })
      if (!this.$errorDialog(data)){
        this.$message.error('修改失败！');
        return
      } 
    },
    //删除标签
    async handleClose(item,obj){
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1)
      //更新数据
      const{data} =await this.$http.put(`categories/${this.cateID}/attributes/${obj.attr_id}`,{
        attr_name:obj.attr_name,
        attr_sel:obj.attr_sel,
        attr_vals:obj.attr_vals.join(',')
      })
      if (!this.$errorDialog(data)){
        this.$message.error('修改失败！');
        return
      } 
    }
  },
};
</script>

<style scoped>
.el-row {
  margin: 10px;
}
.el-cascader {
  width: 40%;
}
.el-tag {
  margin: 3px;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>