<template>
  <div class="questionEdit">
    <el-dialog :visible.sync="dialogVisible" fullscreen>
      <span class="title" slot="title">{{mode=="add"?"新增题目":"编辑题目"}}</span>
      <el-form
        :model="editForm"
        ref="editFormRef"
        class="form"
        label-position="left"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="学科" prop="subject">
          <el-select v-model="editForm.subject" placeholder="请选择学科" class="selectWidth">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select v-model="editForm.step" placeholder="请选择阶段" class="selectWidth">
            <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="editForm.enterprise" placeholder="请选择学科" class="selectWidth">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-cascader v-model="editForm.city" :options="options" :props="{value:'label'}"></el-cascader>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="editForm.type" @change="childChange">
            <el-radio v-for="(value, name) in typeObj" :key="name" :label="+name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="editForm.difficulty">
            <el-radio v-for="(value, name) in difficultyObj" :key="name" :label="+name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <hr class="hrMargin" />
        <el-form-item label="试题标题" prop="title" class="setMargin">
          <quill-editor
            v-model="editForm.title"
            :options="{placeholder:'请输入标题...'}"
            @change="changeQuillEditor('title')"
          />
        </el-form-item>
        <el-form-item :label="typeObj[editForm.type]" :prop="propSelect[editForm.type]">
          <question-type :editForm="editForm" @childChange="childChange"></question-type>
        </el-form-item>
        <hr class="hrMargin" />
        <el-form-item label="解析视频">
          <upload-file type="video" v-model="editForm.video"></upload-file>
        </el-form-item>
        <el-form-item label="答案解析" prop="answer_analyze" class="setMargin">
          <quill-editor
            v-model="editForm.answer_analyze"
            :options="{placeholder:'请输入答案解析...'}"
            @change="changeQuillEditor('answer_analyze')"
          />
        </el-form-item>
        <el-form-item label="答案备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Submit">立即创建</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from "element-china-area-data";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import questionType from "./questionType";
import uploadFile from "./uplaod-file";
export default {
  name: "editquestion",
  components: {
    quillEditor,
    questionType,
    uploadFile
  },
  props: {
    subjectList: Array, ///学科
    enterpriseList: Array, //企业
    typeObj: Object, //题目类型
    stepObj: Object, //题目阶段
    difficultyObj: Object //题目难度
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.$refs.editFormRef.clearValidate();
      }
    }
  },
  data() {
    return {
      propSelect: {
        1: "single_select_answer",
        2: "multiple_select_answer",
        3: "short_answer"
      },
      dialogVisible: false,
      mode: "",
      options: regionData, //,城市
      editForm: {
        subject: "",
        step: "",
        enterprise: "",
        type: "1",
        difficulty: "1",
        city: [],
        title: "", //标题
        video: "", //视频解析
        answer_analyze: "", //答案解析
        remark: "",
        single_select_answer: "", //单选题答案
        multiple_select_answer: [], //多选题答案
        short_answer: "", //	简答题答案
        select_options: [
          {
            label: "A",
            text: "shift",
            image: ""
          },
          {
            label: "B",
            text: "pop",
            image: ""
          },
          {
            label: "C",
            text: "splice",
            image: ""
          },
          {
            label: "D",
            text: "slice",
            image: ""
          }
        ] //图片介绍
      },
      rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "change" }],
        step: [{ required: true, message: "请选择阶段", trigger: "change" }],
        enterprise: [
          { required: true, message: "请选择企业", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        type: [{ required: true, message: "请选择题型", trigger: "change" }],
        difficulty: [
          { required: true, message: "请选择难度", trigger: "change" }
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "change" }],
        answer_analyze: [
          { required: true, message: "答案解析不能为空", trigger: "change" }
        ],
        remark: [
          { required: true, message: "答案备注不能为空", trigger: "blur" }
        ],
        single_select_answer: [
          { required: true, message: "单选答案不能为空", trigger: "blur" }
        ],
        multiple_select_answer: [
          { required: true, message: "多选答案不能为空", trigger: "blur" }
        ],
        short_answer: [
          { required: true, message: "简答答案不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    childChange() {
      this.$refs.editFormRef.validateField([
        "single_select_answer",
        "multiple_select_answer",
        "short_answer"
      ]);
    },
    changeQuillEditor(value) {
      // console.log(value);

      this.$refs.editFormRef.validateField(value);
    },
    Submit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/question/add", this.editForm);
        } else {
          // 修改;
        }
        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "创建成功" : "编辑成功",
            type: "success"
          });
          this.dialogVisible = false;
          this.$emit("search");
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.questionEdit {
  .title {
    color: #fff;
    padding-left: 15px;
    height: 54px;
    line-height: 54px;
    // background-color: #04bcfa;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .form {
    width: 832px;
    margin: 0 auto;
  }
  .selectWidth {
    width: 300px;
  }
  .hrMargin {
    margin-bottom: 20px;
  }
  .setMargin {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 40px;
    }
  }
  .ql-editor {
    height: 150px;
  }
}
</style>