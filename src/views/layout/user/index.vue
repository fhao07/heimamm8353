<template>
  <div class="user">
    <el-card>
      <el-form inline :model="searchForm" class="demo-form-inline" ref="ValidateForm">
        <el-form-item label="用户列表" prop="username">
          <el-input v-model="searchForm.username" placeholder></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="searchForm.email" placeholder></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="searchForm.role_id" placeholder="请选择">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clearAway ">清除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUser">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px;">
      <el-table :data="userList" style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" style="color:red">禁用</span>
            <span v-if="scope.row.status==1" style="color:#6ac144">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="default" @click="editUser">编辑</el-button>
            <el-button
              @click="toggleState(scope.row.id)"
              :type="scope.row.status===0? 'success' :'info'"
            >{{scope.row.status===0? '启用' :'禁用'}}</el-button>
            <el-button type="default" @click="removeUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:15px;text-align:center;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <user-edit ref="UserEditRef"></user-edit>
    </el-card>
  </div>
</template>

<script>
import UserEdit from "./user-edit-or-add";
export default {
  name: "user",
  components: {
    UserEdit
  },
  data() {
    return {
      searchForm: {
        username: "",
        email: "",
        role_id: "" //	角色数字 2管理员、3老师、 4学生
      },
      page: 1, //查询第几页
      limit: 2, //一页几条
      userList: [],
      total: 0 //总共多少条
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let res = await this.$axios.get("/user/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      if (res.data.code == 200) {
        this.userList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getUserList();
    },
    search() {
      this.page = 1;
      this.getUserList();
    },
    clearAway() {
      this.$refs.ValidateForm.resetFields();
      this.search();
    },
    async toggleState(id) {
      let res = await this.$axios.post("/user/status", { id });
      console.log(res);
      if (res.data.code === 200) {
        this.$message({
          showClose: true,
          message: "切换成功",
          type: "success"
        });
        this.getUserList();
      } else {
        this.$message({
          showClose: true,
          message: "切换失败",
          type: "error"
        });
      }
    },
    removeUser(id) {
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$axios.post("/user/remove", { id });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addUser() {
      this.$refs.UserEditRef.dialogVisible = true;
      this.$refs.UserEditRef.mode = "add";
    },
    editUser() {
      this.$refs.UserEditRef.dialogVisible = true;
      this.$refs.UserEditRef.mode = "edit";
    }
  }
};
</script>

<style>
</style>