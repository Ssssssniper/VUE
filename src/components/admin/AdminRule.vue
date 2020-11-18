<template>
  <div>
    <h3>用户权限管理</h3>

    <el-button
      style="float:right;margin-right:50px"
      size="primary"
      @click="centerFormVisible=true"
    >添加用户</el-button>
    <!-- 对话框 -->
    <el-dialog title="新增用户" :visible.sync="centerFormVisible" width="30%" center>
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.role" placeholder="请选择账户权限">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="普通用户" value="普通用户"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerFormVisible = false">取 消</el-button>
        <!-- 点击触发多个函数 -->
        <el-button type="primary" @click="centerFormVisible = false;commit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="tableData.list" style="width: 100%">
      <el-table-column prop="id" label="序号" width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="role" label="用户身份"></el-table-column>
      <el-table-column prop="status" label="用户状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑按钮  -->
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-dialog title="修改" :visible.sync="editFormVisible" width="30%" center>
            <el-form :model="editForm">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="editForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="editForm.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户权限" :label-width="formLabelWidth">
                <el-select v-model="editForm.role" placeholder="请选择账户权限">
                  <el-option label="管理员" value="管理员"></el-option>
                  <el-option label="普通用户" value="普通用户"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用户状态">
                <el-select v-model="editForm.status" placeholder="请选择账户状态">
                  <el-option label="在用" value="1"></el-option>
                  <el-option label="过期" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editFormVisible = false">取 消</el-button>
              <!-- 点击触发多个函数 -->
              <el-button type="primary" @click="editFormVisible = false;update()">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 删除按钮 -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      isEdit: -99,
      centerFormVisible: false,
      editFormVisible: false,
      form: {
        username: '',
        password: '',
        role: '',
        status: 1
      },
      editForm: {
        username: '',
        password: '',
        role: '',
        status: 1
      },
      delForm: {
        username: '',
        password: '',
        role: ''
      },
      formLabelWidth: '80px'
    }
  },
  created() {
    this.getAdmin()
  },
  methods: {
    async getAdmin() {
      const { data: tabledata } = await this.$http.get('/account')
      this.tableData = tabledata.extend.data
    },

    // 编辑按钮
    handleEdit(index, row) {
      console.log(index, row)
      this.editFormVisible = true
      // 关键语句
      this.editForm = Object.assign({}, row)
    },

    // 删除按钮
    handleDelete(index, row) {
      console.log('删除按钮')
      this.delForm = Object.assign({}, row)
      this.delete(this.delForm)
    },

    // 添加用户信息窗口

    async commit() {
      console.log('提交返回值')
      var that = this
      const { data: res } = await this.$http.post('/adduser', this.form)
      console.log(res)
      if (res.code == '200') {
        this.$message({
          message: '添加成功!',
          type: 'success'
        })
        // 刷新表格！！！！！更新用户信息
        this.getAdmin()
      } else {
        this.$message.error('添加失败！')
      }
    },

    // 更新用户信息
    update() {},

    // 删除用户信息
    async delete(user) {
      console.log(user)
      const { data: res } = await this.$http.post('/deluser', user)
      if (res.code == '200') {
        this.$message({
          message: '删除成功!',
          type: 'success'
        })
        this.getAdmin()
      } else {
        this.$message.error('删除失败！')
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>