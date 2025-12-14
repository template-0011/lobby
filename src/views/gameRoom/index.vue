<template>
  <div class="w-full h-[calc(100vh-100px)] bg-[#1d4268] p-4">
    <div class="aspect-video w-full h-full rounded-t-md flex items-center justify-center relative">
      <!-- 加载动画覆盖层 -->
      <div v-if="loading || frameLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
        <span class="w-8 h-8 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></span>
      </div>
      <iframe
        :src="gameUrl"
        v-if="gameUrl"
        class="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10"
        ref="iframeRef"
        @load="onFrameLoad"
        scrolling="no"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
        allowtransparency
        autoplay
        muted
        frameborder="0"
      />
      <div v-else class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white text-2xl font-bold">
        <span>游戏不存在</span>
      </div>
    </div>
    <!-- 全屏按钮 -->
    <!-- <div class="relative w-full h-10 px-2 flex items-center justify-between bg-accent/20 rounded-b-md mb-4">
      <button
        class="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70"
        @click="handleFullscreen"
        :title="$t('common.fullscreen')"
      >
        <div class="i-ccarbon:fullscreen"></div>
        <div class="i-ccarbon:fullscreen-exit"></div>
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useGoGameRoom } from '@/hooks/useGoGameRoom';

const { getGameRoomData } = useGoGameRoom()
const route = useRoute()

const loading = ref(false)
const gameUrl = ref('')
// iframe 加载状态
const frameLoading = ref(false)
// iframe 引用（进入全屏）
const iframeRef = ref<HTMLIFrameElement | null>(null)

const gameRoomData = computed(() => getGameRoomData())

console.log("gameRoomData===", gameRoomData.value)

const onFrameLoad = () => {
  frameLoading.value = false
}

const handleFullscreen = () => {
  const el = iframeRef.value as any
  if (!el) return

  const doc: any = document
  const isFull = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement

  if (!isFull) {
    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen()
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen()
    }
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen()
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen()
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen()
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen()
    }
  }
}

onMounted(() => {
  console.log("gameRoomData=2222==", getGameRoomData())
  console.log("gameRoomData===", gameRoomData.value)
  const referer = route.query.ref as string ?? ''
  if (referer) {
    gameUrl.value = referer ? decodeURIComponent(referer) : ''
  }
})
</script>

<style scoped>

</style>
