<template>
  <div>
    <el-card>
      <el-form :model="enterpriseForm" inline ref="searchRef">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="enterpriseForm.eid" placeholder style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="enterpriseForm.name" placeholder style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="enterpriseForm.username" placeholder style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="enterpriseForm.status" placeholder="请选择状态" style="width:150px">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearAway">清除</el-button>
          <el-button type="primary" @click="add">+新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:15px">
      <el-table :data="list">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="eid" label="企业编号"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="update_time" label="创建日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status===0?'red':'green'}"
            >{{scope.row.status===0?"禁用":'启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="280px">
          <template slot-scope="scope">
            <el-button @click="redact(scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.status===0?'success':'info'"
              @click="toggleState(scope.row.id)"
            >{{scope.row.status===0?"启用":'禁用'}}</el-button>
            <el-button @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:20px">
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
    </el-card>
    <edit ref="editRef" @search="search"></edit>
  </div>
</template>

<script>
import edit from "./Add-or-modify";
export default {
  name: "enterprise",
  components: {
    edit
  },
  data() {
    return {
      enterpriseForm: {
        name: "",
        eid: "",
        username: "",
        status: ""
      },
      page: 1,
      limit: 2,
      list: [],
      total: 0
    };
  },
  created() {
    this.getEnterpriseData();
  },
  methods: {
    async getEnterpriseData() {
      let res = await this.$axios.get("/enterprise/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.enterpriseForm
        }
      });
      console.log(res);
      if (res.data.code === 200) {
        this.list = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    search() {
      this.page = 1;
      this.getEnterpriseData();
    },
    clearAway() {
      this.$refs.searchRef.resetFields();
      this.getEnterpriseData();
    },
    add() {
       this.$refs.editRef. editForm={
        eid: "", //	企业编号
        name: "", //..	企业名称
        short_name: "", //企业简称
        intro: "", //..	企业简介
        remark: "" //	企业备注
      }
      this.$refs.editRef.dialogVisible = true;
      this.$refs.editRef.mode = "add";
    },
    //编辑
    redact(row) {
      let { id, eid, name, short_name, intro, remark } = row;
      this.$refs.editRef.editForm = {
        id,
        eid, //	企业编号
        name, //..	企业名称
        short_name, //企业简称
        intro, //..	企业简介
        remark //	企业备注
      };

      this.$refs.editRef.dialogVisible = true;
      this.$refs.editRef.mode = "edit";
    },
    //切换状态
    async toggleState(id) {
      let res = await this.$axios.post("/enterprise/status", { id });
      if (res.data.code === 200) {
        this.$message({
          message: "切换状态成功",
          type: "success"
        });
        this.getEnterpriseData();
      }
    },
    //删除
    remove(id) {
      this.$confirm("此操作将永久删除该企业, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$axios.post("/enterprise/remove", { id });
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getEnterpriseData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getEnterpriseData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getEnterpriseData();
    }
  }
};
</script>

<style>
</style>