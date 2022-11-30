<template>
  <el-container>
    <el-main>
      <el-row class="header">
        <el-col class="container">
          <img src="/images/logo.png" class="logo">
          <span class="title">BaiST Blockchain Explorer</span>
        </el-col>
        <el-col class="search">
          <el-input maxlength="64" placeholder="Please input block or tx hash" prefix-icon="el-icon-search" v-model="keyword"></el-input>
        </el-col>
      </el-row>
      <el-row class="transactions">
        <el-col class="inner">
          <el-row class="head">
            <el-col class="title"><h2>Transactions</h2></el-col>
            <el-col class="button"><el-button type="primary" round @click="getBlock()">View Transactions</el-button></el-col>
          </el-row>
          <el-row v-for="item in block.transactions" :key="item.id" class="transaction">
            <el-col  style="padding-bottom: 15px;">
              <el-row v-bind:class="{body:true,contract:item.kind!==0}">
                <el-col v-bind:class="{type:true,contract:item.kind!==0}">{{txType[item.kind]}}</el-col>
                <el-col class="content">
                  <div class="hash">
                    <a href="#">{{item.hash}}</a>
                  </div>
                  <div class="operation">
                    <a href="#">{{item.from}}</a><span v-if="item.kind !== 1"> → </span><a href="#">{{item.to}}</a>
                  </div>
                  <div class="fee">{{thousands("" + toTokens(hexToNumberString(item.value)))}} BST</div>
                </el-col>
                <el-col class="block">
                  <div class="num"><a href="#" >Block #{{thousands("" + item.block_number)}}</a></div>
                  <div class="time">{{prettytime(item.timestamp)}} ago</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {utils} from 'web3';
import axios from "../utils/axios";
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
      keyword:"",
      block:{
      },
      timerRefresh:null,
    }
   },

  mounted() {
    this.getBlock()
    this.timerRefresh = setInterval(() => {
      this.getBlock()
    },5000)
  },

  beforeDestroy() {
    if (this.timerRefresh !== null) {
      clearInterval(this.timerRefresh)
      this.timerRefresh = null
    }
  },

  methods:{
    async getBlock(){
        const {data:res} = await axios.get('/blocks')
        this.block = res
    },
    thousands(s){
      return s.replace(/\d+/, function (n) {
        return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      })
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
      return utils.hexToNumberString(s)
    },
    toTokens(s) {
      return utils.fromWei(s, 'ether');
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
.header{display:flex;
 height:60px;
}
.header .container{
  display:flex;
  padding: 10px 0px 10px 50px;
}
.header .logo{
  height:40px;
  width:40px
}
.header .title{
  padding-left:10px;
  height:40px;
  line-height:40px
}
.header .search{
  padding: 10px 50px 10px 0;
  float:right;
  width:480px;
}

.total {
  background-image: linear-gradient(90deg,#1b1b39,#27275f);
  display: flex;
  padding: 30px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  min-height: 160px;
}
.total .container {
  padding:0 40px;
}
.total .container-inner {
  display:flex;
  padding:20px;
}
.total .block{
  flex: 0 0 25%;
  max-width: 25%;
  padding-left: 10px;
}
.total .block .container{
  border-left: 4px solid #4ad7a7;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.total .block .container .title{
  color: #bdbdff;
  text-align: left;
  font-size: 14px;
  padding:0px 0 0 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.total .block .container .value{
  color:white;
  font-size: 1.5rem;
  font-weight:200;
  padding:10px 0 0 10px;
  text-align:left
}

.blocks {
  border:solid 1px #eee;
  border-radius: 4px;
  margin:25px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding-right: 15px;
  min-height: 230px;
}
.blocks .head {
  font-size: 18px;
  font-weight: 400;
  line-height: 60px;
  height: 60px; 
  text-align: left;
  display: flex;
}
.blocks .head .title{
  text-align:left;
  padding-left:15px;
}
.blocks .head .title h2{
  margin: 0px;
  padding: 0px;
  line-height: 60px;
}
.blocks .head .buttons{
  text-align:right;
  white-space:nowrap;
}

.blocks .block{
  display:flex
}
.blocks .block .container{
  flex: 0 0 25%;
  max-width: 25%;
  padding-left: 10px;
}
.blocks .block .content{
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4rem;
  padding: 0.5rem;
  border-left: 4px solid rgb(89, 89, 216);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.blocks .block .number{
  color:#5959d8;
  text-decoration: none;
  text-align:left;
  font-size:15px;
  font-weight:600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.blocks .block .panel{
  background-color: #f6f7f9;
  font-size: 12px;
  padding: 0.8rem 1rem;
}
.blocks .block .desc{
  color: #a3a9b5;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.blocks .block .desc .title{
  font-size:14px;
}
.blocks .block .desc .time{
  padding-left:5px;
}
.blocks .block .desc .miner{
  padding-left:5px;
  font-size: 14px;
  text-decoration: none;
  color: #5959d8;
}

.transactions {
  border:solid 1px #eee;
  border-radius: 4px;
  margin:25px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding-right: 5px;
  min-height: 230px;
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
  border-left: 4px solid #007bff;
}
.transaction .contract{
  border-left: 4px solid #28a745;
}
.transaction .body .type{
  background-color: rgba(0,123,255,.1);
  border-bottom: 1px solid #007bff;
  border-right: 1px solid #007bff;
  border-top: 1px solid #007bff;
  color: #007bff;
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
  color: rgb(89, 89, 216); 
  font-size: 13px; 
  text-decoration: none;
}
.transaction .operation{
  height:25px;
  line-height:25px;
}
.transaction .operation a{
  color: #5959d8;
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
</style>
