<template>
  <div>
    <h3>配置文件上传管理</h3>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="http://localhost:8888/demo/Upload/configfile"
          accept=".tk, .png"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-progress="handleProgress"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary" @click="selectFile">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <!-- 进度条 -->
          <el-progress
            class="progress"
            :text-inside="true"
            :stroke-width="26"
            :percentage="progress"
          ></el-progress>
          <div slot="tip" class="el-upload__tip">请上传.tk配置文件</div>
        </el-upload>
      </el-col>
      <el-col :span="4">
        <el-button type="default" size="small">普通按钮下载功能</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-table
        :data="FileData"
        border
        style="width: 100%"
        max-height="650"
        :header-cell-style="{'text-align':'center'}"
      >
        <el-table-column prop="fcode" label="电报码" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center"></el-table-column>
        <el-table-column prop="fnodeType" label="节点类型" align="center"></el-table-column>
        <el-table-column prop="fnodeId" label="节点ID" align="center"></el-table-column>
        <el-table-column prop="fnodeName" label="节点名称" width="100" align="center"></el-table-column>
        <el-table-column prop="fipAddress" label="IP地址" width="130" align="center"></el-table-column>
        <el-table-column prop="felectricServiceSection" label="电务段" align="center"></el-table-column>
        <el-table-column prop="fworkshop" label="车间" align="center"></el-table-column>
        <el-table-column prop="fline" label="线路" align="center"></el-table-column>
        <el-table-column prop="fcompany" label="厂家" align="center"></el-table-column>
        <el-table-column prop="fversion" label="型号" align="center"></el-table-column>
        <el-table-column prop="fworkArea" label="工区" align="center"></el-table-column>
        <el-table-column prop="fnodeSequence" label="节点顺序" align="center"></el-table-column>
        <el-table-column prop="fstationServerId" label="车站所属服务器ID" align="center"></el-table-column>
        <el-table-column prop="extractType" label="提取类型" align="center"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      FileData: [],
      fileList: [],
      progress: 0
    }
  },
  methods: {
    selectFile() {
      this.progress = 0
    },
    submitUpload() {
      this.$refs.upload.submit() // 上传事件
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.$notify({
        title: '文件大小：',
        message: (file.size / 1024).toFixed(2) + 'M',
        duration: 2000
      })
      console.log(file)
    },
    // 从文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 文件上传成功时的钩子  response:      file
    handleSuccess(response, file) {
      console.log(response, file)
      URL.createObjectURL(file.raw)
      this.$message({
        message: '文件上传成功!',
        type: 'success'
      })
      this.FileData = response.extend.data
      console.log(this.FileData)
      //   本文件上传成功，则清空进度条    下面语句未生效，需要更改
      setTimeout('selectFile()', 2000)
      //   this.progress = 0
    },
    // 上传时的钩子
    handleProgress(event, file, fileList) {
      console.log(event.loaded / event.total)
      this.progress = 100 * (event.loaded / event.total)
    },
    // 上传失败
    handleError() {
      this.$message.error('文件上传失败')
      this.progress = 0
    }
  }
}
</script>
<style lang="less" scoped>
.inline-block {
  display: inline-block;
}
</style>