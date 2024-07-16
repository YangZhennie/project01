import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router.js'
import './assets/css/global.css'
import './plugins/element.js'

//引入全局组件
import Bread from './components/common/breadcrumb'
Vue.component('Bread',Bread)

//导入公共方法
// 类似全局事件总线，所有组件都能直接调用
import { errorDialog, addItem, changeItem } from './common/Common.js'
Vue.prototype.$errorDialog = errorDialog
Vue.prototype.$addItem = addItem
Vue.prototype.$changeItem = changeItem

import axios from './plugins/axios.js'
Vue.prototype.$http = axios

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
