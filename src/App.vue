<template>
  <div id="app">
      <pcHeader></pcHeader>
    <router-view></router-view>
  </div>
</template>

<script>
import pcHeader from "@/components/pcHeader.vue";
export default {
  name: 'App',
   components: {
    pcHeader,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 5%;
}
body {
  margin:0;
  min-width: 1200px;
}
</style>
