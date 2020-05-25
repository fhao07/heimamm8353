<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" width="30%" center>
      <div slot="title">{{mode=="add"?"新增学科":"编辑学科"}}</div>
      <el-form :model="editform" ref="editform" label-width="100px" :rules="rules">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="editform.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="editform.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="editform.short_name"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input v-model="editform.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" prop="remark">
          <el-input v-model="editform.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editform: {
        rid: "", //学科编号
        name: "", //	学科名称
        short_name: "", //	学科简称
        intro: "", //	学科简介
        remark: "" //备注
      },
      dialogVisible: false,
      mode: "",
      rules: {
        rid: [{ required: true, message: "请填写学科编号", trigger: "blur" }],
        name: [{ required: true, message: "请填写学科名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请填写学科简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请填写学科简介", trigger: "blur" }],
        remark: [{ required: true, message: "请填写学科备注", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.editform.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/subject/add", this.editform);
        } else {
          //修改
          res = await this.$axios.post("/subject/edit", this.editform);
        }
        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "创建成功" : "修改成功",
            type: "success"
          });
          this.$emit("search");
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  watch: {
    dialogVisible(newval) {
      console.log(newval);
      if (!newval) {
        this.$refs.editform.clearValidate();
      }
    }
  }
};
</script>

<style>
</style>