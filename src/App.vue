<template>
  <div id="app">
    <loading :active.sync="isLoading"></loading>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    isLoading () {
      return this.$store.state.isLoading
    }
  }
}
</script>

<style lang="scss">
@import "./assets/css/all.scss";
@import "./assets/css/AllStyle";

html,body {
  font-family:arial,"Microsoft JhengHei","微軟正黑體",sans-serif !important;
}
</style>
