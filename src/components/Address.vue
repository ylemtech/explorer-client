<template>
  <el-container>
    <el-main>
      <el-row class="detail">
        <el-row class="head">
          <el-col class="title"
            ><h2>{{ $t("Overview") }}</h2></el-col
          >
        </el-row>
        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png" /></div>
            {{ $t("Address") }}</el-col
          >
          <el-col class="value">{{ verifyAddressLegality(addr) }}</el-col>
        </el-row>
        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png" /></div>
            {{ $t("Balance") }}</el-col
          >
          <el-col class="value">{{ balance }} YLEM</el-col>
        </el-row>
        <el-row class="item">
          <el-col class="title">
            <div><img src="/images/info.png" /></div>
            {{ $t("Txn Count") }}</el-col
          >
          <el-col class="value">{{ result.TransCount }}</el-col>
        </el-row>
      </el-row>
      <el-row class="transactions">
        <el-col class="inner">
          <el-row class="head">
            <el-col class="title"
              ><h2>{{ $t("Transactions") }}</h2></el-col
            >
          </el-row>
          <el-row
            v-for="item in this.result2.transactions"
            :key="item.id"
            class="transaction"
          >
            <el-col style="padding-bottom: 15px">
              <el-row :class="{ body: true, contract: item.kind !== 0 }">
                <el-col :class="{ type: true, contract: item.kind !== 0 }">{{
                  $t(txType[item.kind])
                }}</el-col>
                <el-col class="content">
                  <div class="hash">
                    {{ $t("hash") }}
                    <router-link :to="'/tx/' + item.hash">{{
                      item.hash
                    }}</router-link>
                  </div>
                  <div class="operation">
                    {{ $t("from") }}
                    <router-link :to="'/address/' + item.from">{{
                      item.from
                    }}</router-link
                    ><span v-if="item.kind !== 1"> → {{ $t("to") }} </span
                    ><router-link :to="'/address/' + item.to">{{
                      item.to
                    }}</router-link>
                  </div>
                  <div class="fee">
                    <span class="tagIn" v-if="item.to == addr">{{
                      $t("IN")
                    }}</span>
                    <span class="tagOut" v-else>{{ $t("OUT") }}</span>
                    {{
                      thousands("" + toTokens(hexToNumberString(item.value)))
                    }}
                    YLEM
                  </div>
                </el-col>
                <el-col class="block">
                  <div class="num">
                    <router-link :to="'/block/' + item.block_number"
                      >{{ $t("Block") }} #{{
                        thousands("" + item.block_number)
                      }}</router-link
                    >
                  </div>
                  <div class="time">{{ prettytime(item.timestamp) }} ago</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="result2.page_count"
              :page-size="result2.page_size"
              @current-change="pageChange"
              class="page-foot"
            ></el-pagination>
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
  name: "TransactionsPage",
  props: {},
  data() {
    return {
      txType: {
        0: "Transactions",
        1: "Contract Creation",
        2: "Contract Call",
      },
      address: "",
      page: 1,
      balance: 0,
      result: {
        page_count: 0,
        page_size: 10,
        transaction: {
          id: 0,
          hash: "",
          timestamp: 0,
          value: "",
          kind: 0,
          block_number: 0,
          gas: "",
          gas_price: "",
        },
      },
      result2: {},
    };
  },
  activated() {
    console.log("activated");
  },
  beforeMount() {
    this.addr = this.$route.params.address;
    this.getBalance(this.addr);
    this.getTransactions(this.addr, this.page);
  },
  methods: {
    async getBalance(addr) {
      const { data: _data } = await axios.get(
        "/api/v1/transaction/balance?miner=" + addr
      );
      this.result = _data;
      this.balance = (
        Number(this.result.Balance) / 1000000000000000000
      ).toFixed(8);
      console.log(this.balance);
    },
    async getTransactions(addr, page) {
      const { data: _data } = await axios.get(
        "/api/v1/transaction/miner?miner=" + addr + "&page=" + page
      );
      this.result2 = _data;
    },
    pageChange(page) {
      this.getTransactions(this.$route.params.address, page);
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

      var days = parseInt(span / (60 * 60 * 24));
      if (days > 0) {
        return days == 1 ? days + "day" : days + " days";
      }
      var hours = parseInt((span % (60 * 60 * 24)) / (60 * 60));
      if (hours > 0) {
        return hours == 1 ? hours + "h" : hours + "hs";
      }
      var minutes = parseInt((span % (60 * 60)) / 60);
      if (minutes > 0) {
        return minutes == 1 ? minutes + "min" : minutes + "mins";
      }
      return span + "s";
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
    verifyAddressLegality(addr) {
      if (utils.isAddress(addr)) {
        return addr;
      } else {
        return this.$t("Invalid Address");
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
.detail {
  border: solid 1px #eee;
  border-radius: 4px;
  margin: 15px 50px;
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
.detail .head .title {
  text-align: left;
  padding-left: 15px;
}
.detail .head .title h2 {
  margin: 0px;
  padding: 0px;
  line-height: 60px;
}
.detail .item {
  display: flex;
  padding-bottom: 20px;
}
.detail .item .title {
  width: 280px;
  text-align: left;
  padding-left: 20px;
  font-size: 16px;
  font-weight: 550;
  color: #6c757d;
  display: flex;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.detail .item .title img {
  width: 20px;
  height: 20px;
  padding-right: 5px;
}
.detail .item .value {
  flex: 1;
  text-align: left;
  padding-left: 20px;
  font-size: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.detail .item a {
  color: #7e74ec;
  font-size: 13px;
  text-decoration: none;
}
.transactions {
  border: solid 1px #eee;
  border-radius: 4px;
  margin: 15px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding-right: 5px;
  min-height: 300px;
}
.transactions .inner {
  padding: 0 10px;
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
  border-radius: 4px;
  color: #6c757d;
  flex-grow: 1;
  font-size: 12px;
  line-height: 1.4rem;
  border-left: 0px solid #7e74ec;
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
  line-height: 75px;
  padding: 10px;
  font-size: 16px;
  font-weight: 550;
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
  color: rgb(89, 89, 216);
  font-size: 13px;
  text-decoration: none;
}
.transaction .operation {
  height: 25px;
  line-height: 25px;
}
.transaction .operation a {
  color: #5959d8;
  font-size: 13px;
  text-decoration: none;
}
.transaction .fee {
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  font-weight: 500;
}
.transaction .fee .tagIn {
  color: #02977e;
  background-color: rgba(0, 201, 167, 0.2);
  border-radius: 5px;
  margin: 0 5px 0 0;
  padding: 2px 5px;
}
.transaction .fee .tagOut {
  color: #b47d00;
  background-color: rgba(219, 154, 4, 0.2);
  border-radius: 5px;
  margin: 0 5px 0 0;
  padding: 2px 5px;
}
.transaction .block {
  width: 200px;
  padding: 10px 20px;
}
.transaction .block .num {
  padding-top: 25px;
}
.transaction .block .num a {
  color: #5959d8;
  font-size: 13px;
  text-decoration: none;
}
.transaction .block .time {
  height: 25px;
  font-size: 14px;
}
.el-menu--horizontal > .el-menu-item {
  height: 50px;
  line-height: 50px;
}
.page-foot {
  margin: 30px;
}
.foot {
  font-size: 13px;
  padding-bottom: 10px;
  color: #999;
}
:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #7e74ec !important;
  color: #fff;
}
</style>
