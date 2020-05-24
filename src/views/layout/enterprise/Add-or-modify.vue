<template>
  <el-dialog :visible.sync="dialogVisible" width="600px" center :rules="rules">
    <span slot="title">{{mode=='add'?'新增企业':'编辑企业'}}</span>
    <el-form :model="editForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="企业编号" prop="eid">
        <el-input v-model="editForm.eid"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" prop="short_name">
        <el-input v-model="editForm.short_name"></el-input>
      </el-form-item>
      <el-form-item label="企业简介" prop="intro">
        <el-input v-model="editForm.intro"></el-input>
      </el-form-item>
      <el-form-item label="企业备注" prop="remark">
        <el-input v-model="editForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      mode: "",
      editForm: {
        eid: "", //	企业编号
        name: "", //..	企业名称
        short_name: "", //企业简称
        intro: "", //..	企业简介
        remark: "" //	企业备注
      },
      rules: {
        eid: [{ required: true, message: "请选择企业编号", trigger: "blur" }],
        name: [{ required: true, message: "请选择企业名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请选择企业简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请选择企业简介", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/enterprise/add", this.editForm);
        } else {
          // 修改
          res = await this.$axios.post("/enterprise/edit", this.editForm);
        }
        if (res.data.code == 200) {
          this.$message({
            message: this.mode === "add" ? "新增成功~" : "编辑成功~",
            type: "success"
          });
          // 关闭当前的对话框
          this.dialogVisible = false;
          this.$emit("search");
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  watch: {
    dialogVisible(newValue) {
      console.log(newValue);
      if (!newValue) {
        this.$refs.ruleForm.clearValidate();
      }
    }
  }
};
</script>

<style lang="less">
.el-dialog__header {
  background: #0b7fc6;
  color: #fff;
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>