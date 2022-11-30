
// index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue' 
import Transactions from '../components/Transactions.vue'  
Vue.use(VueRouter)
 
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path:"/",
            component:Home
        },
        {
            path:"/txs",
            component:Transactions
        }
    ]
})

export default router

