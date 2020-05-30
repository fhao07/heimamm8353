<template>
  <div class="upload">
    <el-upload
      class="avatar-uploader"
      :action="UP_URL + '/question/upload'"
      name="file"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
      <div v-if="type=='video'">
        <video v-if="value" :src="UP_URL+'/'+value" controls class="avatar"></video>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div v-else>
        <img v-if="value" :src="UP_URL+'/'+value" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "image"
    },
    value: String
  },
  data() {
    return {
      UP_URL: process.env.VUE_APP_BASEURL
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      //   console.log(res);

      this.$emit("input", res.data.url);
    },
    beforeAvatarUpload(file) {
      if (this.type == "video") {
        const isVideo = file.type === "video/mp4";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isVideo) {
          this.$message.error("上传视频只能是 mp4 格式!");
          return;
        }
        if (!isVideo) {
          this.$message.error("上传视频大小不能超过 2MB!");
        }
        return isVideo && isLt2M;
      } else {
        const isJPG =
          file.type === "image/jpeg" ||
          file.type === "image/gif" ||
          file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error("上传图片只能是 png/JPG/gif 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      }
    }
  }
};
</script>

<style lang="less">
.upload {
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
}
</style>