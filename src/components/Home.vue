<template>
  <el-container>
    <el-main>
      <el-row class="header">
        <el-col class="container">
          <img src="/images/logo.png" class="logo">
          <span class="title">BaiST Blockchain Explorer</span>
        </el-col>
        <el-col class="menu">
          <el-menu :default-active="activeMenu" style="border-bottom: none;" mode="horizontal" @select="selectMenu">
            <el-menu-item index="1">Home</el-menu-item>
            <el-menu-item index="2">Blocks</el-menu-item>
            <el-menu-item index="3">Transactions</el-menu-item>
          </el-menu>
        </el-col>
        <el-col class="search">
          <el-input maxlength="64" placeholder="Please input block or tx hash" prefix-icon="el-icon-search" v-model="keyword"></el-input>
        </el-col>
      </el-row>
      <el-row class="total">
        <el-col class="container">
          <el-row class="container-inner">
            <el-col class="block">
              <div class="container">
                <div class="title">BLOCK HEIGHT</div>
                <div class="value">{{thousands("" + result.block_height)}}</div>
              </div>
            </el-col>
            <el-col class="block">
              <div class="container">
                <div class="title">AVERAGE BLOCK TIME</div>
                <div class="value">{{result.block_time}} Seconds</div>
              </div>
            </el-col>
            <el-col class="block">
              <div class="container">
                <div class="title">TOTAL TRANSACTIONS</div>
                <div class="value">{{thousands("" + result.total_transactions)}}</div>
              </div>
            </el-col>
            <el-col class="block">
              <div class="container">
                <div class="title">TOTAL DIFFICULTY</div>
                <div class="value">{{thousands("" + hexToNumberString(result.total_difficulty))}}</div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="blocks">
        <el-row class="head">
          <el-col class="title"><h2>Blocks</h2></el-col>
          <el-col class="buttons"><el-button type="primary" round @click="getBlock()">&nbsp;&nbsp;Refresh&nbsp;&nbsp;</el-button><el-button type="primary" round @click="viewBlocks()">View Blocks</el-button></el-col>
        </el-row>
        <el-row class="block">
          <el-col v-for="item in result.blocks" :key="item.id" class="container">
            <div class="content">
            
              <a class="number" :href='"/block?id=" + item.id' target="_blank">#{{thousands("" + item.id)}}</a>
              <div class="panel"> 
                <div class="desc">
                  <span class="title">{{item.trans}} Transactions</span>
                  <span class="time">{{prettytime(item.timestamp)}} ago</span>
                </div>
                <div class="desc">
                  <span class="title">Miner</span>
                  <a class="miner" href="#">{{item.miner}}</a>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="transactions">
        <el-col class="inner">
          <el-row class="head">
            <el-col class="title"><h2>Transactions</h2></el-col>
            <el-col class="button"><el-button type="primary" round @click="viewTransactions()">View Transactions</el-button></el-col>
          </el-row>
          <el-row v-for="item in result.transactions" :key="item.id" class="transaction">
            <el-col style="padding-bottom: 15px;">
              <el-row v-bind:class="{body:true,contract:item.kind!==0}">
                <el-col v-bind:class="{type:true,contract:item.kind!==0}">{{txType[item.kind]}}</el-col>
                <el-col class="content">
                  <div class="hash">
                    <a :href='"/tx?id=" + item.hash' target="_blank">{{item.hash}}</a>
                  </div>
                  <div class="operation">
                    <a href="#">{{item.from}}</a><span v-if="item.kind !== 1"> → </span><a href="#">{{item.to}}</a>
                  </div>
                  <div class="fee">{{thousands("" + toTokens(hexToNumberString(item.value)))}} BST</div>
                </el-col>
                <el-col class="block">
                  <div class="num"><a :href='"/block?id=" + item.block_number' target="_blank" >Block #{{thousands("" + item.block_number)}}</a></div>
                  <div class="time">{{prettytime(item.timestamp)}} ago</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="foot">Copyright © 2000-2022 BaiShiTong All Rights Reserved. </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {utils} from 'web3';
import axios from "../utils/axios";
export default {
  name: 'HomePage',
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
        block_height:1,
        total_difficulty:"0x1488",
        total_transactions:1,
        block_time:10,
        blocks:[
          {id:1,timestamp:0,},
          {id:0,timestamp:0,},
        ],
        transactions:[
          {
            block_number:"1",
            value:"0x",
            kind:0,
            from:"0x00000000000000000000000000000000",
            to:"0x00000000000000000000000000000000",
            hash:"0x00000000000000000000000000000000",
          },
        ],
      },
      activeMenu:"1",
      keyword:"",
    }
   },

  mounted() {
    this.getBlock()
    this.timerRefresh = setInterval(() => {
      this.getBlock()
    },20000)
  },

  beforeDestroy() {
    if (this.timerRefresh !== null) {
      clearInterval(this.timerRefresh)
      this.timerRefresh = null
    }
  },

  methods:{
    async getBlock(){
      const {data:_data} = await axios.get('/api/v1/bc')
      this.result = _data
    },
    viewBlocks(){
      let routeData = this.$router.resolve({ path: '/blocks'});
      window.open(routeData.href, '_blank');
    },
    viewTransactions(){
      let routeData = this.$router.resolve({ path: '/txs'});
      window.open(routeData.href, '_blank');
    },
    viewBlock(id){
      let routeData = this.$router.resolve({ path: '/block?id='+id});
      window.open(routeData.href, '_blank');
    },
    selectMenu(index) {
      if (index == "1") {
        this.$router.push('/');
      }
      if (index == "2") {
        this.$router.push('/blocks');
      }
      if (index == "3") {
        this.$router.push('/txs');
      }
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

.header{display:flex;
 height:60px;
}
.header .container{
  display:flex;
  padding: 10px 0px 10px 50px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.header .menu{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
.el-menu--horizontal>.el-menu-item {
  height: 50px;
  line-height: 50px;
}
.foot{
  font-size: 13px;
  padding-bottom: 10px;
  color: #999;
}
</style>
