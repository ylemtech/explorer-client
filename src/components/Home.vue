<template>
  <el-container>
    <el-main>
      <el-row class="total">
        <el-col class="container">
          <el-row class="container-inner">
            <el-col class="block">
              <div class="container">
                <div class="title">{{$t('BLOCK HEIGHT')}}</div>
                <div class="value">
                  {{ thousands("" + result.block_height) }}
                </div>
              </div>
            </el-col>
            <el-col class="block">
              <div class="container">
                <div class="title">{{$t('AVERAGE BLOCK TIME')}}</div>
                <div class="value">{{ result.block_time }} Seconds</div>
              </div>
            </el-col>
            <el-col class="block">
              <div class="container">
                <div class="title">{{$t('TOTAL TRANSACTIONS')}}</div>
                <div class="value">
                  {{ thousands("" + result.total_transactions) }}
                </div>
              </div>
            </el-col>
            <el-col class="block">
              <div class="container">
                <div class="title">{{$t('TOTAL DIFFICULTY')}}</div>
                <div class="value">
                  {{
                    thousands("" + hexToNumberString(result.total_difficulty))
                  }}
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="blocks">
        <el-row class="head">
          <el-col class="title"><h2>{{$t('Blocks')}}</h2></el-col>
          <el-col class="buttons">
            <!-- <el-button
              type="primary"
              size="small"
              circle
              icon="el-icon-refresh"
              @click="getBlock()"
            >
            </el-button> -->
            <el-button type="primary" size="midium" round @click="viewBlocks()"
              >{{$t('View Blocks')}}</el-button
            >
          </el-col>
        </el-row>
        <el-row class="block">
          <el-col
            v-for="item in result.blocks"
            :key="item.id"
            class="container"
          >
            <div class="content">
              <router-link class="number" :to="'/block/' + item.id"
                >#{{ thousands("" + item.id) }}</router-link
              >
              <div class="panel">
                <div class="desc">
                  <span class="title">{{ item.trans }} {{$t('Transactions')}}</span>
                  <span class="time">{{ prettytime(item.timestamp) }} ago</span>
                </div>
                <div class="desc">
                  <span class="title">{{$t('Miner')}}</span>
                  <router-link class="miner" :to="'/address/' + item.miner">{{
                    item.miner
                  }}</router-link>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="transactions">
        <el-col class="inner">
          <el-row class="head">
            <el-col class="title"><h2>{{$t('Transactions')}}</h2></el-col>
            <el-col class="button"
              ><el-button
                type="primary"
                size="midium"
                round
                @click="viewTransactions()"
                >{{$t('View Transactions')}}</el-button
              ></el-col
            >
          </el-row>
          <el-row
            v-for="item in result.transactions"
            :key="item.id"
            class="transaction"
          >
            <el-col style="padding-bottom: 25px">
              <el-row v-bind:class="{ body: true, contract: item.kind !== 0 }">
                <el-col
                  v-bind:class="{ type: true, contract: item.kind !== 0 }"
                  >{{ $t(txType[item.kind]) }}</el-col
                >
                <el-col class="content">
                  <div class="hash">
                    {{$t('hash')}}
                    <router-link :to="'/tx/' + item.hash">{{
                      item.hash
                    }}</router-link>
                  </div>
                  <div class="operation">
                    {{$t('from')}}
                    <router-link :to="'/address/' + item.from">{{
                      item.from | addressEll
                    }}</router-link
                    ><span v-if="item.kind !== 1"> → {{$t('to')}} </span
                    ><router-link :to="'/address/' + item.to">{{
                      item.to | addressEll
                    }}</router-link>
                  </div>
                  <div class="fee">
                    {{
                      thousands("" + toTokens(hexToNumberString(item.value)))
                    }}
                    YLEM
                  </div>
                </el-col>
                <el-col class="block">
                  <div class="num">
                    <router-link :to="'/block/' + item.block_number"
                      >{{$t('Block')}} #{{
                        thousands("" + item.block_number)
                      }}</router-link
                    >
                  </div>
                  <div class="time">{{ prettytime(item.timestamp) }} ago</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="foot"
        >Copyright © ylemscan.io All Rights Reserved.
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { utils } from "web3";
import axios from "../utils/axios";
export default {
  name: "HomePage",
  props: {},
  data() {
    return {
      txType: {
        0: "Transaction",
        1: "Contract Creation",
        2: "Contract Call",
      },
      result: {
        block_height: 1,
        total_difficulty: "0x1488",
        total_transactions: 1,
        block_time: 10,
        blocks: [
          { id: 1, timestamp: 0 },
          { id: 0, timestamp: 0 },
        ],
        transactions: [
          {
            block_number: "1",
            value: "0x",
            kind: 0,
            from: "0x00000000000000000000000000000000",
            to: "0x00000000000000000000000000000000",
            hash: "0x00000000000000000000000000000000",
          },
        ],
      },
    };
  },

  mounted() {
    if (this.$route.query.lang) {
      this.$i18n.locale = this.$route.query.lang
    }
    this.getBlock();
    this.timerRefresh = setInterval(() => {
      this.getBlock();
    }, 20000);
  },

  beforeDestroy() {
    if (this.timerRefresh !== null) {
      clearInterval(this.timerRefresh);
      this.timerRefresh = null;
    }
  },

  methods: {
    async getBlock() {
      const { data: _data } = await axios.get(localStorage.getItem("chainApi") + "/api/v1/bc");
      this.result = _data;
    },
    viewBlocks() {
      this.$router.push({ path: "/blocks" })
    },
    viewTransactions() {
      this.$router.push({ path: "/txs" });
    },
    viewBlock(id) {
      this.$router.push('/block/' + id);
    },
    thousands(s) {
      try {
        return s.replace(/\d+/, function (n) {
          return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
        });
      } catch (e) {
        return s;
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
      if (s == "") {
        s = "0x";
      }
      try {
        return utils.hexToNumberString(s);
      } catch (e) {
        return s;
      }
    },
    hexToAscii(s) {
      if (s == "") {
        s = "0x";
      }
      try {
        return utils.hexToAscii(s);
      } catch (e) {
        return s;
      }
    },
    toTokens(s) {
      try {
        return utils.fromWei(s, "ether");
      } catch (e) {
        return s;
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.el-container {
  padding-bottom: 10px;
}

.el-main {
  padding: 0;
}

.total {
  display: flex;
  overflow: hidden;
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px; */
  height: 120px;
  margin: 30px 50px 0 50px;
}
.total .container {
  padding: 0 0px 0 0;
}
.total .container-inner {
  display: flex;
  height: 100%;
  /* padding:20px; */
}
.total .block {
  max-width: 25%;
  padding: 20px;
  margin-left: 1%;
  line-height: 30px;
  background: #1b174d;
  border-radius: 6px 6px 0px 0px;
  float: left;
}
.total .block:first-child {
  max-width: 25%;
  padding: 20px;
  margin-left: 0;
  line-height: 30px;
  background: #1b174d;
  border-radius: 6px 6px 0px 0px;
  float: left;
}

.total .block .container {
  /* border-left: 4px solid #4ad7a7; */
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.total .block .container .title {
  color: #43ffa3;
  text-align: left;
  font-size: 15px;
  /* font-weight: 550; */
  padding: 0px 0 0 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  letter-spacing: 2px;
}
.total .block .container .value {
  color: white;
  font-size: 1.3rem;
  font-weight: 200;
  padding: 10px 0 0 10px;
  text-align: left;
}

.blocks {
  /* border: solid 1px #eee; */
  border-radius: 4px;
  margin: 5px 50px 25px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding-right: 15px;
  min-height: 230px;
  padding: 10px;
}
.blocks .head {
  font-size: 18px;
  font-weight: 400;
  line-height: 60px;
  height: 60px;
  text-align: left;
  display: flex;
}
.blocks .head .title {
  text-align: left;
  padding-left: 15px;
}
.blocks .head .title h2 {
  margin: 0px;
  padding: 0px;
  line-height: 60px;
  font-family: SourceHanSansSC-Heavy, SourceHanSansSC;
}
.blocks .head .buttons {
  text-align: right;
  white-space: nowrap;
}

.blocks .block {
  display: flex;
}
.blocks .block .container {
  flex: 0 0 25%;
  max-width: 20%;
  padding: 5px;
}
.blocks .block .content {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4rem;
  padding: 0.5rem;
  /* border-left: 2px solid rgb(89, 89, 216); */
  box-shadow: 2px 2px 14px 2px rgba(0, 0, 0, 0.07);
  border: 2px solid #f1f1f1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.blocks .block .number {
  color: #5f51ff;
  text-decoration: none;
  text-align: left;
  font-size: 20px;
  font-weight: 750;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  letter-spacing: 2px;
}
.blocks .block .panel {
  background: rgba(95, 81, 255, 0.04);
  font-size: 12px;
  padding: 0.8rem 1rem;
}
.blocks .block .desc {
  color: #a3a9b5;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.blocks .block .desc .title {
  font-size: 12px;
}
.blocks .block .desc .time {
  padding-left: 5px;
}
.blocks .block .desc .miner {
  padding-left: 5px;
  font-size: 12px;
  text-decoration: none;
  color: #7e74ec;
}

.transactions {
  /* border: solid 1px #eee; */
  border-radius: 4px;
  margin: 25px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  min-height: 200px;
}
.transactions .inner {
  padding: 15px;
}
.transactions .head {
  font-size: 18px;
  font-weight: 400;
  line-height: 60px;
  height: 60px;
  text-align: left;
  display: flex;
}
.transactions .head .title {
  text-align: left;
  padding-left: 5px;
}
.transactions .head .title h2 {
  margin: 0px;
  padding: 0px;
  line-height: 60px;
}
.transactions .head .button {
  text-align: right;
  white-space: nowrap;
}
.transactions .transaction {
  padding: 0 0px;
}
.transaction .body {
  display: flex;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  color: #6c757d;
  flex-grow: 1;
  font-size: 12px;
  height: 90px;
  /* border-left: 2px solid #7e74ec; */
  /* background: #4ad7a7; */
}
.transaction .contract {
  border-left: 4px solid #28a745;
}
.transaction .body .type {
  background-color: rgba(95, 81, 255, 0.03);
  border: 1px solid #7e74ec;
  border-radius: 5px;
  color: #7e74ec;
  width: 200px;
  line-height: 60px;
  padding: 10px;
  font-size: 18px;
  font-weight: 500;
}
.transaction .body .contract {
  background-color: rgba(40, 167, 69, 0.1);
  border-bottom: 1px solid #28a745;
  border-right: 1px solid #28a745;
  border-top: 1px solid #28a745;
  color: #28a745;
}
.transaction .content {
  flex: 1;
  width: 100%;
  padding: 10px 20px;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.transaction .hash {
  height: 25px;
  line-height: 25px;
}
.transaction .hash a {
  color: #7e74ec;
  font-size: 12px;
  text-decoration: none;
}
.transaction .operation {
  height: 25px;
  line-height: 25px;
}
.transaction .operation a {
  color: #7e74ec;
  font-size: 13px;
  text-decoration: none;
}
.transaction .fee {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #69696b;
}
.transaction .block {
  width: 200px;
  padding: 0px 20px;
}
.transaction .block .num {
  padding-top: 30px;
}
.transaction .block .num a {
  color: #7e74ec;
  font-size: 13px;
  text-decoration: none;
}
.transaction .block .time {
  height: 25px;
  font-size: 12px;
}
.el-menu--horizontal > .el-menu-item {
  height: 50px;
  line-height: 50px;
}
.foot {
  font-size: 13px;
  padding-bottom: 10px;
  color: #999;
}
.el-button--primary {
  color: #fff;
  /* background-color:#A755EE; */
}
.el-button--primary {
  color: #fff;
  background-color: #584cd6;
  border-color: #584cd6;
}
:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #5f51ff !important;
  color: #fff;
}
</style>
