<template>
  <div>
    <!-- <loading :active.sync="isLoading"></loading> -->
    <div class="my-5 container col-lg-6" v-if="carts.total == 0">
      <div class="h5 text-danger">購物清單中無任何商品</div>
      <router-link to="/">返回首頁</router-link>
    </div>
    <div class="my-5" v-if="carts.total != 0">
      <div class="card border-0 shadow-sm">
        <div class="pt-3" style="height: 25px; background-size: cover; background-position: center">
          <h5 class="text-dark text-center">購物清單</h5>
        </div>
        <div class="card-body">
          <table class="table">
            <thead>
              <td width="110">品名</td>
              <td style="text-align:center">數量</td>
              <td vwidth="50" style="text-align:center">單價</td>
              <td width="55" style="text-align:center">小計</td>
              <td></td>
            </thead>
            <tbody>
              <tr v-for="item in carts.carts" :key="item.id">
                <td class="align-middle">
                  {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                </td>
                <td style="text-align:center" class="align-middle">{{ item.qty }}</td>
                <td style="text-align:right" class="align-middle">{{ item.product.price | currency }}</td>
                <td style="text-align:right" class="align-middle">{{ item.product.price * item.qty | currency }}</td>
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
                <td></td>
              </tr>
              <tr class="text-success text-right" v-if="carts.total !== carts.final_total">
                <td colspan="4" class="align-middle">
                  <h5>折扣價：{{ carts.final_total | currency }}元</h5>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div class="form-group">
            <div class="row col-12  align-middle">
              <div class="align-middle" style="line-height: 24px">使用優惠代碼：</div>
              <div class="custom-control custom-switch">
                <input class="custom-control-input align-middle" type="checkbox" id="is_enabled" :true-value="true" :false-value="false" v-model="message_is_enabled">
                <label class="custom-control-label" for="is_enabled"></label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3 col-12" v-if="coupon_is_enabled">
            <input type="text" class="form-control" placeholder="請輸入優惠代碼" aria-label="" aria-describedby="button-addon2" v-model="message_coupon">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click.prevent="addCouponCode">
                <i class="fas fa-spinner fa-pulse" v-if="status.loading == 'couponLoading'"></i>
                套用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="my-5 container col-lg-6" v-if="carts.total != 0">
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
                <input type="email" class="form-control" v-model="form.user.email" id="useremail" placeholder="請輸入Email">
                <p class="text-danger">{{ errors[0] }}</p>
              </div>
            </ValidationProvider>
            <ValidationProvider name="收件人姓名" rules="required">
              <div slot-scope="{ errors }">
                <label for="username">收件人姓名</label>
                <input type="text" class="form-control" v-model="form.user.name" id="username" placeholder="請輸入姓名">
                <p class="text-danger">{{ errors[0] }}</p>
              </div>
            </ValidationProvider>
            <ValidationProvider name="收件人電話" rules="required">
              <div slot-scope="{ errors }">
                <label for="usertel">收件人電話</label>
                <input type="tel" class="form-control" v-model="form.user.tel" id="usertel" placeholder="請輸入電話">
                <p class="text-danger">{{ errors[0] }}</p>
              </div>
            </ValidationProvider>
            <ValidationProvider name="收件人地址" rules="required">
              <div slot-scope="{ errors }">
                <label for="useraddress">收件人地址</label>
                <input type="text" class="form-control" v-model="form.user.address" id="useraddress" placeholder="請輸入地址">
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
              <button class="btn btn-danger" v-if="status.loading != 'orderLoading'">
                送出訂單
              </button>
              <div v-if="status.loading == 'orderLoading'">
                <i class="fas fa-spinner fa-pulse" v-if="status.loading == 'orderLoading'"></i>
                訂單傳送中
              </div>
            </div>
          </form>
          <!-- vee-validate -->
        </ValidationObserver>
        <!-- vee-validate -->
      </div>
    </div>
  </div>
</template>
<script>
// import $ from 'jquery' // Import js file
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ValidationProvider, // ---vee-validate---
    ValidationObserver // ---vee-validate---
  },
  data () {
    return {
      // isLoading: false,
      // status: {
      //   itemId: '',
      //   cartId: '',
      //   loading: ''
      // },
      // carts: {},
      // coupon: '',
      // coupon_is_enabled: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
          payment_method: ''
        },
        message: '',
        cartArrayToLS: []
      },
      user: {
        username: 'joseph.work01@gmail.com',
        password: 'Jcw0122456'
      }
    }
  },
  methods: {
    // getCart () {
    //   const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
    //   const vm = this
    //   // vm.isLoading = true
    //   // vm.$store.state.isLoading = true
    //   vm.$store.dispatch('updateLoading', true)
    //   vm.$http.get(api).then((response) => {
    //     console.log('getCart', response.data.data)
    //     vm.carts = response.data.data
    //     // vm.isLoading = false
    //     // vm.$store.state.isLoading = false
    //     vm.$store.dispatch('updateLoading', false)
    //   })
    // },
    removeCartItem (item) {
      this.$store.dispatch('orderModules/removeCartItem', item)
      // const vm = this
      // console.log('item', item)
      // const id = item.id
      // const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`
      // const vm = this
      // vm.status.itemId = item.id
      // vm.$http.delete(api).then((response) => {
      //   console.log(response.data, item)
      //   if (response.data.success) {
      //     vm.$bus.$emit('message:push', `${response.data.message} ${item.product.title} 商品`, 'success')
      //   } else {
      //     vm.$bus.$emit('message:push', response.data.message, 'danger')
      //   }
      //   this.getCart()
      //   vm.status.itemId = ''
      // })
    },
    // removeAllCartItem () {
    //   const vm = this
    //   vm.$store.dispatch('updateLoading', true)
    //   vm.carts.carts.forEach((element) => {
    //     let id = element.id
    //     let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`
    //     vm.$http.delete(api).then((response) => {
    //       console.log(response.data)
    //       if (response.data.success) {
    //         console.log('Cart已全刪除')
    //       } else {
    //         console.log('Cart全刪除失敗')
    //       }
    //       vm.$store.dispatch('updateLoading', false)
    //     })
    //   })
    // },
    // addCouponCode () {
    //   this.$store.dispatch('orderModules/addCouponCode')
    //   const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`
    //   const vm = this
    //   const coupon = {
    //     code: vm.coupon
    //   }
    //   vm.status.loading = 'couponLoading'
    //   vm.$http.post(api, { data: coupon }).then((response) => {
    //     console.log('套用優惠券', response.data)
    //     if (!response.data.success) {
    //       vm.coupon_is_enabled = false
    //       vm.$bus.$emit('message:push', response.data.message, 'danger')
    //     } else {
    //       vm.$bus.$emit('message:push', response.data.message, 'success')
    //     }
    //     this.getCart()
    //     vm.status.loading = ''
    //   })
    // },
    async creatOrder () {
      // const isValid = await this.$refs.observer.validate() // ---vee-validate---
      // this.$store.dispatch('orderModules/creatOrder', isValid)
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`
      const vm = this
      const orderInfo = vm.form
      // vm.status.loading = 'orderLoading'
      const isValid = await this.$refs.observer.validate() // ---vee-validate---
      if (!isValid) {
        vm.$bus.$emit('message:push', '表單填寫不完整', 'danger')
        // vm.status.loading = ''
      } else {
        // 上傳訂單
        vm.$http.post(api, { data: orderInfo }).then((response) => {
          console.log('訂單完成', response)
          if (response.data.success) {
            vm.updateStock() // 更新庫存數量
            vm.$router.push(`/order-check/${response.data.orderId}`)
          } else {
            vm.$bus.$emit('message:push', response.data.message, 'danger')
          }
          // this.getCart();
          // vm.status.loading = ''
        })
      }
    },
    updateStock () {
      const vm = this
      // let count = 0
      let newProduct = []
      const apilg = `${process.env.VUE_APP_APIPATH}/admin/signin`
      // vm.$store.state.isLoading = true
      vm.$store.dispatch('updateLoading', true)
      // 登入後台驗證
      vm.$http.post(apilg, vm.user).then((response) => {
        console.log(response.data)
        if (response.data.success) {
          console.log('登入成功')
          vm.carts.carts.forEach((element) => {
            let apiGet = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${element.product_id}`
            // 抓取該ID對應商品
            vm.$http.get(apiGet).then((response) => {
              if (response.data.success) {
                console.log('getProduct', response.data)
                // 計算 庫存-已訂購
                newProduct = response.data.product
                newProduct.stock = element.product.stock - element.qty
                console.log('newProduct', newProduct, 'stock', newProduct.stock)
                let apiPut = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${element.product_id}`
                // 更新商品資訊(包含新庫存量)
                vm.$http.put(apiPut, { data: newProduct }).then((response) => {
                  console.log('putProduct', response.data)
                  if (response.data.success) {
                    console.log('庫存量更新成功')
                    // vm.$store.state.isLoading = false
                    vm.$store.dispatch('updateLoading', false)
                  } else {
                    console.log('庫存量更新錯誤')
                    // vm.$store.state.isLoading = false
                    vm.$store.dispatch('updateLoading', false)
                  }
                })
              } else {
                console.log('產品資料讀入錯誤')
                // vm.$store.state.isLoading = false
                vm.$store.dispatch('updateLoading', false)
              }
            })
          })
        } else {
          console.log('登入失敗', response.data.error.message)
          // vm.isLoading = false
          vm.$store.dispatch('updateLoading', false)
        }
      })
    },
    ...mapActions('orderModules', ['getCart', 'removeAllCartItem', 'addCouponCode'])
  },
  computed: {
    ...mapGetters('orderModules', ['carts', 'status', 'coupon', 'coupon_is_enabled']),
    message_is_enabled: {
      get () {
        return this.$store.state.coupon_is_enabled
      },
      set (value) {
        this.$store.commit('orderModules/ADDCOUPONCODE2', value)
      }
    },
    message_coupon: {
      get () {
        return this.$store.state.coupon
      },
      set (value) {
        this.$store.commit('orderModules/ADDCOUPONCODE3', value)
      }
    }
    // message_email: {
    //   // message_form.user.email
    //   get () {
    //     return this.$store.state.form
    //   },
    //   set (value) {
    //     this.$store.commit('orderModules/CREATORDER_EMAIL', value)
    //     // this.$store.state.coupon = value
    //   }
    // }
  },
  created () {
    this.getCart()
  },
  mounted () {

  },
  beforeDestroy () {

  },
  beforeRouteLeave (to, from, next) {
    if (this.carts.total === 0) {
      next()
    } else if (to.name === 'OrderCheck') {
      next()
    } else {
      const answer = confirm(`訂單尚未建立，\n離開此頁面將遺失商品資訊！`)
      if (answer) {
        this.removeAllCartItem()
        next()
      } else {
        next(false)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
td {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
