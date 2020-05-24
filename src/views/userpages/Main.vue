<template>
  <div>
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img class="d-block w-100" src="@/assets/home/slide01.jpg" alt="First slide">
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="@/assets/home/slide02.jpg" alt="Second slide">
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="@/assets/home/slide03.jpg" alt="Third slide">
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="@/assets/home/slide04.jpg" alt="Third slide">
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="@/assets/home/slide05.jpg" alt="Third slide">
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <i class="fas fa-chevron-circle-left fa-3x"></i>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <i class="fas fa-chevron-circle-right fa-3x"></i>
        <span class="sr-only">Next</span>
      </a>
    </div>
    <div class="row mt-4">
      <div class="card-columns">
        <div class="col indexCard" v-for="(item, i) in indexPromoImg" :key="`${item.value}${i}`">
          <div class="card my-3 mousePointer" @click="goToSearch(item)">
            <img :src="item.imgUrl" class="card-img-top" alt="...">
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="promoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <CouponModal></CouponModal>
    </div>
  </div>
</template>
<script>
import $ from 'jquery' // Import js file
import CouponModal from '@/components/CouponModal'

export default {
  components: {
    CouponModal
  },
  data () {
    return {
      indexPromoImg: [
        { imgUrl: require('@/assets/home/43536_560_191004_TW01.jpg'), searchValue: 'men' },
        { imgUrl: require('@/assets/home/43353_560_191015_TW2_chin.jpg'), searchValue: '運動外套' },
        { imgUrl: require('@/assets/home/FS680_560_191004_TW_1.jpg'), searchValue: 'package' },
        { imgUrl: require('@/assets/home/43455_560_191003_TW03.jpg'), searchValue: 'women' },
        { imgUrl: require('@/assets/home/43377_560_190814_TW_0_chin.jpg'), searchValue: '純棉條紋' },
        { imgUrl: require('@/assets/home/43514_560_191019_TW_chin.jpg'), searchValue: 'baby' },
        { imgUrl: require('@/assets/home/43640_560_191004_TW2.jpg'), searchValue: 'women' },
        { imgUrl: require('@/assets/home/43492_560_191018_TW_chin.jpg'), searchValue: 'kids' },
        { imgUrl: require('@/assets/home/NEWS_560_191003_TW.jpg'), searchValue: 'package' }
      ]
    }
  },
  methods: {
    goToSearch (item) {
      console.log('item', item.searchValue)
      if ('women,men,kids,baby,sports'.indexOf(item.searchValue) !== -1) {
        console.log('item-same', item.searchValue)
        this.$router.push(`/category/${item.searchValue}`)
      } else if (item.searchValue === 'package') {
        this.$router.push(`/page/package`)
      } else {
        this.$router.push(`/search/${item.searchValue}`)
      }
    }
  },
  created () {

  },
  mounted () {
    $('#promoModal').modal('show')
  }
}

</script>
