<script setup lang="ts">
import HelpSideMenu from "./components/HelpSideMenu/index.vue";
import { useHelpCenter } from "@/04-kk-component-admin/components/hooks/useHelpCenter";

defineOptions({
  name: "HelpCenter",
});

const { groupedList, loading, defaultActive, detailData, onClickRow } = useHelpCenter();

</script>

<template>
  <div class="app-container min-h-[calc(100vh-100px)] bg-[#f5f5f5] mx-4">
    <div class="flex h-full w-full max-w-1200px mx-auto gap-5 pt-5">
      <HelpSideMenu
        :list="groupedList"
        :defaultActive="defaultActive"
        @onClickMenu="onClickRow" />
      <div class="flex-1 relative bg-white rounded-12px p-5 min-h-[calc(100vh-140px)]" v-loading="loading">
        <h3>{{ detailData?.title }}</h3>
        <p class="color-[var(--cp-color221)] my-2">
          {{ detailData.createTime }}
        </p>
        <div class="content-box">
          <SafeRichText :content="detailData?.content ?? ''" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-box {
  overflow: hidden;
  overflow-y: auto;
  margin-top: 8px;
  padding-top: 8px;
  word-wrap: break-word;
  word-break: break-all;
  color: var(--cp-color222) !important;
  white-space: pre-line;
}
</style>
