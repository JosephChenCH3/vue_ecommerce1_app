<template>
  <div>
    <div class="input-group input-group-sm">
      <input type="search" class="form-control input-width d-inline" placeholder="Search" aria-label="Search" v-model="searchValue" @keyup.enter="searchProduct">
      <div class="input-group-append d-inline">
        <button type="button" class="btn btn-sm btn-outline-secondary" style="width: 36px;" v-if="searchStatus == 'product'" @click="searchProduct">
          <i class="fas fa-search fa-lg"></i>
        </button>
        <button type="button" class="btn btn-sm btn-outline-secondary" style="width: 36px;" v-if="searchStatus == 'orderNum'" @click="searchProduct">
          <i class="fas fa-search fa-lg"></i>
        </button>
        <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu dropdown-menu-right dropdown-search-menu">
          <a class="dropdown-item dropdown-search-item text-center" href="#" @click.prevent="searchStatus='product'">搜尋產品</a>
          <a class="dropdown-item dropdown-search-item text-center" href="#" @click.prevent="searchStatus='orderNum'">搜尋訂單</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      searchValue: '',
      searchStatus: 'product'
    }
  },
  methods: {
    searchProduct () {
      const str = this.searchValue
      console.log(str)
      if (str.trim() === '') {
        if (this.searchStatus === 'product') {
          this.$bus.$emit('message:push', `請輸入商品名稱`, 'danger')
        } else {
          this.$bus.$emit('message:push', `請輸入訂單編號`, 'danger')
        }
        return
      }
      if (this.searchStatus === 'product') {
        this.$router.push(`/search/${this.searchValue}`)
      } else if (this.searchStatus === 'orderNum') {
        this.$router.push(`/order-check/${this.searchValue}`)
      }
      console.log('searchValue', this.searchValue, this.searchStatus)
      this.searchValue = ''
    }
  }
}

</script>
<style scoped src="../assets/css/SearchInput.css">
</style>
