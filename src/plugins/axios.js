import axios from 'axios'
//配置基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//配置请求拦截器
axios.interceptors.request.use(
    (config) => {
        //给请求头添加token验证的Authorization字段
        config.headers.Authorization = sessionStorage.getItem('token') || ''
        return config
    }
)

export default axios
