<template>
  <transition name="kk-side-right">
    <div ref="noticePanelRef" class="kk-notice-panel fixed top-0 right-0 bottom-0 w-376px h-screen z-9999" v-if="isShowNotice">
      <div class="rounded-6 overflow-hidden my-4 mr-4 w-360px h-[calc(100vh-32px)] bg-white">
        <div class="h-68px w-full flex items-center justify-between px-5 border-b-1 border-b-[#77829b33]">
          <span class="font-600 text-6">
            {{ $t("web.i18nFront.title.notice") }}
          </span>
          <div class="flex-center w-7 h-7 rounded-2 cursor-pointer bg-[#edf2ff]" @click="handleClose">
            <el-icon size="16px"><CloseBold /></el-icon>
          </div>
        </div>

        <div class="kk-notice-list" v-loading="loading">
          <div class="h-full overflow-y-auto overflow-x-hidden pt-4 px-5">
            <div class="notice-item" v-for="item in announceList" :key="item.pressID">
              <p class="text-12px text-[#77829b] mb-2">
                {{ item?.createTime }}
              </p>
              <h3 class="text-5 text-black font-600 mb-4">
                {{ item?.title ?? '-' }}
              </h3>
              <SafeRichText :content="item?.content ?? ''" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { noticeHttp } from "@/01-kk-system/allHttp/userHall/notice";
import { useAppStore } from "@/store";

const router = useRouter();
const appStore = useAppStore();

const noticePanelRef = ref<HTMLElement>();
const announceList = ref<IObject[]>([])
const loading = ref(false)

const isShowNotice = defineModel<boolean>('show', { required: true });

onClickOutside(noticePanelRef, event => {
  isShowNotice.value = false;
})

const handleClose = () => {
  isShowNotice.value = !isShowNotice.value;
}

async function getNoticeList() {
  loading.value = true;
  const res = await noticeHttp.getAllList("3").catch(() => null);
  const { code, data } = res || {};
  if (code === "0") {
    announceList.value = data || [];
  }
  loading.value = false;
}

watch(isShowNotice, (val) => {
  if (val) {
    getNoticeList();
  }
})

onMounted(() => {
  getNoticeList();
})

</script>
<style scoped>
.kk-notice-panel {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
}
.kk-notice-list {
  @apply bg-white overflow-hidden h-[calc(100%-68px)];
}

.kk-notice-list::after {
  bottom: 0;
  box-shadow: 0 2px 10px #41414126;
  content: "";
  display: block;
  height: 100%;
  left: 0;
  opacity: 1;
  pointer-events: none;
  position: absolute;
  transition: opacity .3s ease-in-out;
  width: 100%;
}

.notice-item {
  background-color: #edf2ff;
  border: 1px solid rgba(119, 130, 155, .2);
  border-radius: 16px;
  box-shadow: 0 4px 8px -2px #0e10110d;
  overflow: hidden;
  padding: 16px;
  position: relative;
  margin-bottom: 16px;
}

/* 进入动画 */
.kk-side-right-enter-active {
  transition: transform 0.3s ease-out;
}

.kk-side-right-enter-from {
  transform: translateX(100%);
}

.kk-side-right-enter-to {
  transform: translateX(0);
}

/* 离开动画 */
.kk-side-right-leave-active {
  transition: transform 0.3s ease-in;
}

.kk-side-right-leave-from {
  transform: translateX(0);
}

.kk-side-right-leave-to {
  transform: translateX(100%);
}
</style>