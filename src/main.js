import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay'// Import stylesheet
// ---vee-validate---
import { extend, localize } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import zhTW from 'vee-validate/dist/locale/zh_TW.json'
// ---vee-validate---
import 'bootstrap' // Import js file
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import css file
import 'vue-loading-overlay/dist/vue-loading.css'// Init plugin

import App from './App.vue'
import router from './router'
import CurrencyFilter from './filter/CurrencyFilter'
import './bus'
import './registerServiceWorker'
import store from './store/store'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
// Vue.use(Loading);
Vue.component('Loading', Loading)
Vue.filter('currency', CurrencyFilter)

axios.defaults.withCredentials = true // cookie存入驗證碼用

// ---vee-validate---
extend('required', required)
extend('email', email)
// extend('required', {
//   ...required,
//   message: '請填寫此欄位',
// });
// extend('email', {
//   ...email,
//   message: '請填入正確 {_field_} 格式',
// });
localize({
  en: {
    messages: zhTW.messages
  }
})

// ---vee-validate---

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  console.log('next', next)
  if (to.meta.requiresAuth) {
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check`
    axios.post(api).then((response) => {
      console.log(response)
      if (response.data.success) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})
