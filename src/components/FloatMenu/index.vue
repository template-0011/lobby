<template>
  <div class="float-bg z-100 menu-float fixed right-0 py-3 overflow-hidden top-140px w-100px rounded-l-2" :style="{ width: isClose ? '0' : '100px' }">
    <div class="px-2 flex flex-col items-center justify-center gap-4 text-12px">
      <ThemeSwitch />
      <div class="float-item h-70px w-70px rounded-2 flex-center flex-col cursor-pointer" @click="openService">
        <div class="i-carbon:user-feedback w-7 h-7"></div>
        <span>{{ $t("web.i18nFront.label.server")  }}</span>
      </div>
      <div class="float-item h-70px w-70px rounded-2 flex-center flex-col cursor-pointer" @click="goNotice">
        <div class="i-carbon:notification-new w-7 h-7"></div>
        <span>{{ $t('web.i18nFront.label.platNoti2') }}</span>
      </div>
      <div class="float-item h-70px w-70px rounded-2 flex-center flex-col cursor-pointer" @click="backToTop">
        <div class="i-carbon:upgrade w-7 h-7"></div>
        <span>{{ $t('web.i18nFront.label.backToTop') }}</span>
      </div>
    </div>
  </div>

  <div class="float-bg fixed right-0 top-500px h-50px small-float flex-center rounded-l-2 py-4 cursor-pointer" :style="{ width: isClose ? '50px' : '100px' }" @click="onClickFloat">
    <el-icon class="transition" :class="{'rotate-180	': isClose }" size="30"><DArrowRight /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/store/modules/chat';

const router = useRouter()

const chatStore = useChatStore();

const isClose = ref(false)
const onClickFloat = () => {
  isClose.value = !isClose.value
}

const backToTop = () => {
  const el = document.querySelector('.app-main')
  el?.scrollTo({ top: 0, behavior:'smooth' })
}

function openService() {
  chatStore.openChat();
}

function goNotice() {
  router.push({ path: '/personal/announcement' })
}

</script>

<style scoped>
.menu-float {
  transition: all 0.5s;
  transform-origin: left top;
}
.small-float {
  transition: all 0.5s;
}

.float-bg {
  background-color: hsla(0, 0%, 100%, 0.8);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .3);
}
.float-item {
  background: hsla(0, 0%, 100%, .8);
  box-shadow: inset 0 3px 3px 0 hsla(0, 0%, 100%, .11), inset 0 -3px 3px 0 rgba(0, 0, 0, .1), 0 2px 4px 0 rgba(0, 0, 0, .3);
  border: none;
  color: #273569;
  transition: all 0.5s;
}
.float-item:hover,
html.dark .float-item:hover {
  background-image: linear-gradient(137deg, #a98fff 1%, #597ef7 99%);
  color: #fff;
}
html.dark .float-bg {
  background-color: rgba(0, 0, 0, 0.4);
}
html.dark .float-item {
  background: rgba(60, 62, 66, .9);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .3), inset 0 3px 3px 0 hsla(0, 0%, 100%, .11), 0 2px 4px 0 rgba(0, 0, 0, .3);
  border: none;
  color: #fff;
  transition: all 0.5s;
}
</style>
