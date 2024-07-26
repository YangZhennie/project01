import Vue from 'vue'
//引入插件
import VueRouter from 'vue-router'
//引入组件
import myLogin from '../components/myLogin'
import myHome from '../components/myHome'
import welcome from '../views/welcome'
import users from '../components/routers/users'
import rights from '../components/routers/Rights'
import roles from '../components/routers/Roles'
import category from '../components/routers/Cate'
import params from '../components/routers/Params'
import goodsList from '../components/routers/GoodsList'
import add from '../components/routers/Add'
import edit from '../components/routers/Edit'
import order from '../components/routers/Order'
Vue.use(VueRouter)

//定义插件
const router = new VueRouter({
    routes: [
        // 路径重定向
        {
            path: '/',
            redirect: '/login'
        },
        {
            name: 'login',
            path: '/login',
            component: myLogin
        },
        {
            name: 'home',
            path: '/home',
            component: myHome,
            redirect: '/welcome',
            children: [
                {
                    name: 'welcome',
                    path: '/welcome',
                    component: welcome
                },
                {
                    name: 'users',
                    path: '/users',
                    component: users
                },
                {
                    name:'rights',
                    path:'/rights',
                    component:rights
                },
                {
                    name:'roles',
                    path:'/roles',
                    component:roles
                },
                {
                    name:'category',
                    path:'/categories',
                    component: category,
                },
                {
                    name: 'params',
                    path: '/params',
                    component: params,
                },
                {
                    name:'goodslist',
                    path:'/goods',
                    component:goodsList,
                },
                {   name:'add',
                    path:'/add',
                    component:add
                },
                {
                    name: 'edit',
                    path: '/edit',
                    component:edit
                },
                {
                    name:'order',
                    path:'/orders',
                    component:order
                }
            ]
        },
    ]
})

// 设置全局路由守卫，进行权限控制
router.beforeEach((to, from, next) => {
    //判断to路径名，如果是登陆页直接跳转
    if (to.name === 'login') {
        next(); return
    }
    //其他页面判断有无token,没有则强制跳转登录页
    if (!sessionStorage.getItem('token')) {
        next('/login'); return
    } next()
})

//导出router到入口文件main.js里的vm实例配置项
export default router