<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row">
      <div class="sidebar-sticky col-md-2 col-sm-12 col-xs-12 make-me-sticky accordion mousePointer" id="sidebar">
        <div class="col-md-12 col-sm-4 col-xs-4 mb-2 hideobj" v-for="itemt in getTypeItem" :key="itemt.id">
          <div class="collapsed" data-toggle="collapse" :data-target="`#${itemt.id}`" aria-expanded="true" :aria-controls="itemt.id">
              <i class="fas fa-tshirt light300 px-1"></i>
              <span class="text-muted">{{ itemt.type }}</span>
          </div>
          <ul class="nav flex-column collapse" :id="itemt.id" aria-labelledby="headingOne" data-parent="#sidebar">
            <li class="nav-item col-lg-12 seriesStyle" v-for="items in getSeriesItem" :key="items.id">
              <a class="ml-3" href="#" @click.prevent="getSeries(items.series)" v-if="items.type == itemt.type">
                {{ items.series }}
              </a>
            </li>
          </ul>
        </div>
        <div class="container mb-3 hideobj-md showobj">
          <select class="custom-select" id="inputGroupSelect01">
            <optgroup value="${itemt.id}-sm" v-for="itemt in getTypeItem" :key="`${itemt.id}-sm`">
              <option disabled>{{ itemt.type }}</option>
              <option value="items" v-for="items in getSeriesItem" :key="`${items.id}-sm`" v-show="items.type == itemt.type">
                <a href="#">{{ items.series }}</a>
              </option>
            </optgroup>
          </select>
        </div>
      </div>
      <div class="col-md-10 col-sm-12 px-3 ml-auto">
        <div class="card mr-auto" style="margin-bottom: 30px;">
          <img v-if="currentPath.name != 'Search'" :src="require(`@/assets/categorypic/${currentPath.params.productCategory}.jpg`)" class="card-img-top" alt="...">
          <img v-if="currentPath.name == 'Search'" src="@/assets/categorypic/search.jpg" class="card-img-top" alt="...">
        </div>
        <div class="h4" style="margin-bottom: 30px;" v-if="currentPath.name == 'Search'">
          搜尋結果：
          <span v-if="products.length ==0">無此商品</span>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-6 col-sm-6" v-for="item in productsInfiniteScroll" :key="item.id" style="margin-bottom: 30px;">
            <div class="card shadow-sm border-2">
              <div class="image-rwd mousePointer" :style="{ backgroundImage: `url(${ item.imageUrl })` }" @click="goProductDetail(item)"></div>
              <div class="card-body">
                <div class="text-dark text-center mousePointer" style="height: 42px" @click="goProductDetail(item)">
                  <span class="badge badge-pill ml-2 text-white bg-danger" v-if="item.stock < 5">熱銷</span>
                  {{ item.title }}
                </div>
                <div class="text-center mb-2">
                  <div class="d-inline" v-if="!item.price">{{ item.origin_price | currency }}</div>
                  <del class="d-inline" v-if="item.price">{{ item.origin_price | currency}}</del>
                  <div class="d-inline ml-2" :class="{ 'text-danger': item.origin_price }" v-if="item.price">NT{{ item.price | currency}}</div>
                </div>
                <div class="text-center">
                  <button type="button" class="btn btn-outline-danger btn-sm col-6" v-if="item.stock != 0" @click.prevent="addCartToLS(item)">
                    <i class="fas fa-spinner fa-pulse" v-if="status.cartId == item.id"></i>
                    <i class="fas fa-cart-plus" v-if="status.cartId != item.id"></i>
                  </button>
                  <button type="button" class="btn btn-outline-danger btn-sm col-6" v-if="item.stock == 0">
                    已售完
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 text-center text-lativbg" v-if="products.length > productsInfiniteScrollCount">
            <i class="fas fa-chevron-down fa-2x arrow-animate"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery' // Import js file

export default {
  components: {

  },
  data () {
    return {
      products: [],
      productsInfiniteScrollCount: 4,
      productsOriginal: [],
      productsGetCategory: [],
      currentPath: {},
      isLoading: false,
      status: {
        loading: false,
        cartId: ''
      },
      cartArrayToLS: []
    }
  },
  methods: {
    getProducts () {
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`
      // vm.$store.state.isLoading = true
      // vm.$store.dispatch('updateLoading', true)
      vm.isLoading = true
      vm.$http.get(api).then((response) => {
        console.log('getProducts', response.data)
        vm.productsOriginal = response.data.products
        // vm.$store.state.isLoading = false
        // vm.$store.dispatch('updateLoading', false)
        vm.isLoading = false
      }).then(() => {
        vm.getCategory()
      }).then(() => {
        if (vm.products.length > vm.productsInfiniteScrollCount) {
          window.addEventListener('scroll', vm.debounce(vm.scrollToLoading, 300))
        } else {
          console.log('stop scroll', vm.products.length, vm.productsInfiniteScrollCount)
        }
      })
    },
    getCategory () {
      const vm = this
      let array = []
      let value = ''
      if (vm.currentPath.name !== 'Search') {
        value = vm.currentPath.params.productCategory
        array = vm.productsOriginal.filter((element) => {
          return (element.category === value) && (element.is_enabled === 1)
        })
      } else {
        value = vm.currentPath.params.searchStr
        array = vm.productsOriginal.filter((element) => {
          return ((element.title.indexOf(value) !== -1) || (element.category === value) || (element.type.indexOf(value) !== -1) || (element.series.indexOf(value) !== -1)) && (element.is_enabled === 1)
        })
      }
      vm.productsGetCategory = Object.assign([], array)
      vm.products = vm.productsGetCategory
    },
    getSeries (item) {
      const vm = this
      vm.productsInfiniteScrollCount = 4
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      let array = vm.productsGetCategory.filter((element) => {
        if (element.series === item) {
          return true
        }
      })
      vm.products = array
      console.log(vm.products, array, vm.productsGetCategory)
    },
    filterSideBtn (value) {
      const vm = this
      if (vm.currentPath.name !== 'Search') {
        const set = new Set()
        let array = vm.productsGetCategory.filter((element) => {
          if (element[value]) {
            return !set.has(element[value]) ? set.add(element[value]) : false
          }
        })
        return array
      }
    },
    addCartToLS (item, qty = 1) {
      const vm = this
      // vm.status.cartId = item.id;
      if (localStorage.getItem('Cart')) {
        vm.cartArrayToLS = JSON.parse(localStorage.getItem('Cart'))
      }
      let hadProduct = true
      const timestamp = Math.floor(Date.now())
      const cart = {
        product: item,
        qty,
        timestamp
      }
      vm.cartArrayToLS.filter((element) => {
        console.log('element', element, 'element.id', element.product.id, 'item', item.id)
        if (element.product.id === item.id) {
          hadProduct = false
          return hadProduct
        }
      })
      console.log('hadProduct', hadProduct)
      if (hadProduct) {
        vm.cartArrayToLS.push(cart)
        localStorage.setItem('Cart', JSON.stringify(vm.cartArrayToLS))
        vm.$bus.$emit('getCartLS:push')
        vm.$bus.$emit('cartStatus:push', 1)// 讓Search Input判斷是否位移
        vm.$bus.$emit('message:push', `已加入購物車`, 'success')
        hadProduct = false
        vm.status.cartId = ''
      } else {
        vm.$bus.$emit('message:push', `購物車內已有此商品`, 'warning')
        vm.status.cartId = ''
      }
    },
    async goProductDetail (item) {
      const vm = this
      this.loading = true
      vm.$router.push(`/product-detail/${item.id}`)
      this.loading = false
    },
    scrollToLoading () {
      const vm = this
      const scrollTop = $(window).scrollTop()
      // const bodyHeight = $('body').height()
      // const windowHeight = $(window).height()
      const height = $('body').height() - $(window).height()
      if ((scrollTop + 100) > height) {
        vm.productsInfiniteScrollCount = vm.productsInfiniteScrollCount + 4
      }
    },
    debounce (func, delay) {
      var timer = null
      return function () {
        var context = this
        var args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
          func.apply(context, args)
        }, delay)
      }
    }
    // throttle(func, threshhold) {
    //   var last, timer;
    //   if (threshhold) threshhold = 250;
    //   return function () {
    //     var context = this
    //     var args = arguments
    //     var now = +new Date()
    //     if (last && now < last + threshhold) {
    //       clearTimeout(timer)
    //       timer = setTimeout(function () {
    //         last = now
    //         func.apply(context, args)
    //       }, threshhold)
    //     } else {
    //       last = now
    //       func.apply(context, args)
    //     }
    //   }
    // }
  },
  watch: {
    '$route' (a, b) {
      const vm = this
      vm.isLoading = true
      // vm.$store.state.isLoading = true
      vm.currentPath = vm.$route
      vm.productsInfiniteScrollCount = 4
      vm.getCategory()
      vm.isLoading = false
      // vm.$store.state.isLoading = false
    }
  },
  computed: {
    getTypeItem () {
      return this.filterSideBtn('type')
    },
    getSeriesItem () {
      return this.filterSideBtn('series')
    },
    productsInfiniteScroll () {
      const vm = this
      const array = Object.assign([], vm.products)
      return array.splice(0, vm.productsInfiniteScrollCount)
    }
  },
  created () {
    this.currentPath = this.$route
    this.getProducts()
  },
  mounted () {
    const vm = this
    $('#inputGroupSelect01').change(() => {
      let value = $('select option:selected').children('a').contents()[0].nodeValue
      vm.getSeries(value)
    })
  }
}
</script>
<style scoped src="@/assets/css/ProductCategory.css">

</style>
