<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <Alert></Alert>
    <form class="form-signin" @submit.prevent="signin">
          <div class="form-label-group">
            <input type="email" id="inputEmail" class="form-control" v-model="user.username" placeholder="Email address" required autofocus>
            <label for="inputEmail">Email address</label>
          </div>
            <div class="form-label-group">
              <input type="password" id="inputPassword" class="form-control" v-model="user.password" placeholder="Password" required>
              <label for="inputPassword">Password</label>
            </div>
          <div class="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"> Remember me
            </label>
          </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    </form>
  </div>
</template>
<script>
import Alert from '@/components/AlertMessage'

export default {
  components: {
    Alert
  },
  data () {
    return {
      user:
        {
          username: '',
          password: ''
        },
      isLoading: false
    }
  },
  methods: {
    signin () {
      const api = `${process.env.VUE_APP_APIPATH}/admin/signin`
      // const api = 'https://vue-course-api.hexschool.io/admin/signin';
      // 'https://vue-course-api.hexschool.io/api/joseph/products';
      const vm = this
      vm.isLoading = true
      this.$http.post(api, vm.user).then((response) => {
        console.log(response.data)
        if (response.data.success) {
          vm.isLoading = false
          vm.$router.push('/admin/products')
        } else {
          vm.isLoading = false
          alert(response.data.error.message)
        }
      })
    }
  }
}
</script>
<style scoped src="@/assets/css/Login.css">

</style>
