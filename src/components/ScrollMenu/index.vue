<script setup lang="ts">
import throttle from 'lodash-es/throttle';

defineOptions({
  name: "KKScrollMenu",
});

const scrollMenuConRef = ref<HTMLDivElement>();
const needScroll = ref(false);
const endSide = ref<"left" | "right" | "none">("left")
let scrollUnit = 0;
let scrollWidthValue = 0; // 可滚动的距离
let scrollLeftValue = 0;

const scrollFun = (event: Event) => {
  try {
    const target = event.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    scroll(scrollLeft);
  } catch (error) {
    console.error(error);
  }
}

const scroll = (scrollLeft: number) => {
  scrollLeftValue = scrollLeft
  if (scrollLeftValue <= 10) {
    endSide.value = "left"
  } else if (scrollLeftValue >= scrollWidthValue - 10) {
    endSide.value = "right"
  } else {
    endSide.value = "none"
  }
}

const scrollToHorizontal = (left: number) => {
  if (scrollMenuConRef.value) {
    scrollMenuConRef.value.scrollTo({
      left,
      behavior: "smooth",
    })
  }
}

const handleScrollRight = throttle(() => {
  const newLeft = scrollLeftValue + scrollUnit
  if (newLeft > scrollWidthValue) {
    scrollLeftValue = scrollWidthValue
  } else {
    scrollLeftValue = newLeft
  }
  scrollToHorizontal(scrollLeftValue)
}, 200, { leading: true, trailing: false })

const handleScrollLeft = throttle(() => {
  const newLeft = scrollLeftValue - scrollUnit
  if (newLeft <= 0) {
    scrollLeftValue = 0
  } else {
    scrollLeftValue = newLeft
  }
  scrollToHorizontal(scrollLeftValue)
}, 200, { leading: true, trailing: false })

const gapVal = 10
onMounted(() => {
  if (scrollMenuConRef.value) {
    useResizeObserver(scrollMenuConRef, (entries) => {
      const target = entries[0]?.target ?? {}
      const clientWidth = target.clientWidth ?? 0
      const scrollWidth = target.scrollWidth ?? 0
      scrollLeftValue = target.scrollLeft ?? 0
      scrollWidthValue = scrollWidth - clientWidth
      scrollUnit = clientWidth * 0.5 > 100 ? clientWidth * 0.5 : 100

      needScroll.value = scrollWidth > clientWidth + gapVal
      if (needScroll.value) {
        scroll(scrollLeftValue)
      }
    })
  }
})
</script>

<template>
  <div class="flex items-center gap-2 relative">
    <div class="arrow-btn left flex-center" :class="{ 'active': needScroll && endSide !== 'left' }" @click="handleScrollLeft">
      <el-icon color="#ffffff" size="16px"><ArrowLeftBold /></el-icon>
    </div>
    <div
      ref="scrollMenuConRef"
      @scroll="scrollFun"
      class="scroll-menu-container"
      :class="{
        'all': needScroll && endSide === 'none',
        'left': needScroll && endSide === 'left',
        'right': needScroll && endSide === 'right'
      }">
      <slot></slot>
    </div>
    <div class="arrow-btn right flex-center" :class="{ 'active': needScroll && endSide !== 'right' }" @click="handleScrollRight">
      <el-icon color="#ffffff" size="16px"><ArrowRightBold /></el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.arrow-btn {
  opacity: 0;
  width: 21px;
  transition: opacity .25s, transform .25s;
  justify-content: center;
  z-index: 2;
  user-select: none;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  height: 30px;
  position: absolute;
  background-image: linear-gradient(152deg, #108de7, #0855c4);
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
}
.arrow-btn.left {
  left: 0;
  transform: translate(-5px);
}
.arrow-btn.left.active {
  opacity: 1;
  pointer-events: all;
  transform: translate(0);
}
.arrow-btn.right {
  right: 0;
  transform: translate(5px);
}
.arrow-btn.right.active {
  opacity: 1;
  pointer-events: all;
  transform: translate(0);
}
.scroll-menu-container {
  overflow-x: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  scrollbar-width: none;
}
.scroll-menu-container.all {
  mask-image: linear-gradient(to right, transparent 0, transparent 25px, #000 50px, #000 calc(100% - 50px), transparent calc(100% - 25px), transparent 100%);
}
.scroll-menu-container.left {
  mask-image: linear-gradient(to left, transparent 0, transparent 25px, #000 50px);
}
.scroll-menu-container.right {
  mask-image: linear-gradient(to right, transparent 0, transparent 25px, #000 50px);
}
</style>
