import axios from 'axios'

axios.defaults.baseURL = ''

// 请求携带cookie
axios.defaults.withCredentials = true

// 异步请求
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

// 获取本地token
axios.defaults.headers['token'] = localStorage.getItem('token') || ''

// 内容类型
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios
//Vue.prototype.$axios = axios