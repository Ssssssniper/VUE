import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 添加全局样式
import './assets/css/global.css'
// 引入小图标
import './assets/login_icon/iconfont.css'

// 引入axios
import axios from 'axios'
//挂载axios
Vue.prototype.$http = axios
// 设置访问服务器的根路径
axios.defaults.baseURL = "http://localhost:8888/demo"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')