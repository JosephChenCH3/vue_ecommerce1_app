<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light navbar-scroll fixed-top shadow-sm">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <img height="50" class="" src="@/assets/logo2.png" @click="btnStatus = '/main'">
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" @click="navCollapseShadow">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto ml-3 justify-content-around">
            <li class="nav-item">
              <router-link class="nav-link px-3 h6" to="/category/women" :class="{'selected': btnStatus == 'women'}">
                WOMEN
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 h6" to="/category/men" :class="{'selected': btnStatus == 'men'}">
                MEN
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 h6" to="/category/kids" :class="{'selected': btnStatus == 'kids'}">
                KIDS
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 h6" to="/category/baby" :class="{'selected': btnStatus == 'baby'}">
                BABY
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 h6" to="/category/sports" :class="{'selected': btnStatus == 'sports'}">
                SPORTS
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <SearchInput class="set-position-si top35"></SearchInput>
    <CartAndPay class="set-position-cp top35"></CartAndPay>
  </div>
</template>
<script>
import $ from 'jquery' // Import js file
import SearchInput from './SearchInput'
import CartAndPay from './CartAndPay'

export default {
  components: {
    SearchInput,
    CartAndPay
  },
  data () {
    return {
      btnStatus: '',
      navCollapseShadowStatus: false,
      cartStatus: ''
    }
  },
  methods: {
    navCollapseShadow () {
      this.navCollapseShadowStatus = !this.navCollapseShadowStatus
      if (this.navCollapseShadowStatus) {
        $('.navbar-collapse').addClass('shadow-sm')
      } else {
        $('.navbar-collapse').removeClass('shadow-sm')
      }
    },
    setPositionSI () {
      if (this.cartStatus !== 0) {
        $('.set-position-si').addClass('right100')
      } else {
        $('.set-position-si').removeClass('right100')
      }
    }
  },
  computed: {

  },
  watch: {
    '$route': function (a, b) {
      // console.log('$route', a, b)
      this.btnStatus = this.$route.params.productCategory
      $('#navbarSupportedContent').collapse('hide')
    },
    cartStatus () {
      this.setPositionSI()
    }
  },
  created () {
    const vm = this
    const value = this.$router.history.current.path
    this.btnStatus = value.split('/category/').join('')
    console.log('btnStatus', this.btnStatus)
    if (JSON.parse(localStorage.getItem('Cart')) && (JSON.parse(localStorage.getItem('Cart')) !== [])) {
      const array = JSON.parse(localStorage.getItem('Cart'))
      this.cartStatus = array.length
    } else {
      this.cartStatus = 0
    }
    vm.$bus.$on('cartStatus:push', (data) => {
      if (data === 'clear') {
        this.cartStatus = 0
      } else {
        this.cartStatus = Number(this.cartStatus + data)
      }
    })
    vm.$bus.$on('navbarItemSeleted', () => {
      vm.btnStatus = ''
    })
    $(window).bind('scroll resize', function () {
      const vm = $(this)
      var vmTop = vm.scrollTop()
      if (vmTop > 150) {
        $('.navbar-scroll').addClass('navbar-addStyle')
        $('.set-position-si').removeClass('top35')
        $('.set-position-cp').removeClass('top35')
        $('.set-position-si').addClass('top20')
        $('.set-position-cp').addClass('top20')
      } else {
        $('.navbar-scroll').removeClass('navbar-addStyle')
        $('.set-position-si').removeClass('top20')
        $('.set-position-cp').removeClass('top20')
        $('.set-position-si').addClass('top35')
        $('.set-position-cp').addClass('top35')
      }
    }).scroll()
    // $('.carousel').carousel();
  },
  mounted () {
    this.setPositionSI()
  }
}

</script>
<style scoped src="../assets/css/UserNavbar.css">
</style>
