import axios from 'axios'
axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? "" : "/root"
// request to carry cookie
axios.defaults.withCredentials = true
// get local token
axios.defaults.headers['token'] = localStorage.getItem('token') || ''
// asynchronous request
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
// content type
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios