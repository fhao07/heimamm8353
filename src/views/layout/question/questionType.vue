<template>
  <div class="questionType">
    <div v-if="editForm.type==1">
      <div
        v-for="(item, index) in editForm.select_options"
        :key="index"
        class="item"
        @change="changeValue"
      >
        <el-radio v-model="editForm.single_select_answer" :label="item.label"></el-radio>
        <el-input v-model="item.text" style="margin-right:20px"></el-input>
        <upload-file v-model="item.image"></upload-file>
      </div>
    </div>
    <div v-if="editForm.type==2">
      <div
        v-for="(item, index) in editForm.select_options"
        :key="index"
        class="item"
        @change="changeValue"
      >
        <el-checkbox v-model="editForm.multiple_select_answer" :label="item.label"></el-checkbox>
        <el-input v-model="item.text" style="margin-left:20px;margin-right:20px"></el-input>
        <upload-file v-model="item.image"></upload-file>
      </div>
    </div>
    <div v-if="editForm.type==3" @change="changeValue">
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="editForm.short_answer"></el-input>
    </div>
  </div>
</template>

<script>
import uploadFile from "./uplaod-file";
export default {
  name: "Typequestion",
  props: ["editForm"],
  components: {
    uploadFile
  },
  methods: {
    changeValue() {
      this.$emit("childChange");
    }
  }
};
</script>

<style lang="less">
.questionType {
  .item {
    display: flex;
    align-items: center;
  }
}
</style>