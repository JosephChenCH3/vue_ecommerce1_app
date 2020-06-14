<template>
  <div>
    <UserNavbar :appHeaderProps="appHeaderProps"></UserNavbar>
      <Alert></Alert>
      <div class="container">
        <div style="height: 80px"></div>
        <div id="v-content" v-bind:style="{minHeight: Height+'px'}">
          <!-- <router-view :key="$route.path"></router-view> -->
          <router-view></router-view>
        </div>
        <div class="top mousePointer" @click="goToTop">
          <img width="31" height="49" src="@/assets/icon_top.png" alt=""/>
        </div>
        <div class="coupon mousePointer btn_shake" @click="openCouponModal">
          <img width="65" height="65" src="@/assets/Coupon-High-Quality-PNG.png" alt=""/>
        </div>
        <div style="height: 70px"></div>
      </div>
    <div class="modal fade" id="promoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <CouponModal></CouponModal>
    </div>
    <!-- <UserFooter></UserFooter> -->
    <BtnFooter class="footer-fixed"></BtnFooter>
    </div>
</template>

<script>
import $ from 'jquery' // Import js file
import UserNavbar from './UserNavbar'
// import UserFooter from './UserFooter'
import BtnFooter from './BtnFooter'
import Alert from './AlertMessage'
import CouponModal from './CouponModal'

export default {
  components: {
    UserNavbar,
    // UserFooter,
    BtnFooter,
    CouponModal,
    Alert
  },
  data () {
    return {
      Height: 0,
      appHeaderProps: '',
      title: ''
    }
  },
  methods: {
    goToTop () {
      // window.scrollTo(0,0);
      $('html, body').animate({ scrollTop: 0 }, 400)
    },
    openCouponModal () {
      $('#promoModal').modal('show')
    }
  },
  watch: {
    title () {
      this.appHeaderProps = this.title
    }
  },
  created () {
    const vm = this
    vm.$bus.$on('title:push', (title) => {
      vm.title = title
    })
  },
  mounted () {
    $(window).bind('scroll resize', function () {
      var vm = $(this)
      var vmTop = vm.scrollTop()
      if (vmTop > 150) {
        $('.top').addClass('top_show')
        $('.coupon').addClass('top_show')
      } else {
        $('.top').removeClass('top_show')
        $('.coupon').removeClass('top_show')
      }
    }).scroll()
    // $('.carousel').carousel();
    // 动态设置内容高度 让footer始终居底   header+footer的高度是190
    this.Height = document.documentElement.clientHeight - 300
    // 监听浏览器窗口变化
    window.onresize = () => { this.Height = document.documentElement.clientHeight - 300 }
  }
}
</script>

<style scoped src="../assets/css/index.css">

</style>
