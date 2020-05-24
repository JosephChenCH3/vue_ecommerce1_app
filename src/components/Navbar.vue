<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
      <!--          <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"> -->
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap mr-3">
          <a class="nav-link" href="#" @click.prevent="signout">
            登出
            <i class="fas fa-sign-out-alt"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
// import $ from 'jquery' // Import js file

export default {
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    signout () {
      const api = `${process.env.VUE_APP_APIPATH}/logout`
      const vm = this
      vm.isLoading = false
      this.$http.post(api).then((response) => {
        console.log(response)
        if (response.data.success) {
          vm.$router.push('/login')
          vm.$bus.$emit('message:push', response.data.message, 'success')
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger')
        }
        vm.isLoading = false
      })
    }
  },
  created () {

  }
}

</script>
