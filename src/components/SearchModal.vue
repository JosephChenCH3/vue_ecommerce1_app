<template>
  <div>
    <!-- <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="card">
          <div>
            <select class="custom-select" id="inputGroupSelect01" @change="selectStatus" v-model="searchStatus">
              <option selected>請選擇</option>
              <option value="product">搜尋產品</option>
              <option value="orderNum">搜尋訂單</option>
            </select>
            <div class="input-group">
              <input type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="請輸入" v-model="searchValue" @keyup.enter="searchProduct">
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="searchProduct">搜尋</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="search-bg" @click.self="closeSearch" :class="{showSearchBg: searchStyleProps}">
      <div class="search-box" :class="{showSearchBox: searchStyleProps}">
        <div class="close-btn">
          <i class="fas fa-times" @click="closeSearch"></i>
        </div>
        <select class="custom-select" id="inputGroupSelect01" v-model="searchStatus">
          <option selected>請選擇</option>
          <option value="product">搜尋產品</option>
          <option value="orderNum">搜尋訂單</option>
        </select>
        <div class="input-group">
          <input type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="請輸入" v-model="searchValue" @keyup.enter="searchProduct">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="searchProduct">搜尋</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchStyleProps: {
      type: Boolean,
      deafult: false
    }
  },
  data () {
    return {
      searchValue: '',
      searchStatus: 'product'
    }
  },
  methods: {
    // selectStatus () {
    //   console.log(this.searchStatus)
    // },
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
      this.$emit('closeSearch')
    },
    closeSearch () {
      console.log('close1')
      this.$emit('closeSearch')
    }
  }
}
</script>

<style scoped lang="scss">
// .card {
//   width: 80%;
//   height: 200px;
//   position: absolute;
//   top: 20%;
//   left: 10%;
//   background: white \9;
//   filter: alpha(opacity=90) \9;
//   background-color: rgba(255, 255, 255, .9);
  .search-bg {
    position: fixed;
    z-index: 1900;
    background: white \9;
    filter: alpha(opacity=0) \9;
    background-color: rgba(0, 0, 0, 0);
    transition: all 0.5s ease-in-out;
  }

  .showSearchBg {
    width: 100%;
    height: 100%;
    background: white \9;
    filter: alpha(opacity=60) \9;
    background-color: rgba(0, 0, 0, .6);
  }

  .search-box {
    position: fixed;
    z-index: 2000;
    top: -200px;
    background-color: #ffffff;
    border-radius: 5px;
    left: calc(50% - 138px);
    transition: all 0.5s cubic-bezier(1, 0.08, 0, 1);
  }

  .showSearchBox {
    top: 60px;
  }

  .close-btn {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .custom-select {
    width: 90%;
    height: 38px;
    margin: 10px 5% 0 5%;
    // background: transparent;
  }

  .input-group {
    width: 90% !important;
    margin: 20px 5% 20px 5%;

    .form-control {

    }
    .input-group-append {
      background-color: #ffffff;
    }
  }

  .close {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
  }
// }
</style>
