<template>
  <el-dropdown :teleported="true" trigger="click">
    <div
      class="flex-center h-8 mr-1px overflow-hidden relative cursor-pointer rounded-l-2 rounded-r-none"
    >
      <div class="absolute inset-0 bg-[#276aa5] pointer-events-none select-none"></div>
      <div class="rounded-full w-7 h-7 flex-center ml-1 z-1">
        <el-icon color="#fff" size="20px">
          <UserFilled />
        </el-icon>
      </div>
      <div class="mr-2 z-1">
        <el-icon color="#fff" size="12px" class="transform">
          <ArrowDown />
        </el-icon>
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="min-w-[120px] !py-3">
        <el-dropdown-item v-for="(menu, i) in menus" :key="menu.name" @click="onClicmMenu(menu.path)">
          <div class="flex-center gap-3 color-[#444752]">
            <!-- <svg-icon :icon-class="menu.icon" :size="menu.iconSize" /> -->
            <span class="inline-block text-center w-full text-12px">
              {{ menu.title }}
            </span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <!-- <el-button class="w-full text-left mt-2" size="small" @click="logout">
            {{ $t("web.i18nFront.label.logout") }}
          </el-button> -->
          <div class="inline-block text-left w-full text-12px color-[#444752]" @click="logout">
            {{ $t("web.i18nFront.label.logout") }}
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAppStore, useUserStore } from "@/store";

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();

const { t } = useI18n();

const onClicmMenu = (path: string) => {
  router.push({ path });
};

const menus = [
  {
    name: 'myPofile',
    icon: 'personalcard',
    iconSize: '18px',
    title: t("web.i18nFront.label.myPofile") ,
    path: '/personal/account',
    onClick: () => {
      onClicmMenu('/personal/account')
    }
  },
  {
    name: 'wallet',
    icon: 'wallet',
    iconSize: '18px',
    title: t("web.i18nFront.label.wallet"),
    path: '/personal/finance/wallet',
  },
  {
    name: 'myRewards',
    icon: 'myreward',
    iconSize: '20px',
    title: t("web.i18nFront.label.myRewards"),
    path: '/personal/proportion/rewards',
  },
  {
    name: 'myReport',
    icon: 'p-report',
    iconSize: '20px',
    title: t("web.i18nFront.label.myReport"),
    path: '/personal/report/lottery',
  },
  {
    name: 'accountDetail',
    icon: 'detail',
    iconSize: '20px',
    title: t("web.i18nFront.label.accountDetail"),
    path: '/personal/bill',
  },
  {
    name: 'agentShare',
    icon: 'share',
    iconSize: '20px',
    title: t("web.i18nFront.label.agentShare"),
    path: '/agent/account/open',
  },
  {
    name: 'agentReport',
    icon: 'a-report',
    iconSize: '20px',
    title: t("web.i18nFront.label.agentReport"),
    path: '/agent/report/team-full',
  },
  {
    name: 'platNoti',
    icon: 'icon-notice',
    iconSize: '20px',
    title: t("web.i18nFront.label.platNoti"),
    path: '/personal/announcement',
  },
  {
    name: 'helpCenter',
    icon: 'icon-notice',
    iconSize: '20px',
    title: t("web.i18nFront.label.helpCenter"),
    path: "/help",
  },
]

/**
 * 注销
 */
 function logout() {
  ElMessageBox.confirm(
    t("web.i18nFront.hint.confirmOut"),
    t("system.i18nSystem.label.hint"),
    {
      type: "warning",
      lockScroll: false,
    }
  ).then(() => {
    onLogout();
  });
}

const onLogout = () => {
  userStore.logout().then(() => {
    userStore.resetToken();
    router.replace({ path: "/" });
  });
};

</script>
