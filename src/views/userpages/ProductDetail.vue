<template>
  <div>
    <!-- <loading :active.sync="isLoading"></loading> -->
      <div class="row">
        <div class="col-md-8 col-sm-12" style="height: 910px; background-size: cover; background-position: center" :style="{ backgroundImage: `url(${ product.imageUrl })` }">
        </div>
        <div class="col-md-4 col-sm-12 ml-auto">
          <h4>{{ product.title }}</h4>
          <span class="badge badge-pill ml-2 mousePointer" style="background-color: #C1EFFF;" @click="badgeSearch">{{ product.category }}</span>
          <span class="badge badge-pill ml-2 mousePointer" style="background-color: #C1FFE9;" @click="badgeSearch">{{ product.type }}</span>
          <span class="badge badge-pill ml-2 mousePointer" style="background-color: #FFF8C1;" @click="badgeSearch">{{ product.series }}</span>
          <div class="h5 text-right" v-if="product.origin_price">
            <del>{{ product.origin_price * quantity }} 元</del>
          </div>
          <div class="h2 text-danger text-right">{{ product.price * quantity | currency}} 元</div>
          <hr>
          <div class="text-left text-l">購買數量</div>
          <div class="h6 text-right" v-if="product.stock > 5">庫存：{{ product.stock }} 件</div>
          <div class="h6 text-right text-danger" v-if="product.stock < 5">只剩最後 {{ product.stock }} 件</div>
          <div class="h6 text-right text-danger" v-if="product.stock == 0">補貨中</div>
          <select name="" class="form-control mt-3" v-model="quantity" v-if="product.stock != 0">
            <option v-for="num in Number(product.stock)" :value="num" :key="num">
              {{num}}
            </option>
          </select>
          <hr>
          <button type="button" class="btn btn-danger btn-sm col-12" v-if="product.stock != 0" @click.stop="addCartToLS(product, quantity)">
            <i class="fas fa-spinner fa-pulse" v-if="status.cartId == product.id"></i>
            <i class="fas fa-cart-plus" v-if="status.cartId != product.id"></i>
          </button>
          <div class="mt-2 text-right mousePointer" v-if="product.stock != 0" @click="goBack(product)">返回前頁</div>
          <button type="button" class="btn btn-danger btn-sm col-12" v-if="product.stock == 0" @click="goBack(product)">
            <i class="fas fa-spinner fa-pulse" v-if="status.cartId == product.id"></i>
            <i class="fas fa-backspace" v-if="status.cartId != product.id"></i>
              返回前頁
          </button>
          <hr class="mt-5">
          <div>
            <h6 class="light600">產地及材質</h6>
            <ul class="light700">
              <li>產地：中國</li>
              <li>表布：聚醯胺纖維100%</li>
              <li>裡布：聚醯胺纖維100%</li>
              <li>填充物：羽絨90%、羽毛10%</li>
            </ul>
           <h6 class="light600">注意事項及洗滌方式</h6>
            <ol class="light700">
              <li>深淺色請分開洗滌。</li>
              <li>請拉上拉鍊後放入細網洗衣袋中清洗，以保持商品型態。</li>
              <li>洗滌時，水溫請低於30℃；請使用中性洗劑；浸泡時間不宜過長。</li>
              <li>請勿使用漂白劑、螢光增白劑及衣物柔軟劑，以免破壞布料。</li>
              <li>不可濕放，清洗後請快速調整商品型態，並吊掛陰乾即可，勿直接曝曬於陽光下。</li>
              <li>本商品因採用輕柔面料，可能會因靜電或摩擦引起鑽絨，敬請諒解。</li>
            </ol>
            <p class="light600">※因拍攝燈光效果可能造成色差，請以實品顏色為準。</p>
          </div>
        </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      productId: '',
      product: {
        stock: ''
      },
      quantity: 1,
      // isLoading: false,
      status: {
        loading: false,
        cartId: ''
      },
      cartArrayToLS: []
    }
  },
  methods: {
    getProduct () {
      const id = this.productId
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`
      const vm = this
      // vm.$store.state.isLoading = true
      vm.$store.dispatch('updateLoading', true)
      vm.$http.get(api).then((response) => {
        console.log('getProduct', response.data)
        // vm.$store.state.isLoading = false
        vm.$store.dispatch('updateLoading', false)
        vm.product = response.data.product
      })
    },
    addCartToLS (item, qty = 1) {
      const vm = this
      vm.status.cartId = item.id
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
    badgeSearch (e) {
      let str = e.target.firstChild.nodeValue
      this.$router.push(`/search/${str}`)
    },
    goBack (item) {
      this.status.cartId = item.id
      this.$router.go(-1)
      this.status.cartId = ''
    }
  },
  created () {
    this.productId = this.$route.params.productId
    this.getProduct()
  },
  beforeCreate () {
    console.log('beforeCreate', this.$route.params.productCategory)
  }
}
</script>
