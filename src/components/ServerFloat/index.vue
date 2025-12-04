<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { localImg } from "@/01-kk-system/allUtils/utils";
import { useChatStore } from "@/store";
defineOptions({
  name: "KKServerFloat",
});

const chatStore = useChatStore();

function openService() {
  chatStore.openChat();
}
</script>

<template>
  <div class="fixed right-4 bottom-4 flex items-center gap-1px z-999 overflow-hidden h-30px rounded-2">
    <div class="server-btn flex-1 min-w-11 h-full">
      <span>7/24</span>
    </div>
    <div class="server-btn flex-1 min-w-11 h-full cursor-pointer hover:opacity-80" @click="openService">
      <span class="text-base i-carbon:chat"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.server-btn {
  background-image: linear-gradient(112deg,#2972d6 0%,#2662cc 100%);
  font-size: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
