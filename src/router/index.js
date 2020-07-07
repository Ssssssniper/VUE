import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue' // 引入Login组件
import Home from '../components/Home.vue' // 引入Home组件
import Welcome from '../components/Welcome.vue' // 引入Welcome组件
import Employee from '../components/admin/Employee.vue'
import AdminRule from '../components/admin/AdminRule.vue'
import Upload from '../components/admin/Upload.vue'
import Display from '../components/admin/Display.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

const routes = [
    // {
    //   path: "/",
    //   redirect: "/login",
    // },
    // {
    //   path: "/login",
    //   component: Login
    // },
    {
        path: "/",
        component: Login
    },
    {
        path: "/test",
        component: Display
    },
    // 下面的页面
    {
        path: "/home",
        component: Home,
        redirect: "/welcome",
        children: [{
            path: "/welcome",
            component: Welcome,
        }, {
            path: "/emps",
            component: Employee,
        }, {
            path: "/rule",
            component: AdminRule,
        }, {
            path: "/upload",
            component: Upload,
        }, {
            path: "/display",
            component: Display,
        }]
    },

]


const router = new VueRouter({
    routes
})
// 挂载路由导航守卫     session中有登录用户才能继续访问，否则返回登录界面
router.beforeEach((to, from, next) => {
    // to 将要访问
    // from 从哪访问
    // next 接着干嘛  next(url) 重定向url     next() 继续访问 to路径
    if (to.path == '/') return next();
    // 从session中获取user
    const userflag = window.sessionStorage.getItem("user");
    if (!userflag) return next("/");
    next();
})
// 暴露给外部使用
export default router