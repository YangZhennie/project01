<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

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
        >添加用户</el-button
      >
      <el-dialog
        @close="unshow"
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
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
            ></el-button>
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
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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
    //定义两个验证规则
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
      userList: [],
      total: 0,
      newUser: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
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
      params: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      dialogVisible: false,
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
    async getUsers() {
      const { data } = await this.$http.get("users", { params: this.params });
      if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg);
        return;
      }
      this.userList = data.data.users;
      this.total = data.data.total;
    },
    handleSizeChange(pageSize) {
      this.params.pagesize = pageSize;
      this.getUsers();
    },
    handleCurrentChange(currentPage) {
      this.params.pagenum = currentPage;
      this.getUsers();
    },
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
    unshow() {
      this.$refs.newUser.resetFields();
    },
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
        this.getUsers();
      });
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