<template>
  <el-upload
    :headers="setHeader"
    class="upload-demo"
    :action="baseUrl"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success="onSuccess"
    :file-list="fileList"
    list-type="picture"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <!-- 预览图片 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <img :src="imgURL" alt="" />
    </el-dialog>
  </el-upload>
</template>

<script>
export default {
  props: ["cateID", "form"],
  data() {
    return {
      setHeader: {
        Authorization: sessionStorage.getItem("token") || "",
      },
      baseUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      //存放临时路径
      pics: [],
      //存放绝对路径
      imgURL: "",
      // //回显用的列表
      fileList: [],
      dialogVisible: false,
    };
  },
  watch: {
    form(newval, oldval) {
      if (newval) {
        //先清空列表，防止保存上次回显的图片
        this.fileList = [];
        this.pics = [];
        //将props接收的图片数组遍历，构造出新的file对象，加入到fileList，实现回显
        let regex = /_(.+)$/;
        this.fileList = newval.pics.map((item) => {
          let match = item.pics_big.match(regex);
          let re = match ? match[1] : "";
          let obj = {
            name: re,
            response: {
              data: {
                url: item.pics_big_url,
                tmp_path: "tmp_uploads\\" + re,
              },
            },
            url: item.pics_big_url,
          };
          this.pics.push({ pic: obj.response.data.tmp_path });
          return obj;
        });
      }
    },
  },
  methods: {
    //点击图片
    handlePreview(file) {
      this.imgURL = file.response.data.url;
      this.dialogVisible = true;
    },
    //移除图片
    handleRemove(file) {
      this.pics = this.pics.filter((item) => {
        return item.pic !== file.response.data.tmp_path;
      });
    },
    onSuccess(response) {
      this.pics.push({ pic: response.data.tmp_path });
    },
  },
};
</script>

<style scoped>
img {
  width: 100%;
}
</style>