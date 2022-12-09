import axios from 'axios'

axios.defaults.baseURL = ''
// request to carry cookie
axios.defaults.withCredentials = true
// get local token
axios.defaults.headers['token'] = localStorage.getItem('token') || ''
// asynchronous request
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// content type
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios