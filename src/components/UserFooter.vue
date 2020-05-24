<template>
  <div>
    <footer class="page-footer font-small lativbg pt-3 mt-5">
      <div class="container ">
        <router-link class="foot-item d-inline" to="/page/package">運送方式</router-link>
        <span class="px-2">|</span>
        <router-link class="foot-item d-inline" to="/page/terms">使用條款</router-link>
        <span class="px-2">|</span>
        <router-link class="foot-item d-inline" to="/page/policy">隱私政策</router-link>
        <span class="px-2">|</span>
        <router-link class="foot-item d-inline" to="/page/disclaimer">免責聲明</router-link>
      </div>
      <div class="footer-copyright text-center light600 mt-3">© 2019 Copyright</div>
      <div class="footer-copyright text-center light600 pb-3">
        本站為單純的作品練習，資料、圖片來源皆出各衣飾網站，不使用於任何商業或營利行為
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  methods: {
    // clicker() {
    //     $(function(){
    //         $("#FB").click(function(){
    //             window.open('http://www.facebook.com/share.php?u='.concat(encodeURIComponent(location.href)))
    //         })
    //     })
    // }
  },
  created () {

  }
}
</script>

<style scoped src="../assets/css/UserFooter.css">

</style>
