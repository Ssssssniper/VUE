<template>
  <div>
    <h3>用户信息页面</h3>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span>员工信息</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>信息列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <el-page-header @back="goBack" content="信息列表"></el-page-header>

    <!-- <el-table :data="tableData">
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="age" label="年龄" width="100"></el-table-column>
      <el-table-column prop="sex" label="性別" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="130"></el-table-column>
      <el-table-column prop="tel" label="联系电话" width="180"></el-table-column>
      <el-table-column prop="depart" label="部门信息" width="180"></el-table-column>
    </el-table>-->
    <!-- 用户列表主体    使用卡片容器进行展示-->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="name_input" placeholder="请输入用户名" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>

        <el-button icon="el-icon-search" @click="search"></el-button>

        <!-- <el-col :span="6">
          <el-button @click="add">添加人员</el-button>
        </el-col>-->
      </el-row>
    </el-card>
    <el-table
      :data="tableData.list"
      border
      style="width: 100%"
      :header-cell-style="{'text-align':'center'}"
    >
      <el-table-column prop="id" label="序号" width="180" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180" align="center"></el-table-column>
      <el-table-column prop="gender" label="性别" align="center"></el-table-column>
      <el-table-column prop="age" label="年龄" align="center"></el-table-column>
      <el-table-column prop="tel" label="电话" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="depart.part" label="部门" align="center"></el-table-column>
    </el-table>
    <div class="block">
      <!--  size-change:页码< >大小; current-change -->
      <el-pagination
        :size-change="10"
        @current-change="Handle"
        @current-page="getEmployeeList"
        :page-size="tableData.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      options: [
        {
          value: 'female',
          label: '女'
        },
        {
          value: 'male',
          label: '男'
        }
      ],
      value: '',
      name_input: ''
    }
  },
  // onload加载事件
  created() {
    this.getEmployeeList()
  },
  //普通方法
  methods: {
    async getEmployeeList() {
      const { data: tabledata } = await this.$http.get('/emps?pn=' + this.page) // 传参？pn
      console.log('获取用户信息')
      console.log(tabledata)
      if (tabledata.code != 200) {
        return this.$message.error('获取数据失败！')
      }
      this.tableData = tabledata.extend.data
      console.log(this.tableData)
    },
    async search() {
      console.log('提交姓名和性别值:', this.name_input, this.value)
      const { data: querydata } = await this.$http.post(
        '/queryemps/' + this.name_input + '/' + this.value
      )
      if (querydata.code != 200) {
        return this.$message.error('发生错误')
      }
      this.tableData = querydata.extend.data
    },
    add() {
      console.log('添加')
    },
    goBack() {
      console.log('回首页')
      this.$router.push({ path: '/home' })
    },
    async Handle(pn) {
      this.page = pn
      console.log(`当前页：${this.page}`)
      const { data: tabledata } = await this.$http.get('/emps?pn=' + this.page) // 传参？pn
      if (tabledata.code != 200) {
        return this.$message.error('获取数据失败！')
      }
      this.tableData = tabledata.extend.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 17px;
}
.el-pagination {
  text-align: right;
}
</style>