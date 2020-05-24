<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled': !content.has_pre }" @click="getProducts(1)">
        <a class="page-link" href="#" aria-label="Previous">
          <i class="fas fa-angle-double-left"></i>
        </a>
      </li>
      <li class="page-item" :class="{'disabled': !content.has_pre }" @click="getProducts(content.current_page - 1)">
        <a class="page-link" href="#" aria-label="Previous">
          <i class="fas fa-angle-left"></i>
        </a>
      </li>
      <li class="page-item" :class="{'active': content.current_page == page }" v-for="page in content.total_pages" :key="page" @click="getProducts(page)" v-show="(page < content.current_page + 3) && (page > content.current_page - 3)">
        <a class="page-link" href="#">{{page}}</a>
      </li>
      <li class="page-item" :class="{'disabled': !content.has_next }" @click="getProducts(content.current_page + 1)">
        <a class="page-link" href="#" aria-label="Next">
          <i class="fas fa-angle-right"></i>
        </a>
      </li>
      <li class="page-item" :class="{'disabled': !content.has_next }" @click="getProducts(content.total_pages)">
        <a class="page-link" href="#" aria-label="Previous">
          <i class="fas fa-angle-double-right"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: ['content'],
  data () {
    return {
      // counter: this.content
    }
  },
  methods: {
    getProducts (item) {
      this.$emit('getPagenationOut', item)
    }
  }
}

</script>
