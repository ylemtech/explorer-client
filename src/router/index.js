// index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue' 
import Blocks from '../components/Blocks.vue' 
import Transactions from '../components/Transactions.vue'  
import Nfts from '../components/TransactionsNFT.vue' 
import Nft from '../components/nft.vue' 
import Block from '../components/Block.vue' 
import Transaction from '../components/Transaction.vue' 
import Address from '../components/Address.vue' 
import ErrorPage from '../components/ErrorPage.vue' 

Vue.use(VueRouter)
 
const router = new VueRouter({
    mode: 'history', // hash for electron 
    routes: [
        {
            path:"/",
            component:Home,
            
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
            path:"/nfts",
            component:Nfts
        },
        {
            path:"/nft",
            component:Nft
        },
        {
            path:"/block",
            component:Block
        },
        {
            path:"/tx",
            component:Transaction
        },
        {
            path:"/addr",
            component:Address,
            meta:{
              keepAlive:false  
            }
        },
        {
            path:"/error",
            component:ErrorPage
        }, 
        
    ]
})

export default router

