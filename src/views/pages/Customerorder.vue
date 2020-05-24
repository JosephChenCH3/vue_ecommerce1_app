<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px; background-size: cover; background-position: center" :style="{ backgroundImage: `url(${ item.imageUrl })` }">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <del class="h6" v-if="!item.price">原價 {{ item.origin_price | currency}} 元</del>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price | currency}} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{ item.price | currency}} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="getProduct(item.id)">
              <i class="fas fa-spinner fa-pulse" v-if="item.id===status.itemId"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click.prevent="addCart(item.id)">
              <i class="fas fa-spinner fa-pulse" v-if="item.id===status.cartId"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <Pagecomponent :content="pagenation" @getPagenationOut="getProducts"></Pagecomponent>
    <div class="my-5 container col-6" v-if="carts.total != 0">
      <div class="card border-0 shadow-sm">
        <div class="pt-3" style="height: 25px; background-size: cover; background-position: center">
          <h5 class="text-dark text-center">購物清單</h5>
        </div>
        <div class="card-body">
          <table class="table">
            <thead>
              <td>品名</td>
              <td width="70">數量</td>
              <td width="80">單價</td>
              <td width="80">小計</td>
              <td width="50"></td>
            </thead>
            <tbody>
              <tr v-for="item in carts.carts" :key="item.id">
                <td class="align-middle">
                  {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                </td>
                <td class="align-middle">{{ item.qty }} / 件</td>
                <td class="align-middle">{{ item.product.price | currency }}</td>
                <td class="align-middle">{{ item.product.price * item.qty | currency }}</td>
                <td class="align-middle">
                  <button @click.prevent="removeCartItem(item)" class="btn btn-outline-danger">
                    <i v-if="status.itemId !== item.id" class="far fa-trash-alt"></i>
                    <i v-if="status.itemId === item.id" class="fas fa-spinner fa-pulse"></i>
                  </button>
                </td>
              </tr>
              <tr class="text-primary text-right">
                <td colspan="4" class="align-middle">
                  <h5>總計：{{ carts.total | currency }}元</h5>
                </td>
              </tr>
              <tr class="text-success text-right" v-if="carts.total !== carts.final_total">
                <td colspan="4" class="align-middle">
                  <h5>折扣價：{{ carts.final_total | currency }}元</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="input-group mb-3 col-12">
          <input type="text" class="form-control" placeholder="請輸入優惠代碼" aria-label="" aria-describedby="button-addon2" v-model="coupon">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click.prevent="addCouponCode">
              <i class="fas fa-spinner fa-pulse" v-if="status.loading == 'couponLoading'"></i>
              套用
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="my-5 container col-6">
      <div class="card border-0 shadow-sm bg-light">
        <div class="pt-3" style="height: 25px; background-size: cover; background-position: center">
          <h5 class="text-dark text-center">訂購人資訊</h5>
        </div>
        <!-- vee-validate -->
        <ValidationObserver ref="observer">
          <!-- vee-validate -->
          <form class="mt-5 pb-3 col-md-12" @submit.prevent="creatOrder">
            <!-- vee-validate -->
            <ValidationProvider name="email" rules="required|email">
              <div slot-scope="{ errors }">
                <label for="useremail">Email</label>
                <input class="form-control" v-model="form.user.email" id="useremail" placeholder="請輸入姓名">
                <p class="text-danger">{{ errors[0] }}</p>
              </div>
            </ValidationProvider>
            <ValidationProvider name="收件人姓名" rules="required">
              <div slot-scope="{ errors }">
                <label for="username">收件人姓名</label>
                <input class="form-control" v-model="form.user.name" id="username" placeholder="請輸入姓名">
                <p class="text-danger">{{ errors[0] }}</p>
              </div>
            </ValidationProvider>
            <ValidationProvider name="收件人電話" rules="required">
              <div slot-scope="{ errors }">
                <label for="usertel">收件人電話</label>
                <input class="form-control" v-model="form.user.tel" id="usertel" placeholder="請輸入電話">
                <p class="text-danger">{{ errors[0] }}</p>
              </div>
            </ValidationProvider>
            <ValidationProvider name="收件人地址" rules="required">
              <div slot-scope="{ errors }">
                <label for="useraddress">收件人地址</label>
                <input class="form-control" v-model="form.user.address" id="useraddress" placeholder="請輸入地址">
                <p class="text-danger">{{ errors[0] }}</p>
              </div>
            </ValidationProvider>
            <!-- vee-validate -->
            <div class="form-group">
              <label for="comment">留言</label>
              <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
            </div>
            <hr>
            <ValidationProvider name="付款方式" rules="required">
              <div slot-scope="{ errors }">
                <div>付款方式</div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" class="custom-control-input" id="radio1" v-model="form.user.payment_method" value="刷卡">
                  <label class="custom-control-label align-middle" for="radio1">刷卡</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" class="custom-control-input" id="radio2" v-model="form.user.payment_method" value="超商取貨">
                  <label class="custom-control-label align-middle" for="radio2">超商取貨</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" class="custom-control-input" id="radio3" v-model="form.user.payment_method" value="貨到付款">
                  <label class="custom-control-label align-middle" for="radio3">貨到付款</label>
                </div>
                <p class="text-success">您選擇的付款方式： {{form.user.payment_method}} </p>
                <p class="text-danger">{{ errors[0] }}</p>
              </div>
            </ValidationProvider>
            <div class="text-right">
              <button class="btn btn-danger">
                <i class="fas fa-spinner fa-pulse" v-if="status.loading == 'orderLoading'"></i>
                送出訂單
              </button>
            </div>
          </form>
          <!-- vee-validate -->
        </ValidationObserver>
        <!-- vee-validate -->
      </div>
    </div>
    <!-- modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>{{ product.title }}</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="col-sm-12 ml-auto mr-auto">
              <img alt="" class="img-fluid" :src="product.imageUrl">
              <blockquote class="blockquote mt-3">
                <p class="mb-0">{{ product.content }}</p>
                <footer class="blockquote-footer text-right">{{ product.description }}</footer>
              </blockquote>
              <div class="d-flex justify-content-between align-items-baseline">
                <del class="h4" v-if="!product.price">{{ product.origin_price | currency }}元</del>
                <del class="h6" v-if="product.price">原價{{ product.origin_price | currency }}元</del>
                <div class="h4" v-if="product.price">特價{{ product.price | currency }}元</div>
              </div>
              <select name="" class="form-control mt-3" v-model="quantity">
                <option v-for="num in 10" :value="num" :key="num">
                  選購 {{num}} {{ product.unit }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ quantity * product.price | currency }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary" @click.prevent="addCart(product.id, quantity)">
              <i class="fas fa-spinner fa-pulse" v-if="product.id===status.cartId"></i>
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery' // Import js file
import Pagecomponent from '@/components/PageComponent'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  components: {
    Pagecomponent,
    ValidationProvider, // ---vee-validate---
    ValidationObserver // ---vee-validate---
  },
  data () {
    return {
      products: [],
      quantity: 1,
      product: {},
      pagenation: {},
      isLoading: false,
      status: {
        itemId: '',
        cartId: '',
        loading: ''
      },
      carts: {},
      coupon: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
          payment_method: ''
        },
        message: ''
      }
    }
  },
  methods: {
    getProducts (page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`
      const vm = this
      vm.isLoading = true
      vm.status.fileUploading = true
      this.$http.get(api).then((response) => {
        console.log('getProducts', response.data)
        vm.isLoading = false
        vm.products = response.data.products
        vm.pagenation = response.data.pagination
      })
    },
    getProduct (id) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`
      const vm = this
      vm.status.itemId = id
      this.$http.get(api).then((response) => {
        console.log('getProduct', response.data)
        vm.product = response.data.product
        $('#productModal').modal('show')
        vm.status.itemId = ''
      })
    },
    addCart (id, qty = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      const vm = this
      const cart = {
        product_id: id,
        qty
      }
      console.log('id', id, 'qty', qty)
      vm.status.cartId = id
      this.$http.post(api, { data: cart }).then((response) => {
        console.log('addCart', response.data)
        vm.getCart()
        $('#productModal').modal('hide')
        vm.$bus.$emit('message:push', response.data.message, 'success')
        vm.status.cartId = ''
      })
    },
    getCart () {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      const vm = this
      this.$http.get(api).then((response) => {
        console.log('getCart', response.data.data)
        vm.carts = response.data.data
      })
    },
    removeCartItem (item) {
      const id = item.id
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`
      const vm = this
      vm.status.itemId = item.id
      this.$http.delete(api).then((response) => {
        vm.$bus.$emit('message:push', response.data.message, 'success')
        this.getCart()
        vm.status.itemId = ''
      })
    },
    addCouponCode () {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`
      const vm = this
      const coupon = {
        code: vm.coupon
      }
      vm.status.loading = 'couponLoading'
      this.$http.post(api, { data: coupon }).then((response) => {
        console.log('套用優惠券', response.data)
        if (!response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'danger')
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'success')
        }
        this.getCart()
        vm.status.loading = ''
      })
    },
    async creatOrder () {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`
      const vm = this
      const orderInfo = vm.form
      vm.status.loading = 'orderLoading'
      const isValid = await this.$refs.observer.validate() // ---vee-validate---
      if (!isValid) {
        vm.$bus.$emit('message:push', '表單填寫不完整', 'danger')
        vm.status.loading = ''
      } else {
        this.$http.post(api, { data: orderInfo }).then((response) => {
          console.log('訂單完成', response)
          if (response.data.success) {
            vm.$router.push(`customer-checkout/${response.data.orderId}`)
          } else {
            vm.$bus.$emit('message:push', response.data.message, 'danger')
          }
          this.getCart()
          vm.status.loading = ''
        })
      }
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  }
}

</script>
