<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils';
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import useLinkOpenFunc from '@/04-kk-component-admin/components/hooks/useLinkOpenFunc';

defineOptions({
  name: "KKGamerMenuItem",
});

const props = defineProps<{
  imgUrl: string;
  name: string;
}>();

const { onClickOuterSubGame, onClickClassiGame } = useLinkOpenFunc();

const handleClick = () => {
  console.log('handleClick');
}

</script>

<template>
  <div class="kk-scroll-menu-item" @click="handleClick">
    <img class="w-5 h-5 object-contain mr-3px" :src="imgUrl" alt="">
    <span class="color-white">{{ name }}</span>
  </div>
</template>

<style lang="scss" scoped>
.kk-scroll-menu-item {
  align-items: center;
  background-color: #94a6cd26;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 500;
  height: 35px;
  letter-spacing: -.3px;
  padding: 0 10px 0 7px;
  transition: background-color .2s;
  white-space: nowrap;
}
.kk-scroll-menu-item:hover {
  background-color: #94a6cd4d;
}
</style>
