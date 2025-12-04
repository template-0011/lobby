<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
export default {
  name: "PageDownload",
};
</script>

<template>
  <div class="max-600px mx-auto min-h-screen pt-30">
    <div class="flex flex-col items-center justify-center gap-3">
      <img class="w-20 h-20 rounded-4 overflow-hidden" src="https://www.kkgaming.org/app/icon/512.png" alt="logo">
      <a class="text-4 bg-blue-500 text-white px-4 py-2 rounded-2" href="itms-services://?action=download-manifest&url=https://www.kkgaming.org/app/manifest.plist">Ios 下载</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
