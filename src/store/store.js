import Vue from 'vue'
import Vuex from 'vuex'
import orderModules from './order.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false
  },
  actions: {// 勿直接操作資料狀態
    updateLoading (context, status) {
      context.commit('LOADING', status)
    }
  },
  mutations: {// 勿寫入非同步程式
    LOADING (state, status) {
      state.isLoading = status
    }
  },
  modules: {
    orderModules
  }
})
