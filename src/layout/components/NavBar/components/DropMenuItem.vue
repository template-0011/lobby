<template>
    <div class="flex flex-col items-center flex-1 cursor-pointer menu-card" @click="emit('onClickGame', item)">
        <div class="flex items-center gap-3">
            <div class="menu-icon">
              <img class="w-42px h-42px rounded-2 object-contain" :src="icon" alt="">
            </div>
            <div class="">
                <h3 class="color-#616783 text-18px font-500 leading-6">{{ title }}</h3>
                <p class="color-#949ab6 text-12px leading-14px">{{ subTitle }}</p>
            </div>
        </div>
        <div class="h-240px">
          <img class="menu-bg h-full object-contain transition-all" :src="image" alt="">
        </div>
    </div>
</template>

<script setup lang="ts">
import { IObject } from '@/01-kk-system/allHttp/types/common';

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({})
  },
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  onClickGame: [data: IObject]
}>()

</script>

<style lang="scss" scoped>
.menu-icon {
  background: url('@/assets/images/dropmenu/menu-bg.png') no-repeat;
  background-size: contain;
}
.menu-card:hover .menu-bg {
  transform: scale(1.1);
}
</style>
