<script setup lang="ts">
import { UseIntersectionObserverReturn } from '@vueuse/core';

defineOptions({
  name: "KKScrollLoadMore",
});

const props = defineProps<{
  finished: boolean
}>()

const emit = defineEmits<{
  (e: 'loadMore'): void
}>()

const scrollLoadMoreRef = ref<HTMLDivElement>();
const targetIsVisible = ref(false)

let observer: UseIntersectionObserverReturn | null = null

onMounted(() => {
  if (scrollLoadMoreRef.value) {
    observer = useIntersectionObserver(scrollLoadMoreRef, ([entry], observerElement) => {
      targetIsVisible.value = entry?.isIntersecting || false
      if (targetIsVisible.value && !props.finished) {
        emit('loadMore')
      }
    })
  }
})

onBeforeUnmount(() => {
  observer?.stop()
})
</script>

<template>
  <div ref="scrollLoadMoreRef" class="flex-center relative py-8 color-#fff">
    <div class="flex-center flex-col gap-2" v-if="!finished">
      <KKLoading />
      <p>{{ '加载更多' }}</p>
    </div>
    <p v-else>{{ '没有更多了' }}</p>
  </div>
</template>

<style lang="scss" scoped>
</style>
