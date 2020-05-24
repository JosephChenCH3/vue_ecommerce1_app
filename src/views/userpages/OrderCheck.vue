<template>
  <div>
    <!-- <loading :active.sync="isLoading"></loading> -->
    <div class="my-5 row justify-content-center">
      <form class="col-lg-6" @submit.once.prevent="payOrder" v-if="order.products != null">
        <table class="table">
          <thead>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in order.products" :key="item.id">
              <td class="align-middle">{{ item.product.title }}</td>
              <td class="align-middle">{{ item.qty }} / 件</td>
              <td class="align-middle text-right">{{ item.final_total | currency }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-right">總計</td>
              <td class="text-right">{{ order.total | currency }}</td>
            </tr>
          </tfoot>
        </table>
        <table class="table">
          <tbody>
            <tr>
              <th width="100">Email</th>
              <td>{{ order.user.email }}</td>
            </tr>
            <tr>
              <th>姓名</th>
              <td>{{ order.user.name }}</td>
            </tr>
            <tr>
              <th>收件人電話</th>
              <td>{{ order.user.tel }}</td>
            </tr>
            <tr>
              <th>收件人地址</th>
              <td>{{ order.user.address }}</td>
            </tr>
            <tr>
              <th>付款狀態</th>
              <td>
                <span v-if="!order.is_paid">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="coupon.code" class="getCoupon h6 my-3 mb-5">
          恭喜您獲得<span class="text-danger">{{coupon.percent}}</span>折優惠代碼<br>請於下次購物時輸入此優惠代碼：
          <span  class="text-primary">{{coupon.code}}</span>，即可享有折扣優惠！
        </div>
        <div class="text-center"><router-link v-if="order.is_paid" to="/">返回首頁 繼續購物</router-link></div>
        <div class="text-right" v-if="order.is_paid === false">
          <button class="btn btn-danger" v-if="status.loading != 'orderLoading'">
            確認付款
          </button>
          <div v-if="status.loading == 'orderLoading'">
            <i class="fas fa-spinner fa-pulse" v-if="status.loading == 'orderLoading'"></i>
            付款中，請勿關閉或離開此頁面
          </div>
        </div>
      </form>
      <div class="h5 col-md-7 mt-5 text-left text-danger" v-if="order.products == null">訂單編號：{{orderId}}不存在</div>
        <div class="col-md-7 text-left" v-if="order.products == null">
          <router-link to="/">返回首頁</router-link>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderId: '',
      order: {
        user: {},
        is_paid: ''
      },
      // isLoading: false,
      status: {
        loading: ''
      },
      coupon: {
        code: '',
        percent: ''
      },
      coupons: [
        { code: 'coxns', percent: 9.9 },
        { code: 'fql5mm', percent: 9.5 },
        { code: 'rgtofr', percent: 9.0 },
        { code: 'z7ucfk', percent: 8.8 },
        { code: 'dqgpmm', percent: 8.5 },
        { code: 'zyv87', percent: 8.0 },
        { code: 'puw3lk', percent: 9.9 },
        { code: 'mu542', percent: 9.9 },
        { code: '0e2ty', percent: 7.5 }
      ]
    }
  },
  methods: {
    getOrder () {
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order/${vm.orderId}`
      // vm.$store.state.isLoading = true
      vm.$store.dispatch('updateLoading', true)
      vm.$http.get(api).then((response) => {
        console.log('getOrder', response.data)
        if (response.data.order != null) {
          vm.order = response.data.order
        } else {
          vm.$bus.$emit('message:push', '此訂單編號不存在，請重新搜尋', 'danger')
        }
        // vm.$store.state.isLoading = false
        vm.$store.dispatch('updateLoading', false)
      })
    },
    payOrder () {
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/pay/${vm.orderId}`
      vm.status.loading = 'orderLoading'
      vm.$http.post(api).then((response) => {
        console.log('getOrder', response.data)
        if (response.data.success) {
          vm.order.is_paid = response.data.is_paid
          vm.$bus.$emit('message:push', response.data.message, 'success')
          const codei = Math.floor(Math.random() * 9)
          vm.coupon.code = vm.coupons[codei].code
          vm.coupon.percent = vm.coupons[codei].percent
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger')
        }
        vm.getOrder()
        vm.status.loading = ''
      })
    }
  },
  created () {
    this.orderId = this.$route.params.userorderId
    this.getOrder()
  },
  beforeRouteLeave (to, from, next) {
    if (this.order.products != null) {
      if (!this.order.is_paid) {
        const answer = confirm(`您尚未結帳完成此筆交易，\n您的訂單編號是：${this.orderId}\n日後可利用上方導航欄之搜尋功能\n選擇搜尋訂單功能並輸入此訂單號碼\n即可取回此筆訂單並完成付款！\n謝謝您的選購！`)
        if (answer) {
          alert(`請記下/複製您的訂單編號：${this.orderId}`)
          next()
        } else {
          next(false)
        }
      } else {
        next()
      }
    } else {
      next()
    }
  }
}
</script>

<style scoped src="@/assets/css/OrderCheck.css">

</style>
