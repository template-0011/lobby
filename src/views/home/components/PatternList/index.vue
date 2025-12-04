<template>
  <div class="flex flex-wrap items-center justify-center">
    <div class="game-p-logo w-152px h-55px mb-3" v-for="i in 22" :key="i+'pattern'" :class="`pattern-bg-${i+1}`">
    </div>
  </div>
</template>

<script setup lang="ts">
import { localImg } from "@/01-kk-system/allUtils/utils";

const showImage = (index: number) => {
  return localImg(`custom-images/pattern/pattern-logo-0${index}.png`)
}

</script>

<style lang="scss" scoped>
@for $i from 1 through 22 {
  .pattern-bg-#{$i} {
    background-image: url('@/assets/custom-images/pattern/pattern-logo-0'+$i + '.png');
    background-size: auto 100%;
    background-repeat: no-repeat;
    // background-color: nth($colors, $i); // 假设$colors是一个预定义的颜色列表
  }
}

.game-p-logo:hover {
  transition: all 0.3s;
  transform: scale(1.2);
  cursor: pointer;
}

</style>
