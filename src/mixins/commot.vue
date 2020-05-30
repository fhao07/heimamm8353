<script>
export default {
  methods: {
    async toggleState(url, id, getList) {
      let res = await this.$axios.post(url, { id });
      console.log(res);
      if (res.data.code === 200) {
        this.$message({
          showClose: true,
          message: "切换成功",
          type: "success"
        });
        getList();
      } else {
        this.$message({
          showClose: true,
          message: "切换失败",
          type: "error"
        });
      }
    }
  }
};
</script>