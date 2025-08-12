<template>
  <el-container>
    <el-main>
      <el-row class="transactions">
        <el-col class="inner">
          <el-row class="head">
            <el-col class="title"
              ><h2>{{ $t("Transactions") }}</h2></el-col
            >
          </el-row>
          <el-row
            v-for="item in result.transactions"
            :key="item.id"
            class="transaction"
          >
            <el-col style="padding-bottom: 10px">
              <el-row :class="{ body: true, contract: item.kind !== 0 }">
                <el-col :class="{ type: true, contract: item.kind !== 0 }"
                  >{{ $t(txType[item.kind]) }}
                </el-col>
                <el-col class="content">
                  <!-- <div class="hash">
                    {{ $t("hash") }}
                    <router-link :to="'/tx/' + item.hash">{{
                      item.hash | filterHash
                    }}</router-link>
                  </div> -->
                  <div class="operation">
                    {{ $t("hash") }}
                    <router-link :to="'/tx/' + item.hash">{{
                      item.hash | filterHash
                    }}</router-link>
                    {{ $t("from") }}
                    <router-link :to="'/address/' + item.from">
                      {{ item.from | addressEll }}</router-link
                    ><span v-if="item.kind !== 1"> → {{ $t("to") }} </span
                    ><router-link :to="'/address/' + item.to">{{
                      item.to | addressEll
                    }}</router-link>
                  </div>
                  <div class="bottom flex-row">
                    <div class="bottom-box">
                      <span class="contract-type" v-if="item.type == 1"
                        >ERC-721</span
                      >
                      <span class="contract-type" v-if="item.type == 2"
                        >ERC-1155</span
                      >
                    </div>
                    <div class="bottom-box">
                      <span>{{ $t(Method) }}&nbsp;</span>
                      <span class="value">{{ item.method }}</span>
                    </div>
                    <div class="bottom-box" v-if="item.value">
                      <span>value&nbsp;</span>
                      <span class="value">
                        {{
                          thousands(
                            "" + toTokens(hexToNumberString(item.value))
                          )
                        }}&nbsp;YLEM</span
                      >
                    </div>
                    <div class="bottom-box" v-if="item.gas">
                      <span>gas</span>
                      <span class="value">
                        {{ "" + hexToNumberString(item.gas) }}
                      </span>
                    </div>
                    <div class="" v-if="item.name">
                      <span>item&nbsp;</span>
                      <span class="value">{{ item.name }}&nbsp;&nbsp;</span>
                    </div>
                    <!-- <router-link :to="'/nft?id=' + result.transaction.hash"> -->
                    <router-link
                      :to="'/nft/' + item.hash"
                      class="bottom-box"
                      v-if="showNFT(item)"
                    >
                      <img
                        v-if="!item.imageUri"
                        :src="placeholder"
                        alt=""
                        class="nftImg"
                      />
                      <img
                        v-if="item.imageUri"
                        :src="item.imageUri || placeholder"
                        alt=""
                        class="nftImg"
                      />
                    </router-link>
                    <!-- <div class="fee">
                      {{
                        thousands("" + toTokens(hexToNumberString(item.value)))
                      }}
                      YLEM
                    </div> -->
                  </div>
                </el-col>
                <!-- <el-col class="nftBlock" v-if="item.imageUri">
                  <div>NFT</div>
                  <img :src="item.imageUri" alt="" class="nftImg" /></el-col> -->
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
              :total="result.page_count"
              :page-size="result.page_size"
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
      placeholder: "./images/NFT.png",
      txType: {
        0: "Transactions",
        1: "Contract Creation",
        2: "Contract Call",
      },
      result: {
        page_count: 0,
        page_size: 10,
      },
    };
  },

  mounted() {
    this.getTransations(1);
  },

  methods: {
    async getTransations(page) {
      const { data: _data } = await axios.get(
        localStorage.getItem("chainApi") + "/api/v1/txs?page=" + page + "&type=3"
      );
      _data.transactions.forEach((element) => {
        var str = element.imageUri;
        // let str2 = str.replace('https://ipfs.io/ipfs/', 'https://nftstorage.link/ipfs/')
        let str2 = str.replace("https://ipfs.io", "https://nftstorage.link");
        // .ipfs.nftstorage.link
        element.imageUri = str2;
        // console.log(element.imageUri);
      });
      this.result = _data;
    },
    pageChange(page) {
      this.getTransations(page);
    },
    showNFT(item) {
      if (
        item.method == "mint" ||
        item.method == "burn" ||
        item.method == "safeTransferFrom" ||
        item.method == "transferFrom"
      ) {
        return true;
      }
      return false;
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
        return days == 1 ? days + "day" : days + "days";
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
.flex-col {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}

.transactions {
  border: solid 1px #eee;
  border-radius: 4px;
  margin: 15px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding-right: 5px;
  min-height: 200px;
}
.transactions .inner {
  padding: 0 10px;
}
.nftBlock {
  width: 100px;
  margin-top: 10px;
}
.nftImg {
  width: 25px;
  height: 25px;
  margin-top: 2px;
  object-fit: contain;
  border-radius: 5px;
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
  line-height: 1.2rem;
  border-left: 0px solid #7e74ec;
}
.transaction .contract {
  border-left: 0px solid #28a745;
}
.transaction .body .type {
  background-color: rgba(95, 81, 255, 0.03);
  border: 1px solid #7e74ec;
  border-radius: 5px;
  color: #7e74ec;
  width: 120px;
  height: 70px;
  line-height: 70px;
  padding: 0px;
  font-size: 14px;
  font-weight: 500;
}
.transaction .body .contract {
  background-color: rgba(40, 167, 69, 0.1);
  border: 1px solid #28a745;
  color: #28a745;
  font-size: 12px;
  font-weight: 500;
}
.transaction .content {
  flex: 1;
  width: 100%;
  padding: 0px 20px;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.bottom {
  height: 30px;
  line-height: 30px;
}
.bottom-box {
  margin: 0 20px 0 0;
  /* width: 100px; */
}
.contract-type {
  border: #dee2e6 solid 1px;
  border-radius: 10px;
  height: 20px;
  width: 80px;
  padding: 2px 8px;
  color: black;
}
.value {
  color: #28a745;
}
.transaction .hash {
  height: 25px;
  line-height: 25px;
}
.transaction .hash a {
  color: rgb(89, 89, 216);
  font-size: 12px;
  text-decoration: none;
}
.transaction .operation {
  height: 15px;
  line-height: 15px;
  margin: 15px 0 5px 0;
}
.transaction .operation a {
  color: #5959d8;
  font-size: 13px;
  text-decoration: none;
}
.transaction.content.bottom {
  display: flex;
}
.transaction.content.fee {
  height: 25px;
  line-height: 25px;
  font-size: 13px;
  font-weight: 500;
  float: left;
}
.transaction .block {
  justify-content: center;
  width: 200px;
  padding: 0px 20px;
}
.transaction .block .num {
  padding-top: 15px;
}
.transaction .block .num a {
  color: #5959d8;
  font-size: 13px;
  text-decoration: none;
}
.transaction .block .time {
  height: 20px;
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
