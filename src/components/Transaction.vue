<template>
  <el-container>
    <el-main>
      <el-row class="detail">
        <el-row class="head">
          <el-col class="title"><h2>Transaction Detail</h2></el-col>
        </el-row>
        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Transaction Hash</el-col>
          <el-col class="value">{{result.transaction.hash}}</el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Transaction Kind</el-col>
          <el-col class="value" >{{txType[result.transaction.kind]}}</el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Block Number</el-col>
          <el-col class="value"><router-link :to='"/block?id=" + result.transaction.block_number' >#{{thousands("" + result.transaction.block_number)}}</router-link></el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Timestamp</el-col>
          <el-col class="value">{{prettytime(result.transaction.timestamp)}}</el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>From</el-col>
          <el-col class="value"><router-link :to='"/addr?addr=" + result.transaction.from'>{{result.transaction.from}}</router-link></el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>To</el-col>
          <el-col class="value"><router-link :to='"/addr?addr=" + result.transaction.from'>{{result.transaction.to}}</router-link></el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Value</el-col>
          <el-col class="value">{{thousands("" + hexToNumberString(result.transaction.value))}}</el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Gas Price</el-col>
          <el-col class="value">{{thousands("" + hexToNumberString(result.transaction.gas_price))}}</el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Gas Used</el-col>
          <el-col class="value">{{thousands("" + hexToNumberString(result.transaction.gas))}}</el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Nonce</el-col>
          <el-col class="value">{{result.transaction.nonce}}</el-col>
        </el-row>

        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png"></div>Input Data</el-col>
          <el-col class="value">{{result.transaction.input}}</el-col>
        </el-row>
      </el-row>
      <el-row class="foot">Copyright © ylemscan.io All Rights Reserved. </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {utils} from 'web3'
import axios from "../utils/axios"
export default {
  name: 'TransactionsPage',
  props: {
  },
  data(){
    return {
      txType:{
        0: "Transaction",
        1: "Contract Creation" ,
        2: "Contract Call " ,
      },
      result:{
        page_count:0,
        page_size:10,
        transaction:{
          id:0,
          hash:"",
          timestamp:0,
          value:"", 
          kind:0,
          block_number:0,
          gas:"",
          gas_price:"",
        },
      },
    }
   },
  mounted() {
    this.getTransaction(this.$route.query.id)
  },
  methods:{
    async getTransaction(id){
      const {data:_data} = await axios.get('/api/v1/tx?id=' + id)
      this.result = _data
    },
    pageChange(page){
      this.getTransactions(this.$route.query.id,page)
    },
    thousands(s){
      try{
        return s.replace(/\d+/, function (n) {
          return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        })
      } catch (e) {
        return s
      }
    },
    prettytime(timestamp){
      let now = new Date().getTime()
      now = Math.round(now/1000)
      let span = now - timestamp
      if (span <= 0) span=1

      let t = ""
      if (span >= 3600) {
        t = "1 hour"
      } else if (span >= 60) {
        t = "1 minute"
      } else if (span == 1) {
        t = "1 second"
      } else {
        t = "" + span + " seconds"
      }
      return t
    },
    hexToNumberString(s) {
      if (s == '') { s = '0x'}
      try {
        return utils.hexToNumberString(s)
      } catch (e) {
        return s
      }
    },
    hexToAscii(s) {
      if (s == '') { s = '0x'}
      try {
        return utils.hexToAscii(s)
      } catch (e) {
        return s
      }
    },
    toTokens(s) {
      try{
        return utils.fromWei(s, 'ether')
      } catch (e) {
        return s
      }
    },
   }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.el-container{
  padding-bottom: 10px;
}

.el-main{
  padding: 0;
}
.detail {
  border:solid 1px #eee;
  border-radius: 4px;
  margin:15px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding-right: 15px;
  min-height: 230px;
}
.detail .head {
  font-size: 18px;
  font-weight: 400;
  line-height: 60px;
  height: 60px; 
  text-align: left;
  display: flex;
  padding-bottom: 80px;
}
.detail .head .title{
  text-align:left;
  padding-left:15px;
}
.detail .head .title h2{
  margin: 0px;
  padding: 0px;
  line-height: 60px;
}
.detail .item {
  display:flex;
  padding-bottom:10px;
}
.detail .item .title{
  width:280px;
  text-align:left;
  padding-left:20px;
  font-size:15px;
  font-weight:500;
  color:#6c757d;
  display:flex;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.detail .item .title img{
  width:20px;
  height:20px;
  padding-right:5px;
}
.detail .item .value{
  flex:1;
  text-align:left;
  padding-left:20px;
  font-size:14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.detail .item a{
  color: #7e74ec; 
  font-size: 13px; 
  text-decoration: none;
}

.transactions {
  border:solid 1px #eee;
  border-radius: 4px;
  margin:15px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding-right: 5px;
  min-height: 200px;
}
.transactions .inner{
  padding:0 10px;
}
.transactions .head {
    font-size: 18px;
    font-weight: 400;
    line-height: 60px;
    height: 60px; 
    text-align: left;
    display: flex;
}
.transactions .head .title{
  text-align:left;
  padding-left:5px;
}
.transactions .head .title h2{
  margin: 0px;
  padding: 0px;
  line-height: 60px;
}
.transactions .head .button{
  text-align:right;
  white-space:nowrap;
}
.transactions .transaction{
  padding: 0 0px;
}
.transaction .body{
  display: flex;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #6c757d;
  flex-grow: 1;
  font-size: 12px;
  line-height: 1.4rem;
  border-left: 4px solid #7e74ec;
}
.transaction .contract{
  border-left: 4px solid #28a745;
}
.transaction .body .type{
  background-color: rgba(0,123,255,.1);
  border-bottom: 1px solid #7e74ec;
  border-right: 1px solid #7e74ec;
  border-top: 1px solid #7e74ec;
  color: #7e74ec;
  width:200px;
  line-height: 75px;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
}
.transaction .body .contract{
  background-color: rgba(40,167,69,.1);
  border-bottom: 1px solid #28a745;
  border-right: 1px solid #28a745;
  border-top: 1px solid #28a745;
  color: #28a745;
}
.transaction .content{
  flex:1;
  width:100%;
  padding:10px 20px;
  text-align:left;
}

.transaction .hash{
  height:25px;
  line-height:25px;
}
.transaction .hash a{
  color: #7e74ec; 
  font-size: 13px; 
  text-decoration: none;
}
.transaction .operation{
  height:25px;
  line-height:25px;
}
.transaction .operation a{
  color: #7e74ec;
  font-size: 13px;
  text-decoration: none
}
.transaction .fee {
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  font-weight: 500;
}
.transaction .block {
  width:200px;
  padding: 10px 20px;
}
.transaction .block .num{
  padding-top:25px;
}
.transaction .block .num a{
  color: #5959d8;
  font-size: 13px;
  text-decoration: none
}
.transaction .block .time{
  height: 25px;
  font-size: 14px;
}
.el-menu--horizontal>.el-menu-item {
  height: 50px;
  line-height: 50px;
}
.page-foot{
  margin: 30px;
}
.foot{
  font-size: 13px;
  padding-bottom: 10px;
  color: #999;
}
:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
    background-color: #7e74ec !important;
    color: #FFF;
}
</style>
