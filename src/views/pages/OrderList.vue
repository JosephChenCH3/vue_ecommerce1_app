<template>
  <div>
    <loading :active.sync="isLoading"></loading>
      <table class="table mt4">
        <thead>
          <td width="130" class="text-center">時間 / 時間</td>
          <td width="250" class="text-center">訂購帳號</td>
          <td class="text-center">品項</td>
          <td width="100">總金額</td>
          <td width="120" class="text-center">付款狀態</td>
          <td width="160" class="text-center">處理狀態</td>
          <td width="100" class="text-center">編輯</td>
        </thead>
        <tbody>
          <tr v-for="item in orderList" :key="item.id">
            <td class="align-middle text-center">
              <div>{{ (new Date(item.create_at * 1000)).toLocaleDateString('zh-TW') }}</div>
              <div>{{ (new Date(item.create_at * 1000)).toLocaleTimeString('zh-TW') }}</div>
            </td>
            <td class="align-middle">{{ item.user.email }}</td>
            <td class="align-middle">
              <div v-for="itempd in item.products" :key="itempd.id">
                {{ itempd.product.title }} / {{ itempd.qty }} 件
              </div>
            </td>
            <td class="align-middle">{{ item.total | currency }}元</td>
            <td v-if="item.is_paid" class="text-success align-middle text-center">已付款</td>
            <td v-else class="text-warning align-middle text-center">未付款</td>
            <td v-if="item.is_process" class="text-success align-middle text-center">已處理寄送</td>
            <td v-else class="text-warning align-middle text-center">尚未處理</td>
            <td class="align-middle text-center">
              <button class="btn btn-secondary btn-sm" @click="openOrderListModal(item)">
                <i class="fas fa-spinner fa-pulse" v-if="status.loading == 'orderListLoading'"></i>
                編輯
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagecomponent :content="pagenation" @getPagenationOut="getOrderList"></Pagecomponent>
      <div class="modal fade" id="orderListModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
              <h5 class="modal-title" id="exampleModalLabel">
                <span>訂單資訊</span>
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h6 class="text-primary">訂單明細</h6>
              <div>訂單編號：{{ editOrderList.id }} </div>
              <div>訂單日期：{{ (new Date(editOrderList.create_at * 1000)).toLocaleDateString('zh-TW') }}
                {{ (new Date(editOrderList.create_at * 1000)).toLocaleTimeString('zh-TW') }}
              </div>
              <div>金   額：{{ editOrderList.total | currency}} 元</div>
              <div class="row col-12  align-middle">
                <div class="align-middle" style="line-height: 24px">處理狀態：</div>
                <div class="custom-control custom-switch">
                  <input class="custom-control-input align-middle" type="checkbox" id="is_process" :true-value="true" :false-value="false" v-model="editOrderList.is_process">
                  <label class="custom-control-label" for="is_process"></label>
                </div>
              </div>
              <hr>
              <h6 class="text-primary">購買明細</h6>
              <div class="container">
                <table class="table">
                  <thead>
                    <tr>
                      <td width="">產品</td>
                      <td width="80px">數量</td>
                      <td width="80px">備註</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in editOrderList.products" :key="item.id">
                      <td>{{ item.product.title }}</td>
                      <td>{{ item.qty }} / 件</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <hr>
              <h6 class="text-primary">付款明細</h6>
              <div v-if="editOrderList.is_paid" class="text-success">付款狀況：已付款</div>
              <div v-else class="text-warning">付款狀況：未付款</div>
              <div v-if="editOrderList.is_paid" class="text-success">
                付款日期：{{ (new Date(editOrderList.paid_date * 1000)).toLocaleDateString('zh-TW') }}
                        {{ (new Date(editOrderList.paid_date * 1000)).toLocaleTimeString('zh-TW') }}
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" class="custom-control-input" id="radio1" v-model="editOrderList.user.payment_method" value="刷卡">
                <label class="custom-control-label align-middle" for="radio1">刷卡</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" class="custom-control-input" id="radio2" v-model="editOrderList.user.payment_method" value="超商取貨">
                <label class="custom-control-label align-middle" for="radio2">超商取貨</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" class="custom-control-input" id="radio3" v-model="editOrderList.user.payment_method" value="貨到付款">
                <label class="custom-control-label align-middle" for="radio3">貨到付款</label>
              </div>
              <div class="row col-12  align-middle">
                <div class="align-middle" style="line-height: 24px">變更付款狀態：</div>
                <div class="custom-control custom-switch">
                  <input class="custom-control-input align-middle" type="checkbox" id="is_paid" :true-value="true" :false-value="false" v-model="editOrderList.is_paid" @change="changePaid">
                  <label class="custom-control-label" for="is_paid"></label>
                </div>
              </div>
              <hr>
              <h6 class="text-primary">訂購人明細</h6>
              <div>{{ editOrderList.user.address }}</div>
              <div>{{ editOrderList.user.email }}</div>
              <div>{{ editOrderList.user.name }}</div>
              <div>{{ editOrderList.user.tel }}</div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click.prevent="resetPaidStatus">取消</button>
              <button type="button" class="btn btn-primary" @click.prevent="updateOrderList">確認</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import $ from 'jquery' // Import js file
import Pagecomponent from '@/components/PageComponent'

export default {
  components: {
    Pagecomponent
  },
  data () {
    return {
      orderList: [],
      pagenation: {},
      isLoading: false,
      editOrderList: {
        create_at: '',
        is_paid: '',
        is_process: '',
        message: '',
        payment_method: '',
        paid_date: '',
        products: [],
        total: '',
        user: {
          address: '',
          email: '',
          name: '',
          tel: ''
        }
      },
      status: {
        loading: ''
      },
      checkPaidDate: '',
      paidStatus: false
    }
  },
  methods: {
    getOrderList (page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${page}`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then((response) => {
        console.log(response.data)
        vm.isLoading = false
        vm.orderList = response.data.orders
        vm.pagenation = response.data.pagination
      })
    },
    openOrderListModal (item) {
      this.status.loading = 'orderListLoading'
      const array = this.orderList.filter(function (element) {
        if (item.id === element.id) {
          return element
        }
      })
      this.editOrderList = array[0]
      console.log('openOrderList', this.editOrderList)
      this.checkPaidDate = this.editOrderList.paid_date
      this.status.loading = ''
      $('#orderListModal').modal('show')
    },
    changePaid () {
      this.paidStatus = !this.paidStatus
      console.log(this.paidStatus)
      if (this.paidStatus) {
        if (!this.editOrderList.is_paid) {
          this.editOrderList.paid_date = ''
        } else {
          this.editOrderList.paid_date = Date.parse(new Date()) / 1000
        }
      } else {
        this.editOrderList.paid_date = this.checkPaidDate
      }
    },
    resetPaidStatus () {
      this.paidStatus = false
      this.getOrderList(this.pagenation.current_page)
    },
    updateOrderList () {
      const id = this.editOrderList.id
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/order/${id}`
      const vm = this
      this.$http.put(api, { data: vm.editOrderList }).then((response) => {
        console.log('updateOrderList', response.data)
        $('#orderListModal').modal('hide')
        this.getOrderList(vm.pagenation.current_page)
      })
    }
  },
  created () {
    this.getOrderList()
  }
}

</script>
