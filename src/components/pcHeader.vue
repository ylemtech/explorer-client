<template>
  <el-container>
    <el-main>
      <el-row class="header">
        <el-col class="container" onclick="window.open('/','_self')">
          <img src="/images/logo.png" class="logo" />
          <span class="title">{{ $t("YLEMSCAN") }}</span>
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
            <img src="/images/lang.png" alt="">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,key) in lang"  :key="item.id" :command="item">{{key}}</el-dropdown-item>
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
      lang:{"English":"en-US","中文（简体）":"zh-CN","中文（繁体）":"zh-HK","한국인（KR）":"ko-KR","日本語（JP）":"ja-JP","Indonesia（ID）":"en-US"}
    };
  },
  watch: {
    $route(to, from) {
      if (to.path == from.path) {
        console.log("加载同一页面");
        this.$nextTick(() => {
          location.reload();
          if (to.path != "/" && to.path != "/blocks" && to.path != "/txs") {
            this.activeMenu = "4";
          }
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
    },
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
          axios.get("/api/v1/block?id=" + this.keyword).then((data) => {
            if (data.data != null) {
              this.$router.push({
                path: "/block",
                query: { id: this.keyword },
              });
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
              .get("/api/v1/tx?id=" + this.keyword)
              .then((data) => {
                console.log("res=", data);
                if (data.data != null) {
                  this.$router.push({
                    path: "/tx",
                    query: { id: this.keyword },
                  });
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
              .get("/api/v1/transaction/balance?miner=" + this.keyword)
              .then((data) => {
                if (data.data != null) {
                  this.$router.push({
                    path: "/addr",
                    query: { addr: this.keyword },
                  });
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
      } if (index == "4") {
        this.$router.push("/nfts");
      }
    },
     handleCommand(command) {
       console.log('click on item ' + command);
       this.$i18n.locale = command;
     }
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
  justify-content:  space-between;;
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
  min-width: 180px;
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
    color: #409EFF;
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
