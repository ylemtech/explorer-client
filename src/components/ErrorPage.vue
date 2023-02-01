<template>
  <el-container>
    <el-main>
      <el-row class="detail">
        <el-row class="head">
          <el-col class="title"><h2> NOT FOUND ！！！</h2></el-col>
        </el-row>
        <el-row class="item">
          <el-row class="title">
            <!-- <div><img src="/images/error.png" /></div> -->
            <div>The search string you entered was:</div>
            <div style="color: #5f51ff">{{ this.text }}</div>
            <div>Sorry! This is an invalid search string.</div>
            <router-link class="back" to="/">Back Home</router-link>
          </el-row>
        </el-row>
      </el-row>
      <el-row class="foot"
        >Copyright © ylemscan.io All Rights Reserved.
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "TransactionsPage",
  props: {},
  data() {
    return {
      text: "",
    };
  },
  beforeMount() {
    this.text = this.$route.query.text;
  },
  methods: {},
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
  min-height: 560px;
  background-image: url("/public/images/error.jpg");
  background-size: 60%;
  background-position: right bottom;
  background-repeat: no-repeat;
}
.detail .head {
  font-size: 18px;
  font-weight: 400;
  line-height: 60px;
  height: 60px;
  text-align: left;
  display: flex;
  padding:60px 0;
}
.detail .head .title {
  text-align: left;
  padding-left: 20px;
  /* white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden; */
}
.detail .head .title h2 {
  margin: 0px;
  padding: 20px;
  line-height: 60px;
  font-size: 30px;
}
.detail .item {
  /* display: flex; */
  margin: 30px 0;
  text-align: left;
  padding: 30px 50px;
  line-height: 40px;
}
.detail .item .title {
  width: 80%;
  text-align: left;
  /* padding-left: 20px; */
  font-size: 18px;
  font-weight: 500;
  color: #6c757d;
}
.detail .item .title .back {
  color: white;
  background-color: #7e74ec;
  padding: 10px 20px;
  line-height: 100px;
  font-size: 17px;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 400px;
}
.detail .item .title img {
  width: 20px;
  height: 20px;
  padding-right: 5px;
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
  padding: 10px;
  color: #999;
}
:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #7e74ec !important;
  color: #fff;
}
</style>
