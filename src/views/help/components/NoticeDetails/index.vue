<script setup lang="ts">
defineProps({
  detail: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  onClose: [void];
}>();
</script>

<template>
  <div
    class="absolute top-0 left-0 w-full h-full bg-white text-sm flex flex-col"
  >
    <div class="mt-5 flex items-center justify-between">
      <h3>{{ detail.title }}</h3>
      <div
        class="flex-center px-3 color-[var(--el-color-primary)] cursor-pointer"
        @click="emit('onClose')"
      >
        <el-icon><ArrowLeft /></el-icon>
        <span class="font-600">{{ $t("web.i18nFront.label.back") }}</span>
      </div>
    </div>
    <p class="color-[var(--cp-color221)] my-2">
      {{ detail.createTime }}
    </p>
    <div class="content-box">
      <SafeRichText :content="detail?.content ?? ''" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-box {
  overflow: hidden;
  overflow-y: auto;
  border-top: 1px solid var(--cp-color234);
  margin-top: 8px;
  padding-top: 8px;
  word-wrap: break-word;
  color: var(--cp-color222) !important;
}
</style>
