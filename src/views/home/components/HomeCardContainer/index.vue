<template>
  <div class="card-container">
    <div class="notice-bar"></div>
    <slot name="header"></slot>
    <slot name="content"></slot>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";

defineOptions({
  name: "KKHomeCardContainer",
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
.card-container {
  border-radius: 12px;
  background-image: var(--home-card-bg, linear-gradient(110deg, #1e283f, rgba(20, 27, 46, .6) 100%));
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.notice-bar {
  position: absolute;
  top: 0;
  left: 25px;
  right: 25px;
  height: 4px;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  background-size: 200% auto;
  animation: 4s linear 0s infinite alternate notch-bg-slide;
  will-change: background-position;
  background-image: var(--notice-bar-bg, linear-gradient(90deg, rgb(27, 241, 255) 0%, rgb(8, 85, 196) 100%));
}

@keyframes notch-bg-slide {
  0% {
    background-position: left center;
  }
  100% {
    background-position: right center;
  }
}

</style>
