<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <footer>
      <div class="container">
        <div class="btn-area" @click="goNext('/')">
          <div class="btn-icon" :class="{selected: iconSelected === 'main'}"><i class="fas fa-2x fa-home"></i></div>
          <div class="btn-text">首頁</div>
        </div>
        <div class="btn-area"  @click="goNext('/category/women')">
          <div class="btn-icon" :class="{selected: iconSelected === 'category'}"><i class="fas fa-2x fa-tshirt"></i></div>
          <div class="btn-text">商品</div>
        </div>
        <div class="btn-area" @click="goToOrder">
          <!-- <div class="red-dots" v-if="cartsNum != 0">{{ cartsNum }}</div> -->
          <div class="btn-icon" :class="{selected: (iconSelected === 'order') || (iconSelected === 'order-check')}">
              <div class="red-dots" v-if="cartsNum != 0">{{ cartsNum }}</div>
              <i class="fas fa-2x fa-cart-plus"></i>
            </div>
          <div class="btn-text">結帳</div>
        </div>
        <div class="btn-area" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <!-- <div class="btn-icon"><i class="fas fa-2x fa-ellipsis-h"></i></div> -->
          <div class="btn-icon" :class="{selected: iconSelected === 'page'}"><i class="far fa-2x fa-user"></i></div>
          <div class="btn-text">更多</div>
          <div class="dropdown-menu">
            <div class="dropdown-item dropdown-search-item text-center" @click="goNext('/page/package')">運送方式</div>
            <div class="dropdown-item dropdown-search-item text-center" @click="goNext('/page/policy')">隱私政策</div>
            <div class="dropdown-item dropdown-search-item text-center" @click="goNext('/page/terms')">服務條款</div>
            <div class="dropdown-item dropdown-search-item text-center" @click="goNext('/page/disclaimer')">免責聲明</div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  data () {
    return {
      cartArrayToLS: [],
      carts: {},
      status: {
        itemId: '',
        cartId: '',
        loading: ''
      },
      isLoading: false,
      iconSelected: 'main'
    }
  },
  methods: {
    goNext (url) {
      this.$router.push(url)
    },
    getCartFromLS () {
      const vm = this
      if (JSON.parse(localStorage.getItem('Cart'))) {
        vm.cartArrayToLS = JSON.parse(localStorage.getItem('Cart'))
        const total = vm.cartArrayToLS.reduce((prev, item, index) => {
          // console.log(prev, item.product.price, item.qty, index);
          return prev + (item.product.price * item.qty)
        }, 0)
        vm.carts.total = total
      }
      console.log('vm.cartArrayToLS', vm.cartArrayToLS)
    },
    goToOrder () {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      const vm = this
      const timestamp = Math.floor(Date.now())
      let count = 0
      if (vm.cartArrayToLS.length === 0) {
        vm.$bus.$emit('message:push', '您還沒有選購商品喔', 'warning')
      } else {
        // this.$router.push(`/order/${timestamp}`)
        vm.isLoading = true
      }

      vm.cartArrayToLS.forEach((element) => {
        let cart = {
          product_id: element.product.id,
          qty: element.qty
        }
        this.$http.post(api, { data: cart }).then((response) => {
          console.log(response.data)
          if (response.data.success) {
            count++
          }
          if (vm.cartArrayToLS.length === count) {
            vm.cartArrayToLS = []
            localStorage.setItem('Cart', JSON.stringify(vm.cartArrayToLS))
            vm.getCartFromLS()
            vm.btnStatus = ''
            vm.$router.push(`/order/${timestamp}`)
            vm.isLoading = false
          }
          vm.status.cartId = ''
        })
      })
    }
  },
  computed: {
    cartsNum () {
      // Local Storage
      if (this.cartArrayToLS) {
        return this.cartArrayToLS.length
      } else {
        return 0
      }
      // Local Storage
    }
  },
  watch: {
    '$route' (a, b) {
      if (this.$route.path === '/') {
        this.iconSelected = 'main'
      } else {
        this.iconSelected = this.$route.path.split('/')[1]
      }
    }
  },
  created () {
    const vm = this
    vm.getCartFromLS()
    vm.$bus.$on('getCartLS:push', () => {
      vm.getCartFromLS()
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;

  .btn-area {
    width: 100%;
    height: 60px;
    // background-color: bisque;
    // display: flex;
    // justify-content: center;
    // align-items: center;

    // a {
    //   width: 100%;
    // }

    .btn-icon {
      width: 100%;
      height: 30px;
      margin-top: 10px;
      text-align: center;
      color: #d9d9d9;
      // color: #fff2f2;

      .red-dots {
        height: 18px;
        width: 18px;
        margin: 0;
        padding: 0;
        background: #fff;
        text-align: center;
        border-radius: 50%;
        // border: #fff 1px solid;
        background: #dc3545;
        color: #fff;
        line-height: 16px;
        position: absolute;
        top: 2px;
        left: 64%;
        z-index: 1500;
        transition: all .5s ease-in-out;
      }
    }
    .selected {
      color: #999999;
    }
    .btn-text {
      width: 100%;
      height: 20px;
      text-align: center;
      color: #bbbbbb;
      font-size: 12px;
    }
    .dropdown-menu {
      min-width: 10px;
      // background-color: #fff0f0;
      background: white \9;
      filter: alpha(opacity=85) \9;
      background-color: rgba(239, 235, 230, .85);
      // border: none;

      // div {
      //   color: #FAD0D0;
      // }
    }
  }
}
</style>
