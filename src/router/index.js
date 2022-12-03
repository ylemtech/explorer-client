// index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue' 
import Blocks from '../components/Blocks.vue' 
import Transactions from '../components/Transactions.vue'  
import Block from '../components/Block.vue' 
import Transaction from '../components/Transaction.vue' 

Vue.use(VueRouter)
 
const router = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path:"/",
            component:Home
        },
        {
            path:"/blocks",
            component:Blocks
        },
        {
            path:"/txs",
            component:Transactions
        },
        {
            path:"/block",
            component:Block
        },
        {
            path:"/tx",
            component:Transaction
        },
    ]
})

export default router

