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
            path: "/",
            component: Home,
        },
        {
            path: "/blocks",
            component: Blocks
        },
        {
            path: "/txs",
            component: Transactions
        },
        {
            path: "/nfts",
            component: Nfts
        },
        {
            path: "/nft/:id",
            component: Nft
        },
        {
            path: "/block/:id",
            component: Block
        },
        {
            path: "/tx/:id",
            component: Transaction
        },
        {
            path: "/address/:address",
            component: Address,
            meta: {
                keepAlive: false
            }
        },
        {
            path: "/error",
            component: ErrorPage
        },

    ]
})

// Resolve duplicate navigation issues
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

export default router