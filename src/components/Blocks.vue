<template>
  <el-container>
    <el-main>
      <el-row class="blocks">
        <el-col class="inner">
          <el-row class="head">
            <el-col class="title"><h2>{{$t('Blocks')}}</h2></el-col>
          </el-row>
          <el-row v-for="item in result.blocks" :key="item.id" class="block">
            <el-col style="padding-bottom: 15px;">
              <el-row class="body">
                <el-col class="type">
                  <div><router-link :to='"/block/" + item.id' >#{{thousands("" + item.id)}}</router-link></div>
                  <div>Block</div>
                </el-col>
                <el-col class="content">
                  <div class="trancount">
                    {{item.transactions_count}} {{$t('transactions')}} {{thousands("" + item.size)}} {{$t('bytes')}} {{prettytime(item.timestamp)}} ago
                  </div>
                  <div class="operation">
                    <span>{{$t('Miner')}}: </span><router-link :to='"/addr/" + item.miner'>{{item.miner}}</router-link>
                  </div>
                </el-col>
                <el-col class="gas">
                  <div class="gas-limit">{{thousands(hexToNumberString(item.gas_limit)/1000000000)}}  {{$t('Gas Limit')}}</div>
                  <div class="gas-used">{{thousands(hexToNumberString(item.gas_used)/1000000000)}} {{$t('Gas Used')}}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
       
          <el-row>
            <el-pagination background layout="prev, pager, next" :total="result.page_count" :page-size="result.page_size" @current-change="pageChange" class="page-foot"></el-pagination>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="foot">Copyright © ylemscan.io All Rights Reserved. </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {utils} from 'web3'
import axios from "../utils/axios"
export default {
  name: 'BlocksPage',
  props: {
  },
  data(){
    return {
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
    pageChange(page){
      this.getTransations(page)
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
       prettytime(timestamp) {
      let now = new Date().getTime();
      now = Math.round(now / 1000);
      let span = now - timestamp;
      if (span <= 0) span = 1;

      var days = parseInt(span / ( 60 * 60 * 24));
      if (days > 0) {
        return days==1?days+"day":days+"days";
      }
      var hours = parseInt((span % (60 * 60 * 24)) / ( 60 * 60));
      if (hours > 0) {
        return hours==1?hours+"h":hours+"hs";
      }
      var minutes = parseInt((span % ( 60 * 60)) / ( 60));
      if (minutes > 0) {
        return minutes==1?minutes+"min":minutes+"mins";
      }
      return span  + "s";
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
  border-radius: 5px;
  color: #6c757d;
  flex-grow: 1;
  font-size: 12px;
  line-height: 1.4rem;
  /* border-left: 4px solid #7e74ec; */
}

.block .body .type{
  background-color: rgba(95, 81, 255, 0.03);
  border: 1px solid #7e74ec;
  border-radius: 5px;
  color: #7e74ec;
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
