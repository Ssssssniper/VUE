<template>
  <div class="home">
    <el-container class="left">
      <!-- 头部 -->
      <el-header
        class="el-header"
        style="text-align: right; border: 1px solid #eee ;font-size: 24px;"
      >
        <!-- <el-dropdown split-button type icon="el-icon-setting" @click="settingClick">
          设置
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
        <img src="../assets/name_2.png" />
        <span>信息平台</span>
        <!-- 用户登录信息 -->
        <el-dropdown style="right:160px; position:absolute">
          <span class="el-dropdown-link el-icon--right" style="color:white ">
            <!-- 某人 -->
            {{username}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="info" @click="logout">安全退出</el-button>
      </el-header>

      <el-container class="rigth">
        <!-- 侧边栏 -->
        <el-aside class="el-aside" :width="isCollapse ? '40px':'200px'">
          <div class="collapse" @click="collapseBtn">|||</div>
          <!-- :router  开启导航栏路由 以index作为path进行跳转-->
          <el-menu
            class="menu"
            active-text-color="yellow"
            text-color="#fff"
            background-color="#3F454B"
            :collapse="isCollapse"
            :router="true"
            :default-active="defaultPath"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id +''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconsObject[item.id]"></i>
                {{item.title}}
              </template>
              <!-- 二级菜单 -->
              <el-menu-item-group>
                <template slot="title">子菜单</template>
                <el-menu-item
                  :index="list.path +''"
                  v-for="list in item.sList"
                  :key="list.id"
                  @click="saveState(list.path)"
                >
                  <i :class="iconsObject[list.id]"></i>
                  {{list.title}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <!-- <el-submenu index="2">
              <template slot="title">
                <i class="iconfont icon_username_real icon-icon_username_real"></i>
                <span slot="title">用户管理</span>
              </template>
              <el-menu-item>
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>二级菜单</span>
                </template>
              </el-menu-item>
            </el-submenu>-->
          </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main class="el-main">
          <!-- 重定向 -->
          <router-view></router-view>
        </el-main>
      </el-container>
      <!-- 底部 -->
      <el-footer class="el-footer">
        <span></span>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    const item = {
      name: '',
      age: '',
      sex: '',
      email: '',
      tel: '',
      depart: ''
    }
    return {
      // 菜单列表
      menuList: [],
      isCollapse: false, // 伸缩
      iconsObject: {
        '100': 'el-icon-user',
        '101': 'el-icon-s-check',
        '102': 'el-icon-star-on',
        '200': 'el-icon-s-claim',
        '201': 'el-icon-upload',
        '300': 'el-icon-s-flag',
        '301': 'el-icon-place',
        '302': 'el-icon-reading',
        '400': 'el-icon-document',
        '401': 'el-icon-data-line',
        '402': 'el-icon-edit'
      },
      defaultPath: '/welcome',
      username: ''
    }
  },
  // onload 加载事件
  created() {
    this.getMenuList()
    this.defaultPath = window.sessionStorage.getItem('defaultPath')
    this.username = JSON.parse(window.sessionStorage.getItem('user')).username
    console.log(this.username)
  },
  methods: {
    settingClick() {
      alert('设置功能')
    },
    // 安全退出
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    // 获取菜单列表
    async getMenuList() {
      // 向后台请求菜单数据
      const { data: menulist } = await this.$http.get('/menu')
      console.log(menulist)
      if (menulist.status != 'success')
        return this.$message.error('获取菜单失败')
      this.menuList = menulist.data
    },
    collapseBtn() {
      this.isCollapse = !this.isCollapse
    },
    // 菜单栏保存路径
    saveState(defaultPath) {
      window.sessionStorage.setItem('defaultPath', defaultPath)
      this.defaultPath = defaultPath
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
}
.left {
  height: 100%;
}
.right {
  height: 100%;
}
.el-footer {
  background-color: aqua;
}
.el-header {
  background-color: rgb(7, 114, 114);
  display: flex;
  justify-content: space-between; /* 左右贴边 */
  padding: 10px;
  align-items: center;
}
.el-aside {
  background-color: aquamarine;
  text-align: center;
}
.menu {
  border-right: none;
}
.el-main {
  width: 100%;
}
.collapse {
  height: 20px;
  text-align: center;
  background-color: black;
  color: aliceblue;
  font-size: 10px;
  cursor: pointer; /* 显示小手*/
  letter-spacing: 0.2em;
}
</style>