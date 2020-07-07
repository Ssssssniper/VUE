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
        <el-col :span="12">
          <el-input placeholder="搜索内容" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button @click="add">添加人员</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  // onload加载事件
  created() {
    this.getEmployeeList()
  },
  //普通方法
  methods: {
    getEmployeeList() {
      console.log('获取用户信息')
    },
    search() {
      console.log('搜索')
    },
    add() {
      console.log('添加')
    },
    goBack() {
      console.log('回首页')
      this.$router.push({ path: '/home' })
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 17px;
}
</style>