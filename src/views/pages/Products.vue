<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right my-3">
      <button class="btn btn-primary btn-sm" @click="openModal(true)">新增商品</button>
    </div>
    <table class="table mt4">
      <thead>
        <td width="60" class="text-center">num</td>
        <td width="120">大類</td>
        <td width="120">中類</td>
        <td width="120">系列</td>
        <td class="text-center">商品</td>
        <td width="100" class="text-right">原價</td>
        <td width="100" class="text-right">售價</td>
        <td width="100" class="text-center">存量</td>
        <td width="70">狀態</td>
        <td width="120" class="text-center">編輯</td>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td class="align-middle text-center">{{item.num}}</td>
          <td class="align-middle">{{item.category}}</td>
          <td class="align-middle">{{item.type}}</td>
          <td class="align-middle">{{item.series}}</td>
          <td class="align-middle">{{item.title}}</td>
          <td class="align-middle text-right">{{item.origin_price | currency}}</td>
          <td class="align-middle text-right">{{item.price | currency}}</td>
          <td class="align-middle text-center" :class="{'text-danger':item.stock<5}">{{item.stock}}
            <p v-if="item.stock<5">存量不足</p>
          </td>
          <td class="align-middle" v-if="item.is_enabled" :key="item.id">啟用</td>
          <td class="align-middle" v-else>未啟用</td>
          <td class="align-middle">
            <div class="btn-group" role="group" aria-label="Third group">
              <button class="btn btn-success btn-sm" @click="openModal(false, item)">編輯</button>
              <button class="btn btn-outline-warning btn-sm" @click="openDelModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagecomponent :content="pagenation" @getPagenationOut="getProducts"></Pagecomponent>
    <!-- Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                </div>
                <label for="customFile">或 上傳圖片
                  <i class="fas fa-spinner fa-pulse" v-if="status.fileUploading"></i>
                </label>
                <div class="input-group mb-3">
                  <div class="custom-file">
                    <input type="file" class="custom-file-input" id="customFile" ref="files" @change="uploadFile">
                    <label class="custom-file-label" for="customFile">選擇檔案</label>
                  </div>
                </div>
                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80" class="img-fluid" alt="" :src="tempProduct.imageUrl">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">商品名稱</label>
                  <input type="text" class="form-control" id="title" placeholder="請輸入商品名稱" v-model="tempProduct.title">
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">大分類</label>
                    <select class="custom-select" id="category" v-model="tempProduct.category">
                      <option value="women">women</option>
                      <option value="men">men</option>
                      <option value="kids">kids</option>
                      <option value="baby">baby</option>
                      <option value="sports">sports</option>
                    </select>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價" v-model="tempProduct.origin_price">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="type">中分類</label>
                    <input type="text" class="form-control" id="type" placeholder="請輸入分類" v-model="tempProduct.type">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" placeholder="請輸入售價" v-model="tempProduct.price">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="series">小分類</label>
                    <input type="text" class="form-control" id="series" placeholder="請輸入分類" v-model="tempProduct.series">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="stock">庫存</label>
                    <input type="number" class="form-control" id="stock" placeholder="請輸入進貨量" v-model="tempProduct.stock">
                  </div>
                </div>
                <hr>
                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                </div>
                <hr>
                <div class="form-group">
                  <div class="row col-12  align-middle">
                    <div class="align-middle" style="line-height: 24px">產品啟用狀態：</div>
                    <div class="custom-control custom-switch">
                      <input class="custom-control-input align-middle" type="checkbox" id="is_enabled" :true-value="1" :false-value="0" v-model="tempProduct.is_enabled">
                      <label class="custom-control-label" for="is_enabled"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click="clearUploadFileInput">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">
              {{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="delProduct()">確認刪除</button>
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
      products: [],
      tempProduct: {},
      pagenation: {},
      isNew: false,
      delId: '',
      isLoading: false,
      status: {
        fileUploading: false
      }
    }
  },
  methods: {
    getProducts (page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`
      const vm = this
      // console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH);
      vm.isLoading = true
      this.$http.get(api).then((response) => {
        console.log('getProducts', response.data)
        vm.isLoading = false
        vm.products = response.data.products
        vm.pagenation = response.data.pagination
      })
    },
    openModal (isNew, item) {
      if (isNew) {
        this.tempProduct = {}
        this.isNew = true
      } else {
        this.tempProduct = Object.assign({}, item)
        this.isNew = false
      }
      $('#productModal').modal('show')
    },
    updateProduct () {
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`
      let httpMethod = 'post'
      const vm = this
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`
        httpMethod = 'put'
      }
      this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
        if (response.data.success) {
          $('#productModal').modal('hide')
          // vm.getProducts(vm.pagenation.current_page);
        } else {
          console.log('新增失敗')
          $('#productModal').modal('hide')
          // vm.getProducts(vm.pagenation.current_page);
        }
        vm.getProducts(vm.pagenation.current_page)
      })
      vm.clearUploadFileInput()
    },
    openDelModal (item) {
      this.tempProduct = Object.assign({}, item)
      this.delId = item.id
      $('#delProductModal').modal('show')
    },
    delProduct () {
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.delId}`
      this.$http.delete(api).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success')
          $('#delProductModal').modal('hide')
          // vm.getProducts(vm.pagenation.current_page);
          // vm.delId = "";
        } else {
          console.log('找不到該產品')
          vm.$bus.$emit('message:push', response.data.message, 'danger')
          $('#delProductModal').modal('hide')
          // vm.getProducts(vm.pagenation.current_page);
          // vm.delId = "";
        }
        vm.getProducts(vm.pagenation.current_page)
        vm.delId = ''
      })
    },
    uploadFile () {
      console.log(this)
      const vm = this
      const uploadedFile = this.$refs.files.files[0]
      const formData = new FormData()
      formData.append('file-to-upload', uploadedFile)
      vm.status.fileUploading = true
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`
      this.$http.post(url, formData, {
        headers: {
          'Content-type': 'multipart/form-data'
        }
      }).then((response) => {
        console.log('uploadFile', response.data)
        vm.status.fileUploading = false
        if (response.data.success) {
          // vm.tempProduct.imageUrl = response.data.imageUrl;//此二行無效,imageUrl未雙向綁定
          // console.log(vm.tempProduct);//此二行無效,imageUrl未雙向綁定
          vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl)
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger')
        }
      })
    },
    clearUploadFileInput () {
      const xCustomFile = document.getElementById('customFile')
      xCustomFile.value = ''
    }
  },
  created () {
    this.getProducts()
  }
}

</script>
