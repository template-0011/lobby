<script setup lang="ts">
defineOptions({
  name: "SafeSection",
});

</script>

<template>
  <div class="flex items-center justify-between mt-7">
      <!-- <div class="w-630px h-470px select-none">
        <img class="w-full" src="@/assets/images/home/info-image.png" alt="">
      </div> -->
      <div class="min-h-500px w-522px">
        <p class="mt-90px color-#7981a4 text-base leading-34px">全球首家一体化娱乐原生APP，尽显流畅，完美操作。海量体育，电竞顶尖赛事，真人娱乐，彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！</p>
        <p class="download-text">直接访问</p>
        <p class="download-desc">无需下载，手机输入网址即可</p>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.download-text {
  color: #303442;
  margin-top: 14px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
.download-desc {
  color: #303442;
  margin-top: 4px;
  font-size: 12px;
  line-height: 17px;
}
</style>
