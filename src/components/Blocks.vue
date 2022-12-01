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
      <el-row class="blocks">
        <el-col class="inner">
          <el-row class="head">
            <el-col class="title"><h2>Blocks</h2></el-col>
          </el-row>
          <el-row v-for="item in result.blocks" :key="item.id" class="block">
            <el-col style="padding-bottom: 15px;">
              <el-row class="body">
                <el-col class="type">
                  <div><a :href='"/block?id=" + item.id' target="_blank">#{{thousands("" + item.id)}}</a></div>
                  <div>Block</div>
                </el-col>
                <el-col class="content">
                  <div class="trancount">
                    {{item.transactions_count}} transactions {{thousands("" + item.size)}} bytes {{prettytime(item.timestamp)}} ago
                  </div>
                  <div class="operation">
                    <span>Miner: </span><a href="#">{{item.miner}}</a>
                  </div>
                </el-col>
                <el-col class="gas">
                  <div class="gas-limit">{{thousands(hexToNumberString(item.gas_limit))}} Gas Limit</div>
                  <div class="gas-used">{{thousands(hexToNumberString(item.gas_used))}} Gas Used</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
       
          <el-row>
            <el-pagination background layout="prev, pager, next" :total="result.page_count" :page-size="result.page_size" @current-change="pageChange" class="page-foot"></el-pagination>
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
  name: 'BlocksPage',
  props: {
  },
  data(){
    return {
      activeMenu:"2",
      keyword:"",
      result:{
        page_count:0,
        page_size:10,
      },
    }
  },
  mounted() {
    this.getTransations(1)
  },

  methods:{
    async getTransations(page){
      const {data:_data} = await axios.get('/api/v1/blocks?page=' + page)
      this.result = _data
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
    pageChange(page){
      this.getTransations(page)
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
      if (s == '') { s = '0x'}
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
.header{
  display:flex;
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

.blocks {
  border:solid 1px #eee;
  border-radius: 4px;
  margin:15px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding-right: 5px;
  min-height: 230px;
}
.blocks .inner{
  padding:0 10px;
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
  padding-left:5px;
}
.blocks .head .title h2{
  margin: 0px;
  padding: 0px;
  line-height: 60px;
}

.blocks .block{
  padding: 0 0px;
}
.block .body{
  display: flex;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #6c757d;
  flex-grow: 1;
  font-size: 12px;
  line-height: 1.4rem;
  border-left: 4px solid #007bff;
}

.block .body .type{
  background-color: rgba(0,123,255,.1);
  border-bottom: 1px solid #007bff;
  border-right: 1px solid #007bff;
  border-top: 1px solid #007bff;
  color: #007bff;
  width:180px;
  line-height: 25px;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
}
.block .type a{
  color: #5959d8;
  font-size: 14px;
  text-decoration: none
}
.block .content{
  flex:1;
  width:100%;
  padding:10px 20px;
  text-align:left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.block .trancount{
  height:25px;
  line-height:25px;
  font-size:14px;
}
.block .operation{
  height:25px;
  line-height:25px;
  font-size:14px;
}
.block .operation a{
  color: #5959d8;
  font-size: 14px;
  text-decoration: none
}

.block .gas {
  width:200px;
  padding: 10px 20px;
}
.block .gas-limit{
  height: 25px;
  line-height: 25px;
  font-size: 14px;
}
.block .gas-used{
  height: 25px;
  line-height: 25px;
  font-size: 14px;
}
.el-menu--horizontal>.el-menu-item {
  height: 50px;
  line-height: 50px;
}
.page-foot{
  margin-bottom: 10px;
}
.foot{
  font-size: 13px;
  padding-bottom: 10px;
  color: #999;
}
</style>
