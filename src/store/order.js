import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    carts: {},
    coupon: '',
    coupon_is_enabled: '',
    status: {
      itemId: '',
      // cartId: '',
      loading: ''
    }
    // form: {
    //   user: {
    //     name: '',
    //     email: '',
    //     tel: '',
    //     address: '',
    //     payment_method: ''
    //   },
    //   message: '',
    //   cartArrayToLS: []
    // }
  },
  actions: {// 勿直接操作資料狀態
    getCart (context) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      context.commit('LOADING', true, { root: true })
      axios.get(api).then((response) => {
        console.log('getCart', response.data.data)
        context.commit('GETCART', response.data.data)
        context.commit('LOADING', false, { root: true })
      })
    },
    removeCartItem (context, item) {
      console.log(item)
      const id = item.id
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`
      context.commit('REMOVECARTITEM', item)
      console.log('item.id', item.id)
      axios.delete(api).then((response) => {
        console.log(response.data, item)
        if (response.data.success) {
          this._vm.$bus.$emit('message:push', `${response.data.message} ${item.product.title} 商品`, 'success')
        } else {
          this._vm.$bus.$emit('message:push', response.data.message, 'danger')
        }
        context.dispatch('getCart')
        context.commit('REMOVECARTITEM', '')
      })
    },
    removeAllCartItem (context) {
      // console.log(this._vm['orderModules/carts'].carts)
      context.commit('LOADING', true, { root: true })
      this._vm['orderModules/carts'].carts.forEach((element) => {
        let id = element.id
        let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`
        axios.delete(api).then((response) => {
          console.log(response.data)
          if (response.data.success) {
            console.log('Cart已全刪除')
          } else {
            console.log('Cart全刪除失敗')
          }
        })
        context.commit('LOADING', false, { root: true })
      })
    },
    addCouponCode (context) { // dqgpmm
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`
      const coupon = {
        code: this._vm['orderModules/coupon']
      }
      console.log(coupon, this._vm)
      context.commit('ADDCOUPONCODE1', 'couponLoading')
      axios.post(api, { data: coupon }).then((response) => {
        console.log('套用優惠券', response.data)
        if (!response.data.success) {
          context.commit('ADDCOUPONCODE2', false)
          this._vm.$bus.$emit('message:push', response.data.message, 'danger')
        } else {
          context.commit('ADDCOUPONCODE2', false)
          this._vm.$bus.$emit('message:push', response.data.message, 'success')
        }
        context.dispatch('getCart')
        context.commit('ADDCOUPONCODE1', '')
      })
    }
    // creatOrder (context, isValid) {
    //   console.log(isValid, this._vm['orderModules/form'])
    //   // const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`
    //   // const orderInfo = this._vm.form
    //   // // vm.status.loading = 'orderLoading'
    //   // context.commit('ADDCOUPONCODE1', 'orderLoading')
    //   // if (!isValid) {
    //   //   this._vm.$bus.$emit('message:push', '表單填寫不完整', 'danger')
    //   //   // vm.status.loading = ''
    //   //   context.commit('ADDCOUPONCODE1', '')
    //   // } else {
    //   //   // 上傳訂單
    //   //   axios.post(api, { data: orderInfo }).then((response) => {
    //   //     console.log('訂單完成', response)
    //   //     if (response.data.success) {
    //   //       this._vm.updateStock() // 更新庫存數量
    //   //       this._vm.$router.push(`/order-check/${response.data.orderId}`)
    //   //     } else {
    //   //       this._vm.$bus.$emit('message:push', response.data.message, 'danger')
    //   //     }
    //   //     // this.getCart();
    //   //     // vm.status.loading = ''
    //   //   })
    //   // }
    // }
  },
  mutations: {// 勿寫入非同步程式
    GETCART (state, status) {
      state.carts = status
    },
    REMOVECARTITEM (state, status) {
      state.status.itemId = status.id
    },
    ADDCOUPONCODE1 (state, status) {
      state.status.loading = status
    },
    ADDCOUPONCODE2 (state, status) {
      state.coupon_is_enabled = status
      // this._vm.$set(state, 'coupon_is_enabled', status)
    },
    ADDCOUPONCODE3 (state, status) {
      state.coupon = status
      // this._vm.$set(state, 'coupon', status)
    },
    CREATORDER_EMAIL (state, status) {
      state.form.user.email = status
    }
  },
  getters: {
    carts (state) {
      return state.carts
    },
    status (state) {
      return state.status
    },
    coupon (state) {
      return state.coupon
    },
    coupon_is_enabled (state) {
      return state.coupon_is_enabled
    }
    // form (state) {
    //   return state.form
    // }
  }
}
