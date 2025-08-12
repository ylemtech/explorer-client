<template>
  <el-container>
    <el-main>
      <el-row class="header">
        <el-col class="container">
          <img
            src="/images/logo.png"
            class="logo"
            onclick="window.open('/','_self')"
          />
          <span class="title" onclick="window.open('/','_self')">{{$t("YLEMSCAN")}}</span>

          <el-dropdown class="chain" trigger="click" @command="handleChain">
            <span class="el-dropdown-link">
              <el-tag  size="small">{{ chainType }}</el-tag>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, key) in chain"
                :key="item.id"
                :command="item"
                >{{ key }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>

        <el-col class="menu">
          <el-menu
            :default-active="activeMenu"
            style="border-bottom: none; font-size: 18px"
            mode="horizontal"
            @select="selectMenu"
          >
            <el-menu-item index="1">{{ $t("Home") }}</el-menu-item>
            <el-menu-item index="2">{{ $t("Blocks") }}</el-menu-item>
            <el-menu-item index="3">{{ $t("Transactions") }}</el-menu-item>
            <el-menu-item index="4">{{ $t("NFTs") }}</el-menu-item>
          </el-menu>
        </el-col>

        <el-col class="search">
          <el-input
            maxlength="66"
            :placeholder="$t('input block or hash or address')"
            prefix-icon="el-icon-search"
            v-model.trim="keyword"
            @change="search()"
          ></el-input>
        </el-col>

        <el-dropdown class="lang" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <img src="/images/lang.png" alt="" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, key) in lang"
              :key="item.id"
              :command="item"
              >{{ key }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import axios from "../utils/axios";
export default {
  data() {
    return {
      activeMenu: "1",
      keyword: "",
      lang: {
        English: "en-US",
        "中文（简体）": "zh-CN",
        "中文（繁体）": "zh-HK",
        "한국인（KR）": "ko-KR",
        "日本語（JP）": "ja-JP",
        "Indonesia（ID）": "en-US",
      },
      chain: {
        Mainnet: "Mainnet",
        Testnet: "Testnet",
      },
      chainType: "Mainnet",
      chainApi: ""
    };
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        console.log("Load the same page, transmitting different parameters, reloading");
        this.$nextTick(() => {
          location.reload();
        });
      }

      this.keyword = "";

      if (to.path == "/") {
        this.activeMenu = "1";
      } else if (to.path == "/blocks") {
        this.activeMenu = "2";
      } else if (to.path == "/txs") {
        this.activeMenu = "3";
      } else {
        this.activeMenu = "4";
      }

      localStorage.setItem("activeMenu", this.activeMenu);
    },
  },
  mounted() {
    this.activeMenu = localStorage.getItem("activeMenu");
    if (this.activeMenu == null) {
      this.activeMenu = "1";
    }
  },
  beforeMount() { 
    this.chainType = localStorage.getItem("chainType");
    this.chainApi = localStorage.getItem("chainApi");
    if (this.chainType == null || this.chainType == "Mainnet") {
      this.chainType = "Mainnet";
      this.chainApi = "";
      // axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? "https://www.ylemscan.io" : "/root"
    }else if(this.chainType == "Testnet") {
      this.chainApi = "/test";
      // axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? "https://www.ylemscan.io" : "/test" 
    }
    localStorage.setItem("chainApi", this.chainApi);
  },
  methods: {
    search() {
      try {
        console.log("start search:" + this.keyword);
        var reg = /^[0-9]*[1-9][0-9]*$/;
        if (this.keyword == "") return;
        if (reg.test(this.keyword) || this.keyword == 0) {
          console.log("search block");
          // Compare two height differences - int type
          axios.get(localStorage.getItem("chainApi") + "/api/v1/block?id=" + this.keyword).then((data) => {
            if (data.data != null) {
              this.$router.push("/block/" + this.keyword);

              this.keyword = "";
            } else {
              this.showErrorPage();
            }
          });
        } else {
          let e = this.keyword.length;
          if (e === 66 || e === 64) {
            console.log("search tx");
            this.keyword =
              e === 64 && !this.keyword.startsWith("0x")
                ? "0x" + this.keyword
                : this.keyword;
            // The hash value of the transaction - address 64 bytes plus hexadecimal identifier 0x (a total of 66 bits)
            axios
              .get(localStorage.getItem("chainApi") + "/api/v1/tx?id=" + this.keyword)
              .then((data) => {
                console.log("res=", data);
                if (data.data != null) {
                  this.$router.push("/tx/" + this.keyword);
                } else {
                  this.showErrorPage();
                }
              })
              .catch((err) => {
                console.log("err", err);
                this.showErrorPage();
              });
          } else if (e === 40 || e === 42) {
            // console.log("search addr");

            axios
              .get(localStorage.getItem("chainApi") +  "/api/v1/transaction/balance?miner=" + this.keyword)
              .then((data) => {
                if (data.data != null) {
                  this.$router.push("/address/" + this.keyword);

                  this.keyword = "";
                } else {
                  this.showErrorPage();
                }
              });
          } else {
            console.log("search other");
            this.showErrorPage();
          }
        }
      } catch (e) {
        console.log("error");
        this.showErrorPage();
      }
    },
    showErrorPage() {
      console.log("error");
      this.$router.push({
        path: "/error",
        query: { text: this.keyword },
      });
      this.keyword = "";
    },
    selectMenu(index) {
      if (index == "1") {
        this.$router.push("/");
      }
      if (index == "2") {
        this.$router.push("/blocks");
      }
      if (index == "3") {
        this.$router.push("/txs");
      }
      if (index == "4") {
        this.$router.push("/nfts");
      }

      localStorage.setItem("activeMenu", index);
    },
    handleCommand(command) {
      console.log("click on item " + command);
      this.$i18n.locale = command;
    },
    handleChain(chain) {
      console.log("click on item " + chain);
      this.chainType = chain;
      if(this.chainType == "Mainnet") {
        this.chainApi = ""
        // axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? "https://www.ylemscan.io" : "/root"
      }else if(this.chainType == "Testnet") {
        this.chainApi = "/test"
        // axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? "https://www.ylemscan.io" : "/test"
      }
      localStorage.setItem("chainType", this.chainType);
      localStorage.setItem("chainApi", this.chainApi);

      localStorage.setItem("activeMenu", "1");

      window.open('/','_self');
    },
  },
};
</script>
<style scoped>
.el-container {
  padding-bottom: 10px;
}

.el-main {
  padding: 0;
}
.header {
  display: flex;
  justify-content: space-between;
  height: 80px;
  padding: 0 50px;
}
.header .container {
  display: flex;
  padding: 20px 0px 10px 0px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 20%;
  min-width: 210px;
}
.header .chain {
  margin: 8px 0 0 10px;
}
.header .menu {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 5px 0px;
  width: 40%;
}
.header .logo {
  height: 40px;
  width: 40px;
}
.header .title {
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  font-weight: 600;
}
.header .search {
  padding: 20px 10px 10px 0;
  float: right;
  width: 30%;
}
.header .lang {
  padding: 23px 0px 0px 0px;
  float: right;
  width: 50px;
}
.el-dropdown {
  height: 30px;
  vertical-align: top;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-dropdown + .el-dropdown {
  margin-left: 1px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #7e74ec;
  color: #303133;
}
</style>
