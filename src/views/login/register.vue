<template>
  <div>
    <el-dialog center :visible.sync="dialogVisible" width="600px">
      <div slot="title" class="title">用户注册</div>

      <el-form :model="registerform" :rules="rules" ref="registerFormRef" label-width="80px">
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="uploadsURL"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="registerform.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerform.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerform.password"></el-input>
        </el-form-item>
        <el-form-item label="图形码" prop="code">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-input v-model="registerform.code"></el-input>
            </el-col>
            <el-col :span="5">
              <img class="captcha" :src="codeUrl" alt @click="coderefresh" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-input v-model="registerform.rcode"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button style="width:100%" @click="getRcode">获取用户验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "register",
  data() {
    return {
      codeUrl: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms",
      uploadsURL: process.env.VUE_APP_BASEURL + "/uploads",
      imageUrl: "",
      dialogVisible: false,
      registerform: {
        username: "",
        phone: "",
        email: "",
        avatar: "",
        password: "",
        rcode: "",
        code: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入邮箱"));
              }
              let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
              if (!reg.test(value)) {
                return callback(new Error("邮箱格式不正确"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入手机号"));
              }
              let reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号格式不正确"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "密码长度为6-12", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 4, message: "图形码长度为4", trigger: "blur" }
        ],
        rcode: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 4, max: 4, message: "验证码长度为4", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //上传之前的回调函数，用来检验图片是否合格
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //上传图片之后的回调函数，用来获取数据
    handleAvatarSuccess(res) {
      console.log(res);
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
      this.registerform.avatar = res.data.file_path;
    },
    coderefresh() {
      this.codeUrl =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms&xx=" +
        Math.random();
    },
    async getRcode() {
      let res = await this.$axios.post("/sendsms", {
        code: this.registerform.code,
        phone: this.registerform.phone
      });

      console.log(res);
      if (res.data.code == 200) {
        this.$message({
          message: "获取成功",
          type: "success"
        });
        this.registerform.rcode = res.data.data.captcha;
      } else {
        this.$message.error(res.data.message);
      }
    },
    submitForm() {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return;
        let res = await this.$axios.post("/register", this.registerform);
        if (res.data.code == 200) {
          this.$message({
            message: "获取成功",
            type: "success"
          });
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
      /*  this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return;
        const res = await this.$axios.post("/register", this.resgisterForm);
        if (res.data.code === 200) {
          // 提示
          this.$message({
            message: "注册成功~",
            type: "success"
          });
          // 关闭掉当前窗口
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      }); */
    }
  }
};
</script>

<style  lang="less">
.register {
  .title {
    height: 53px;
    background: #03c0f9;
    color: #fff;
    text-align: center;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .captcha {
    width: 100%;
    height: 40px;
  }
}
.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>