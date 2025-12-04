<template>
  <div class="relative text-center min-h-142px w-full px-30px group">
    <swiper
      :modules="[Navigation]"
      :navigation="{enabled: true, prevEl: '.kk-swiper-button-prev', nextEl: '.kk-swiper-button-next'}"
      :slides-per-view="slidesPerView"
      :space-between="spaceBetween"
    >
      <swiper-slide class="kk-swiper-item cursor-pointer" v-for="(game, index) in gameList" :key="index+'game'">
        <slot :item="game" :index="index" />
      </swiper-slide>
    </swiper>
    <div class="kk-swiper-button-prev hidden group-hover:flex cursor-pointer">
      <el-icon class="cursor-pointer"><ArrowLeft /></el-icon>
    </div>
    <div class="kk-swiper-button-next hidden group-hover:flex cursor-pointer">
      <el-icon class="cursor-pointer"><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';

defineOptions({
  name: "KKCustomSwiper",
});

defineProps({
  slidesPerView: {
    type: Number,
    default: 4,
  },
  spaceBetween: {
    type: Number,
    default: 10,
  },
  gameList: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  }
})
</script>

<style lang="scss" scoped>
.kk-swiper-button-next,
.kk-swiper-button-prev {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  background: #c2c2c266;
  color: #ffffff;
  background-size: contain;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 30px;
  z-index: 2;
}
.kk-swiper-button-next {
  left: auto;
  right: 0;
}
</style>
