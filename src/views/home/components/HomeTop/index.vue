<template>
  <div class="home-top-container flex">
    <div class="absolute top-0 left-0 w-full h-full mr-4 flex">
      <div
        class="home-banner-container relative text-center h-full overflow-hidden rounded-4 group mr-4"
      >
        <swiper
          :modules="[Navigation]"
          :initialSlide="currentIndex"
          :navigation="{
            enabled: true,
            prevEl: '.kk-swiper-button-prev',
            nextEl: '.kk-swiper-button-next',
          }"
          :slides-per-view="1"
          :loop="true"
          :space-between="10"
          class="h-full"
        >
          <swiper-slide
            class="kk-swiper-item cursor-pointer h-full"
            v-for="(img, index) in banners"
            :key="index + 'live'"
            @click="onSelect(index)"
          >
            <div class="w-full h-full relative">
              <img
                class="active-logo absolute top-0 left-0 w-full h-full object-cover"
                :src="img"
                alt=""
              />
              <div class="relative flex flex-col h-full w-full p-35px">
                <p class="font-800 text-8 color-#ffffff text-left leading-38px">玩游戏<br>获得 +500%<br>存款奖金</p>
                <div class="mt-auto text-left w-max">
                  <div class="cursor-pointer flex-center h-11 px-8 font-600 text-16px min-w-174px bg-white color-#090f1e rounded-2 whitespace-nowrap">
                    <span>play</span>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="absolute bottom-0 right-0 w-150px h-22 flex-center hidden group-hover:flex z-11">
          <div class="flex-center gap-2 bg-[#ffffff4d] rounded-2 p-2 color-#ffffff">
            <div class="kk-swiper-button-prev cursor-pointer flex-center w-35px h-35px rounded-2 bg-[#ffffff4d]">
              <el-icon class="cursor-pointer"><ArrowLeftBold /></el-icon>
            </div>
            <div class="kk-swiper-button-next flex-center cursor-pointer w-35px h-35px rounded-2 bg-[#ffffff4d]">
              <el-icon class="cursor-pointer"><ArrowRightBold /></el-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="top-b-1 h-full gap-2 mr-4 flex-1 rounded-5 overflow-hidden">
        <div class="w-full h-full flex flex-col p-7">
          <p class="top-b-text">赌场现金回扣高达 30%</p>
          <div class="mt-auto cursor-pointer flex-center h-11 px-8 font-600 text-16px min-w-174px bg-white color-#090f1e rounded-2 whitespace-nowrap">
            <span>前往赌场</span>
          </div>
        </div>
      </div>
      <div class="top-b-2 h-full gap-2 mr-4 flex-1 rounded-5 overflow-hidden">
        <div class="w-full h-full flex flex-col p-7">
          <p class="top-b-text">奖金 + 500%</p>
          <div class="mt-auto cursor-pointer flex-center h-11 px-8 font-600 text-16px min-w-174px bg-white color-#090f1e rounded-2 whitespace-nowrap">
            <span>去充值</span>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";

defineOptions({
  name: "KKHomeSwiper",
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
  },
});

const appStore = useAppStore();

const banners = ref<string[]>([]);
const currentIndex = ref(0);

const onSelect = (index: number) => {
  console.log(index);
};

function initBanner() {
  appStore.getAppBanners().then((res) => {
    banners.value = res;
  });
}

onBeforeMount(() => {
  initBanner();
});
</script>

<style lang="scss" scoped>
.home-top-container {
  --home__header-carousel-width: 840;
  --home__header-carousel-height: 320;
  --home__header-base-width: 1410;
  margin-bottom: 15px;
  padding-bottom: calc(100% / (var(--home__header-base-width) / var(--home__header-carousel-height)));
  position: relative;
}

.home-banner-container {
  // width: calc(
  //   var(--home__header-carousel-width) / (var(--home__header-base-width) / 100) *
  //     1%
  // );
  width: 100%;
}

.kk-swiper-button-next,
.kk-swiper-button-prev {
}
.top-b-1 {
  background-image: url('@/assets/custom-images/banner/cashback.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.top-b-text {
  @apply  w-full text-30px color-#ffffff leading-106% font-800 max-w-full whitespace-pre-line;
text-shadow: 0 3px 5px rgba(9, 15, 30, .2);
}
.top-b-2 {
  background-image: url('@/assets/custom-images/banner/bonus.avif');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
