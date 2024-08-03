import Vue from 'vue'
//引入插件
import VueRouter from 'vue-router'
//路由懒加载：按功能划分
const myLogin = () => import(/* webpackChunkName: 'login_home_welcome' */ '../components/myLogin')
const myHome = () => import(/* webpackChunkName: 'login_home_welcome' */ '../components/myHome')
const welcome = () => import(/* webpackChunkName: 'login_home_welcome' */ '../views/welcome')

const users = () => import(/* webpackChunkName: 'user_rights_roles' */ '../components/routers/users')
const rights = () => import(/* webpackChunkName: 'user_rights_roles' */ '../components/routers/Rights')
const roles = () => import(/* webpackChunkName: 'user_rights_roles' */ '../components/routers/Roles')

const category = () => import(/* webpackChunkName: 'category_params' */ '../components/routers/Cate')
const params = () => import(/* webpackChunkName: 'category_params' */ '../components/routers/Params')

const goodsList = () => import(/* webpackChunkName: 'goods' */ '../components/routers/GoodsList')
const add = () => import(/* webpackChunkName: 'goods' */ '../components/routers/Add')
const edit = () => import(/* webpackChunkName: 'goods' */ '../components/routers/Edit')

const order = () => import(/* webpackChunkName: 'order_report' */ '../components/routers/Order')
const reports = () => import(/* webpackChunkName: 'order_report' */ '../components/routers/Report')

// import myLogin from '../components/myLogin'
// import myHome from '../components/myHome'
// import welcome from '../views/welcome'
// import users from '../components/routers/users'
// import rights from '../components/routers/Rights'
// import roles from '../components/routers/Roles'
// import category from '../components/routers/Cate'
// import params from '../components/routers/Params'
// import goodsList from '../components/routers/GoodsList'
// import add from '../components/routers/Add'
// import edit from '../components/routers/Edit'
// import order from '../components/routers/Order'
// import reports from '../components/routers/Report'
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
                },
                {
                    name: 'reports',
                    path: '/reports',
                    component: reports
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