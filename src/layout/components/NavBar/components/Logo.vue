<template>
  <div class="flex items-center mr-4 min-w-100px">
    <a class="flex-center" href="javascript:void(0)" @click="goHome">
      <img class="h-7 object-contain" v-if="logo" :src="logo" alt="" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { PlatformImageCode } from "@/01-kk-system/allHttp/models/common";
import { localImg } from "@/01-kk-system/allUtils/utils";
import { useAppStore } from "@/store";

const router = useRouter();
const appStore = useAppStore();

const logo = ref("");

function goHome() {
  router.replace("/");
}

async function fetchLogo() {
  if (window.location.origin.includes('kk-template')) {
    logo.value = localImg('custom-images/app/logo.png')
    return
  }
  logo.value = await appStore.getAppLogoByCode(PlatformImageCode.PC_LOGO)
}

onBeforeMount(() => {
  fetchLogo();
});
</script>
