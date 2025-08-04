import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n/index'
import filters from './components/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) //注册全局filter；
})
Vue.use(ElementUI)
// Vue.use(Filter)
Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')