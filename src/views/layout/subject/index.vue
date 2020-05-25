<template>
  <div>
    <el-card>
      <el-form :model="subjectForm" ref="subjectForm" inline>
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="subjectForm.rid" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="subjectForm.name" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="subjectForm.username" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="subjectForm.status" placeholder style="width:150px">
            <el-option label="禁用" :value="1"></el-option>
            <el-option label="启用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearAway">清除</el-button>
          <el-button type="primary" @click="add">+新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px">
      <el-table :data="list">
        <el-table-column type="index" label="序号" width="70px"></el-table-column>
        <el-table-column prop="rid" label="学科编号"></el-table-column>
        <el-table-column prop="name" label="学科名称"></el-table-column>
        <el-table-column prop="short_name" label="简称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="update_time" label="创建日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status==0?'red':'green'}"
            >{{scope.row.status==0?"禁用":"启用"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button @click="redact(scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.status==0?'danger':'success'"
              @click="toggleState(scope.row.id)"
            >{{scope.row.status==0?"启用":"禁用"}}</el-button>
            <el-button @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </el-card>
    <edit-subject ref="editref" @search="search"></edit-subject>
  </div>
</template>

<script>
import editSubject from "./subject-Add-or-modify";
export default {
  name: "subject",
  components: {
    editSubject
  },
  data() {
    return {
      subjectForm: {
        name: "", //	学科名称
        rid: "", //	学科编号
        username: "", //..	创建者用户名
        status: "" //	状态 0(禁用) 1(启用)
      },
      page: 1, //	页码 默认为1
      limit: 2, //	页尺寸 默认为10
      list: [],
      total: 0
    };
  },
  created() {
    this.subjectData();
  },
  methods: {
    async subjectData() {
      let res = await this.$axios.get("/subject/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.subjectForm
        }
      });
      if (res.data.code === 200) {
        this.list = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    search() {
      this.page = 1;
      this.subjectData();
    },
    clearAway() {
      this.$refs.subjectForm.resetFields();
      this.search();
    },
    add() {
      this.$refs.editref.editform = {
        rid: "", //学科编号
        name: "", //	学科名称
        short_name: "", //	学科简称
        intro: "", //	学科简介
        remark: "" //备注
      };
      console.log(1);

      this.$refs.editref.dialogVisible = true;
      this.$refs.editref.mode = "add";
    },
    //编辑
    redact(row) {
      let { id, rid, name, short_name, intro, remark } = row;
      this.$refs.editref.editform = {
        rid, //学科编号
        id,
        name, //	学科名称
        short_name, //	学科简称
        intro, //	学科简介
        remark //备注
      };
      this.$refs.editref.dialogVisible = true;
      this.$refs.editref.mode = "edit";
    },
    //切换状态
    async toggleState(id) {
      let res = await this.$axios.post("/subject/status", { id });
      if (res.data.code == 200) {
        this.$message({
          message: "切换成功",
          type: "success"
        });
        this.subjectData();
      } else {
        this.$message.error("切换失败");
      }
    },
    //删除
    remove(id) {
      this.$confirm("此操作将永久删除该学科, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$axios.post("/subject/remove", { id });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.search();
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
      this.search();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.subjectData();
    }
  }
};
</script>

<style>
</style>