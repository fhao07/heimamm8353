<template>
  <div>
    <el-card>
      <el-form :model="questionForm" ref="questionForm" inline>
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科" prop="subject">
              <el-select v-model="questionForm.subject" placeholder="请选择学科">
                <el-option
                  v-for="item in subjectList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="阶段" prop="step">
              <el-select v-model="questionForm.step" placeholder="请选择阶段">
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="questionForm.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题型" prop="type">
              <el-select v-model="questionForm.type" placeholder="请选择题型">
                <el-option v-for="(value,name) in typeObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="questionForm.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(value,name) in difficultyObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作者" prop="username">
              <el-input v-model="questionForm.username" placeholder style="width:230px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="questionForm.status" placeholder="请选择难度">
                <el-option label="禁用" :value="0"></el-option>
                <el-option label="启用" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker
                v-model="questionForm.create_date"
                type="date"
                placeholder="请选择日期"
                style="width:230px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="questionForm.title" placeholder style="width:580px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="clearAway">清除</el-button>
              <el-button type="primary" @click="add">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px">
      <el-table :data="questionList" border stripe>
        <el-table-column label="序号" type="index" width="75px"></el-table-column>
        <el-table-column label="题目">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column label="学科，阶段">
          <template slot-scope="scope">
            <span v-if="scope.row.step==1">{{scope.row.subject_name}}.初级</span>
            <span v-else-if="scope.row.step==2">{{scope.row.subject_name}}.中级</span>
            <span v-else>{{scope.row.subject_name}}.高级</span>
          </template>
        </el-table-column>
        <el-table-column label="题型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">单选</span>
            <span v-else-if="scope.row.type==2">多选</span>
            <span v-else>简答</span>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="enterprise_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status==0?'red':'green'}"
            >{{scope.row.status==0?"禁用":"启用"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问" prop="enterprise"></el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" @click="redact(scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.status==0?'success':'danger'"
              @click="toggleState(scope.row.id)"
            >{{scope.row.status==0?"启用":"禁用"}}</el-button>
            <el-button type="primary" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <edit-question
      ref="editQuestionRef"
      :subjectList="subjectList"
      :enterpriseList="enterpriseList"
      :typeObj="typeObj"
      :stepObj="stepObj"
      :difficultyObj="difficultyObj"
      @search="search"
    ></edit-question>
  </div>
</template>

<script>
import editQuestion from "./question-Add-or-modify";
export default {
  name: "question",
  components: {
    editQuestion
  },
  data() {
    return {
      questionForm: {
        subject: "", //学科
        enterprise: "", //企业
        step: "", // 题目阶段
        type: "", //题目类型
        difficulty: "", //题目难度
        username: "", //作者
        create_date: "", //日期
        status: "", //状态
        title: "" //标题
      },
      subjectList: [],
      enterpriseList: [],
      typeObj: { 1: "单选", 2: "多选", 3: "简答" },
      stepObj: { 1: "初级", 2: "中级", 3: "高级" },
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" },
      questionList: [],
      page: 1,
      limit: 2,
      total: 0
    };
  },
  created() {
    this.getSubjectListData();
    this.getEnterpriseListData();
    this.getQuestionListData();
  },
  methods: {
    async getSubjectListData() {
      let res = await this.$axios.get("/subject/list");
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
      }
    },
    async getEnterpriseListData() {
      let res = await this.$axios.get("/enterprise/list");
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
      }
    },
    async getQuestionListData() {
      let res = await this.$axios.get("/question/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.questionForm
        }
      });
      if (res.data.code === 200) {
        this.questionList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    add() {
      this.$refs.editQuestionRef.mode = "add";
      this.$refs.editQuestionRef.editForm = {
        subject: "",
        step: "",
        enterprise: "",
        type: 1,
        difficulty: 1,
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
      };

      this.$refs.editQuestionRef.dialogVisible = true;
    },
    //搜索
    search() {
      this.page = 1;
      this.getQuestionListData();
    },
    //清除
    clearAway() {
      console.log(1);

      this.$refs.questionForm.resetFields();
      this.search();
    },

    //切换
    async toggleState(id) {
      let res = await this.$axios.post("/question/status", { id });
      if (res.data.code == 200) {
        this.$message({
          message: "切换成功",
          type: "success"
        });
        this.getQuestionListData();
      }
    },
    //编辑
    redact(row) {
      this.$refs.editQuestionRef.mode = "edit";
      this.$refs.editQuestionRef.editForm = JSON.parse(JSON.stringify(row));
      this.$refs.editQuestionRef.editForm.city = row.city.split(",");
      if (row.city) {
        this.$refs.editQuestionRef.editForm.city = row.city.split(",");
      } else {
        this.$refs.editQuestionRef.editForm.city = [];
      }
      if (row.multiple_select_answer) {
        this.$refs.editQuestionRef.editForm.multiple_select_answer = row.multiple_select_answer.split(
          ","
        );
      } else {
        this.$refs.editQuestionRef.editForm.multiple_select_answer = [];
      }
      this.$refs.editQuestionRef.dialogVisible = true;
    },
    //删除
    remove(id) {
      console.log(1);

      this.$confirm("此操作将永久删除该题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$axios.post("/question/remove", { id });
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
      this.getQuestionListData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getQuestionListData();
    }
  }
};
</script>

<style>
</style>