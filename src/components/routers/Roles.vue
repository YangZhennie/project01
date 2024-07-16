<template>
  <div>
    <Bread nameone="权限管理" nametwo="角色列表"></Bread>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="dialogVisible = true"
        >添加角色</el-button>
      <el-dialog
        @close="unshow('newRole')"
        title="添加角色"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form
          :model="newRole"
          :rules="newRules"
          ref="newRole"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="newRole.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="newRole.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <el-table :data="rolesData" height="550" border style="width: 100%">
        <!-- 具体权限 -->
        <el-table-column type="expand" label=" " width="50">
          <!-- 插槽渲染标签 -->
          <template v-slot:="scope">
          
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :class="index === 0 ? '' : 'isBorder'"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable="" @close="removeRight(scope.row, item)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item.children"
                  :key="item2.id"
                  :class="index2 === 0 ? '' : 'isBorder'"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRight(scope.row, item2)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRight(scope.row, item3)"
                    >
                      {{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot:="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="getRolemsg(scope.row)"
              @close="unshow"
            ></el-button>

            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delRole(scope.row.id)"
            ></el-button>

            <!-- 设置 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="设置权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
                @click="showSet(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改弹窗 -->
      <el-dialog
        @close="unshow('editRole')"
        title="修改角色"
        :visible.sync="editVisible"
        width="50%"
      >
        <el-form
          :model="editRole"
          :rules="newRules"
          ref="editRole"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRole.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRole.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 设置弹窗 -->
      <el-dialog title="设置权限" :visible.sync="setdialogVisible" width="30%">
        <!-- 权限树 -->
        <el-tree
          ref="tree"
          :data="setData"
          :props="defaultProps"
          @node-click="showSet"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="checkedArray"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="displayNode">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesData: [],
      newRole: {
        roleName: "",
        roleDesc: "",
      },
      // 权限树
      setData: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      roleId: "",
      checkedArray: [],
      newRules: {
        roleName: [
          { required: true, message: "角色名称不能为空！", trigger: "blur" },
        ],
      },
      editRole: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      dialogVisible: false,
      editVisible: false,
      setdialogVisible: false,
    };
  },
  mounted() {
    this.getRolesList();
  },
  methods: {
    unshow(form) {
      this.$refs[form].resetFields();
    },
    // 获取角色列表
    async getRolesList() {
      const { data } = await this.$http.get("roles");
      this.$errorDialog(data);
      this.rolesData = data.data;
    },
    //添加角色
    addRole() {
      //表单提交前要进行校验
      this.$addItem(this.$refs.newRole, "roles", this.newRole,this.getRolesList)
      this.dialogVisible = false
    },
    // 显示角色
    getRolemsg(obj) {
      //显示弹窗
      this.editVisible = true;
      this.editRole.id = obj.id;
      this.editRole.roleName = obj.roleName;
      this.editRole.roleDesc = obj.roleDesc;
    },
    // 修改角色
    changeRole() {
      //提交前预验证
      this.$changeItem(this.$refs.editRole,"roles/" + this.editRole.id,this.editRole,this.getRolesList)
      this.editVisible = false
    },
    // 删除角色
    async delRole(id) {
      // 当点击确认，pormise对象返回字符串confirm,取消返回cancel
      const a = await this.$confirm("此操作将永久删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((error) => error);
      if (a === "cancel") return;
      const { data } = await this.$http.delete("roles/" + id);
      this.$errorDialog(data);
      this.$message.success("删除成功！");
      this.getRolesList();
    },
    // 删除权限
    async removeRight(role, right) {
      // 当点击确认，pormise对象返回字符串confirm,取消返回cancel
      const a = await this.$confirm("此操作将永久删除权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((error) => error);
      if (a === "cancel") return;
      const { data } = await this.$http.delete(
        `roles/${role.id}/rights/${right.id}`
      );
      this.$errorDialog(data);
      this.$message.success("取消权限成功！");
      // 问题：为什么将更新后的数据赋给原来的页面数据？
      // Vue.js数据驱动的优势。 Vue.js框架通过数据驱动视图的方式工作，只要正确更新了数据，
      // 相关的视图（比如通过v-for生成的标签）会自动响应更新。因此，直接修改role.children
      // 的数据可以保证标签的展开状态和内容随着数据的变化而更新，而不需要手动重新生成或渲染标签。
      //标签会保持展开状态不会收起
      role.children = data.data;
    },
    //用递归判断每个节点是否有children属性，若无则为三级节点，将id加入数组中
    searchNode(node, array) {
      if (!node.children) {
        array.push(node.id);
      } else {
        node.children.forEach((obj) => {
          this.searchNode(obj, array);
        });
      }
    },
    //获取权限树渲染到设置弹窗
    async showSet(node) {
      //每次打开先清空上次留下的id数组
      this.checkedArray = [];
      //  将获得的三级权限id赋给checkedArray，以便树节点可以被选中
      //用递归判断每个节点是否有children属性，若无则为三级节点，将id加入数组中
      this.searchNode(node, this.checkedArray);

      this.setdialogVisible = true;
      const { data } = await this.$http.get("rights/tree");
      this.$errorDialog(data);
      console.log(data);
      this.setData = data.data;
      //保存对应的角色id，便于后期渲染角色标签
      this.roleId = node.id;
    },
    //获取选中的节点
    async displayNode() {
      this.setdialogVisible = false;
      console.log(this.roleId);
      // 返回所有选中的节点id
      const arrayID = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ];
      const str = arrayID.join(",");
      const { data } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: str,
      });
      this.$errorDialog(data);
      this.$message({ message: "更新成功！", type: "success" });
      this.getRolesList();
    },
  },
};
</script>

<style scoped>
.el-row {
  margin: auto 15px;
}
.el-tag {
  margin: 10px;
}
.isBorder {
  border-top: 1px solid rgba(121, 121, 121, 0.3);
}
</style>