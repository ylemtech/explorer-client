<template>
  <el-container>
    <el-main>
      <el-row class="detail">
        <div class="flex-row">
          <div class="leftBox">
            <img
              v-if="result.imageUri"
              :src="result.imageUri"
              alt=""
              class="nft-image"
            />
            <img v-else :src="placeholder" alt="" class="nft-image" />
          </div>
          <div class="rightBox">
            <el-row class="head">
              <el-col class="title"
                ><h2>{{ $t("NFT Detail") }}</h2></el-col
              >
            </el-row>
            <el-row class="item">
              <el-col class="title">
                <div><img src="/images/info.png" /></div>
                {{ $t("Contract Address") }}</el-col
              >
              <el-col class="value">{{
                result.to
              }}</el-col>
            </el-row>

            <el-row class="item">
              <el-col class="title">
                <div><img src="/images/info.png" /></div>
                {{ $t("Owner") }}</el-col
              >
              <el-col class="value" v-if="result.receiver.length>0">{{
                result.receiver
              }}</el-col>
              <el-col class="value" v-else>{{
                result.sender
              }}</el-col>
            </el-row>

            <!-- <el-row class="item">
              <el-col class="title">
                <div><img src="/images/info.png" /></div>
                {{ $t("Creator") }}</el-col
              >
              <el-col class="value"
                ><router-link
                  :to="'/block/' + result.transaction.block_number"
                  >#{{
                    thousands("" + result.transaction.block_number)
                  }}</router-link
                ></el-col
              >
            </el-row> -->

            <el-row class="item">
              <el-col class="title">
                <div><img src="/images/info.png" /></div>
                {{ $t("Token ID") }}</el-col
              >
              <el-col class="value"
                >{{result.tokenId}}</el-col
              >
            </el-row>

            <el-row class="item">
              <el-col class="title">
                <div><img src="/images/info.png" /></div>
                {{ $t("Token Standard") }}</el-col
              >
              <el-col class="value"
                >{{
                 $t(contractType[result.type])
                }}</el-col
              >
            </el-row>

            <el-row class="item">
              <el-col class="title">
                <div><img src="/images/info.png" /></div>
                {{ $t("Descrption") }}</el-col
              >
              <el-col class="value1"
                >{{
                  result.description
                }}</el-col
              >
            </el-row>
          </div>
        </div>
      </el-row>

      <!-- <el-row class="foot"
        >Copyright © ylemscan.io All Rights Reserved.
      </el-row> -->
    </el-main>
  </el-container>
</template>
<script>
import { utils } from "web3";
import axios from "../utils/axios";
//import FileSaver from 'file-saver';
// import { ethers } from "ethers";

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
      contractType: {
        1: "ERC-721",
        2: "ERC-1155",
      },
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
      contract: null,
      contractAddr: "",
      contractAbi: `[
        {
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
  {
		"inputs": [],
		"name": "contractURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`,
    };
  },
  mounted() {
    this.result= this.$route.query;
   
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(this.result.contractAddr, this.contractAbi);
    // this.contract = new ethers.Contract(
    //   this.result.contractAddr,
    //   this.contractAbi,
    //   provider.getSigner()
    // );
    // this.tokenURI();
    // var content = JSON.stringify({
    //   name: "heloo", name1: "heloo"
    // });
    // var blob = new Blob([content], {
    //   type: "text/plain;charset=utf-8",
    // });
    // console.log(blob);
    // let file = new File([content], `${1}.json`, {
    //   type: "application/json",
    // });
    // console.log(file);
    // FileSaver.saveAs(blob, "jiedao_8hou.json");
    this.getTransaction(this.$route.params.id);
  },
  methods: {
    async getTransaction(id) {
      const { data: _data } = await axios.get("/api/v1/tx?id=" + id);
      this.result = _data.transaction;
        var str = _data.transaction.imageUri;
        // let str2 = str.replace('https://ipfs.io/ipfs/', 'https://nftstorage.link/ipfs/')
        let str2 = str.replace("https://ipfs.io", "https://nftstorage.link");
        // .ipfs.nftstorage.link
         this.result.imageUri = str2;
      //       const abiERC20 = [
      //     "function contractURI() view returns (string)",
      //     "function ownerOf() view returns (string)",
      //     "function balanceOf(address) view returns (uint)",
      // ];
    },
    async tokenURI() {
      // const res = await this.contract.tokenURI(2);
      // console.log(res)
      // this.result.description = res;
      // const res1 = await this.contract.ownerOf("2");
      // console.log(res1)
      // this.result.owner = res1;
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
.detail {
  border: solid 1px #eee;
  border-radius: 4px;
  margin: 15px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  padding: 60px;
  height: auto;
  /* min-height: 230px; */
}
.leftBox {
  min-width: 300px;
  height: auto;
  min-height: 300px;
  justify-content: center;
  border: #dee2e6 solid 1px;
  padding: 10px;
  border-radius: 10px;
  width: 40%;
}
.rightBox {
  width: 60%;
  padding: 20px 40px 0 20px;
}
.NFT-box {
  line-height: 15px;
}
.nft-image {
  height: 100%;
  width: 100%;
  object-fit: contain;
  border-radius: 5px;
  background: #efeff0;
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
  padding-bottom: 10px;
  line-height: 30px;
}
.detail .item .title {
  width: 280px;
  text-align: left;
  padding-left: 20px;
  font-size: 15px;
  font-weight: 500;
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
  margin-top: 5px;
}
.detail .item .value {
  flex: 1;
  text-align: left;
  padding-left: 20px;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.detail .item .value1 {
  flex: 1;
  text-align: left;
  padding-left: 20px;
  font-size: 14px;
  /* white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden; */
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
  min-height: 200px;
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
  border-left: 4px solid #7e74ec;
}
.transaction .contract {
  border-left: 4px solid #28a745;
}
.transaction .body .type {
  background-color: rgba(0, 123, 255, 0.1);
  border-bottom: 1px solid #7e74ec;
  border-right: 1px solid #7e74ec;
  border-top: 1px solid #7e74ec;
  color: #7e74ec;
  width: 200px;
  line-height: 75px;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
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
}

.transaction .hash {
  height: 25px;
  line-height: 25px;
}
.transaction .hash a {
  color: #7e74ec;
  font-size: 13px;
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
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  font-weight: 500;
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
