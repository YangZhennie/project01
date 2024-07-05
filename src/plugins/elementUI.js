import Vue from 'vue'
import {
    Form,
    FormItem,
    Input,
    Button,
    Message
} from 'element-ui'
//注册组件
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
//全局事件总线
Vue.prototype.$message = Message
