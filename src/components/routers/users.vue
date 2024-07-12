<template>
  <div>
    <Bread name1="用户管理" name2="用户列表"></Bread>

    <el-card class="box-card">
      <!-- 搜索用户 -->
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        v-model.lazy="params.query"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getUsers()"
        ></el-button>
      </el-input>
      <el-button type="primary" @click="dialogVisible = true"
        >添加用户</el-button>
      <el-dialog
        @close="unshow('newUser')"
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form
          :model="newUser"
          :rules="newRules"
          ref="newUser"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="newUser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="newUser.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="newUser.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="newUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 表头 -->
      <el-table :data="userList" height="550" border style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 设置状态样式-->
          <template v-slot:="scope">
            <el-switch
              @change="changeStatus(scope.row)"
              v-model="scope.row.mg_state"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template v-slot:="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="getUsermsg(scope.row)"
              @close="unshow"
            ></el-button>

            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="showMessage(scope.row.id)"
            ></el-button>

            <!-- 设置 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    <!-- 修改弹窗 -->
    <!-- 使用场景：用户点击某行按钮弹出窗口，并显示该行数据
    问题：利用组件的scope.row可获取改行数据，当不要将弹窗卸载表格的</el-table-column>里，因为整列都会执行该命令，
    且表单数据会依次被后一行覆盖
    解决：写在表格外面，点击某一行时调用点击事件，传入用户数据参数，赋给data的editUser，再用v-model显示在表单 -->
      <el-dialog
        @close="unshow('editUser')"
        title="修改用户"
        :visible.sync="editVisible"
        width="50%"
      >
        <el-form
          :model="editUser"
          :rules="newRules"
          ref="editUser"
          label-width="100px"
          class="demo-ruleForm"
        > 
        <el-form-item label="用户名">
            <el-input :value="editUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUser.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色弹窗 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setDialogVisible"
        width="30%"
        >
        <div>
          <p>当前用户：{{userinfo.username}}</p>
          <p>当前角色：{{userinfo.role_name}}</p>
          <p>角色选择：
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 3, 4]"
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
  name: "Users",
  data() {
    //自定义两个验证规则
    //验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      }
      const email =
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!email.test(value)) {
        callback(new Error("请输入正确的邮箱格式！"));
      } else callback();
    };
    //验证手机号
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      }
      const mobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!mobile.test(value)) {
        callback(new Error("请输入正确的手机格式！"));
      } else callback();
    };
    return {
      // 用户列表
      userList: [],
      total: 0,
      // 添加用户
      newUser: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 修改用户
      editUser:{
        id:"",
        username: "",
        email: "",
        mobile: "",
      },
      // 校验规则
      newRules: {
        username: [
          { required: true, message: "用户名不能为空！", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空！", trigger: "blur" },
        ],
        email: [{ validator: validateEmail, trigger: "blur" }],
        mobile: [{ validator: validateMobile, trigger: "blur" }],
      },
      //请求参数
      params: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      //用户分配角色时的基本信息
      userinfo:'',
      roleList:[],
      value:'',
      //不同弹窗的显示状态
      dialogVisible: false,
      editVisible:false,
      setDialogVisible:false,
    };
  },
  created() {
    this.getUsers();
  },
  watch: {
    // 监测query属性，当为空时重新渲染完整数据
    "params.query": {
      deep: true,
      handler(newQuery) {
        if (!newQuery) this.getUsers();
      },
    },
  },
  methods: {

    unshow(form) {
      this.$refs[form].resetFields();
    },
    //获取服务器用户数据
    async getUsers() {
      const { data } = await this.$http.get("users", { params: this.params });
      if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg);
        return;
      }
      this.userList = data.data.users;
      this.total = data.data.total;
    },
    // 分页
    handleSizeChange(pageSize) {
      this.params.pagesize = pageSize;
      this.getUsers();
    },
    handleCurrentChange(currentPage) {
      this.params.pagenum = currentPage;
      this.getUsers();
    },
    // 修改状态
    async changeStatus(status) {
      const { data } = await this.$http.put(
        `users/${status.id}/state/${status.mg_state}`
      );
      if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg);
        return;
      }
      this.$message({
        message: data.meta.msg,
        type: "success",
      });
    },
    // 新增用户
    addUser() {
      //表单提交前要进行校验
      this.$refs.newUser.validate(async (isTrue, obj) => {
        if (!isTrue) {
          this.$message.error("提交失败，请确认输入格式！");
          return;
        }
        //验证为true则提交到服务器
        const { data } = await this.$http.post("users", this.newUser);
        console.log(data);
        if (data.meta.status !== 201) {
          this.$message.error(data.meta.msg);
          return;
        }
        //提交成功后关闭表单，并弹出提示框，再重新渲染用户数据
        this.dialogVisible = false;
        this.$message({
          message: "添加成功！",
          type: "success",
        });
        this.getUsers()
      });
    },
    //根据id获取某个用户数据
    getUsermsg(obj){
      //显示弹窗
      this.editVisible = true
      this.editUser.id = obj.id
      this.editUser.username = obj.username
      this.editUser.email = obj.email
      this.editUser.mobile = obj.mobile
    },
    //修改用户
    changeUser(){
      //提交前预验证
      this.$refs.editUser.validate(async(boolean, object)=>{
        if(!boolean){this.$message.error('输入格式错误！');return}
        const {id,email,mobile} = this.editUser
        //将数据提交到服务器
        const {data} = await this.$http.put('users/'+id,{id,email,mobile})
        this.$errorDialog(data)
        // 更新后关闭弹窗，更新页面表格数据
        this.$message({message:'更新成功！',type:'success'})
        this.editVisible = false
        this.getUsers()
      })
    },
    //错误弹窗
    async showMessage(id){
      // 当点击确认，pormise对象返回字符串confirm,取消返回cancel
        const a = await this.$confirm('此操作将永久删除管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).catch(error=>error)
        if(a==='cancel') return
        const {data} = await this.$http.delete('users/'+id)
        this.$errorDialog(data)
        this.$message.success('删除成功！')
        this.getUsers()
    },
    // 显示角色
    async setRole(obj){
      
      //获取角色列表
      const {data}=await this.$http.get('roles')
      this.$errorDialog(data)
      this.roleList=data.data
      // 先把用户和原来角色名显示弹窗
      this.userinfo=obj
      this.setDialogVisible=true
    },
    //修改角色
    async changeRole(){
      //通过选择器的value数据判断用户是否选择
      if(!this.value) {this.$message.error('修改失败！');return}
      const {data}=await this.$http.put(`users/${this.userinfo.id}/role`,{rid:this.value})
      this.$errorDialog(data)
      this.$message({message:data.meta.msg,type:'success'})
      console.log(data)
      this.getUsers()
      this.setDialogVisible=false
      this.value=''
    },
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