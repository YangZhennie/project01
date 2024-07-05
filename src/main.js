import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router.js'
import './assets/css/global.css'

//插件
import './plugins/elementUI.js'

import axios from './plugins/axios.js'
// 类似全局事件总线，所有组件都能直接调用
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
