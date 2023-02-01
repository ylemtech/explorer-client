<template>
  <el-container>
    <el-main>
      <el-row class="header">
        <el-col class="container" onclick="window.open('/')">
          <img src="/images/logo.png" class="logo" />
          <span class="title">YLEMSCAN</span>
        </el-col>
        <el-col class="menu">
          <el-menu
            :default-active="activeMenu"
            style="border-bottom: none; font-size: 18px"
            mode="horizontal"
            @select="selectMenu"
          >
            <el-menu-item index="1">Home</el-menu-item>
            <el-menu-item index="2">Blocks</el-menu-item>
            <el-menu-item index="3">Transactions</el-menu-item>
          </el-menu>
        </el-col>
        <el-col class="search">
          <el-input
            maxlength="66"
            placeholder="Please input block or hash or address"
            prefix-icon="el-icon-search"
            v-model.trim="keyword"
            @change="search()"
          ></el-input>
        </el-col>
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
    };
  },
  watch: {
    $route(to, from) {
      if (to.path == from.path) {
          console.log("加载同一页面");
          this.$nextTick(() => { // 不加this.$nextTick时，路由跳转后还是上一次的数据，所以需要加上
          location.reload()
          if (to.path != "/" && to.path != "/blocks" && to.path != "/txs") {
             this.activeMenu = "4";
          }
        })
      }
      console.log("路由变化了");
      // console.log('当前页面路由：' + to.path);
      // console.log("上一个路由：" + from.path);
      if (to.path == "/") {
        this.activeMenu = "1";
      } else if (to.path == "/blocks") {
        this.activeMenu = "2";
      } else if (to.path == "/txs") {
        this.activeMenu = "3";
      } else {
        this.activeMenu = "4";
        console.log("wwwwwwwwwwwww");
      }
    },
  },
  methods: {
    search() {
      console.log("start search");
      var reg = /^[0-9]*[1-9][0-9]*$/;
      if (this.Value == "") return;
      if (reg.test(this.keyword) || this.keyword == 0) {
         console.log("search block")
        //判断两个高度差---int类型比较
        axios.get('/api/v1/block?id=' + this.keyword).then((data) => {
         
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
          console.log("search tx")
          this.keyword = e === 64 ? "0x" + this.keyword : this.keyword;
          //交易的哈希值---地址64位字节加上16进制标示0x(共66位)
          axios.get('/api/v1/tx?id=' + this.keyword).then((data) => {
            if (data.data != null) {
              this.$router.push({
                path: "/tx",
                query: { id: this.keyword },
              });
              this.Value = "";
            } 
            // else {
            //   //区块哈希
            //   axios.get("/api/v1/bc").then((data) => {
            //     if (data.error == null) {
            //       this.$router.push({
            //         path: "/blockDetail",
            //         query: { height: data.result.head.height },
            //       });
            //       this.keyword = "";
            //     } else {
            //       this.showErrorPage();
            //     }
            //   });
            // }
          });
        } else if (e === 40 || e === 42) {
          console.log("search addr")
          //地址
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
        }else{
          console.log("search other")
          this.showErrorPage();
        }
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
  height: 80px;
}
.header .container {
  display: flex;
  padding: 20px 0px 10px 50px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.header .menu {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 5px 0px;
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
  padding: 20px 50px 10px 0;
  float: right;
  width: 950px;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #7e74ec;
  color: #303133;
}
</style>
