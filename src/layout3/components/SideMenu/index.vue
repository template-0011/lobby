<template>
  <div class="h-full">
    <div class="w-220px mr-4 sticker top-0">
      <div class="left-menu rounded-12px overflow-hidden mb-9">
        <div class="user-info flex-y-center h-136px">
          <div class="avatar">
            <img
              class="w-full object-fit"
              src="@/assets/custom-images/site/avatar.png"
              alt=""
            />
          </div>
          <h2 class="color-##7981a4 text-14px">
            {{ userStore?.userInfo?.nickName }}
          </h2>
        </div>
        <div class="user-money w-full color-#8491a5">
          <p>{{ $t('web.i18nFront.label.balance') }}:</p>
          <div class="flex items-center gap-3">
            <span class="color-#ffaf13">{{ balance }}</span>
            <el-button icon="refresh" :loading="refreshLoading" size="small" @click="onRefresh" circle />
          </div>
          <div class="money-container text-12px justify-around">
            <div class="money-icon-box flex flex-col items-center cursor-pointer gap-2 group" @click.prevent="handleClick('recharge')">
              <svg-icon icon-class="icon-deposit" class="icon-normal" size="32px" />
              <img class="icon-active w-8 h-8" src="@/assets/images/home/deposit_active.png" alt="">
              <span class="group-hover:text-[var(--el-color-primary)]">{{ $t("web.i18nFront.label.recharge") }}</span>
            </div>
            <div class="money-icon-box flex flex-col items-center cursor-pointer gap-2 group" @click.prevent="handleClick('withdraw')">
              <svg-icon icon-class="icon-withdraw" class="icon-normal" size="32px" />
              <img class="icon-active w-8 h-8" src="@/assets/images/home/withdraw_active.png" alt="">
              <span class="group-hover:text-[var(--el-color-primary)]">{{ $t("web.i18nFront.label.withdraw") }}</span>
            </div>
            <div class="money-icon-box flex flex-col items-center cursor-pointer gap-2 group" @click.prevent="handleClick('transfor')">
              <svg-icon icon-class="icon-transfer" class="icon-normal" size="32px" />
              <img class="icon-active w-8 h-8" src="@/assets/images/home/transfer_active.png" alt="">
              <span class="group-hover:text-[var(--el-color-primary)]">{{ $t("web.i18nFront.label.transfor") }}</span>
            </div>
          </div>
        </div>
        <ul class="bottom-col pt-3 mb-3 border-t border-#e5e5e5">
          <li
            v-for="(item, i) in menuList"
            :key="i"
            class="menu-item info-item"
            :class="{ 'row-line': item.id === -1}"
            @click="onClickMenu(item)"
          >
          <div
            v-if="item.id !== -1"
            class="menu-content flex items-center pl-6 gap-3 mx-3 rounded-12px"
            :class="{ active: route.name === item.pathName }">
            <svg-icon :icon-class="item.icon" :size="item.iconSize" />
            <h4 class="menu-title">{{ item.title }}</h4>
          </div>
          <div
            v-if="item.id === -1"
            class="mx-5 my-3">
            <div class="h-1px w-full bg-#e5e5e5"></div>
          </div>
          </li>
          <!-- <li
            class="menu-item info-item"
            @click="logout"
          >
            <h4 class="menu-title color-[--el-color-primary]">{{ $t('web.i18nFront.label.logout2') }}</h4>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useLinkOpenFunc from '@/04-kk-component-admin/components/hooks/useLinkOpenFunc';
import { useUserStore } from "@/store";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { goToPayment } = useLinkOpenFunc();

const refreshLoading = ref(false);

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

const balance = computed(() => {
  const money = userStore?.balanceInfo?.balance
    ? userStore.balanceInfo.balance
    : "0.00";
  const symbol = userStore?.currentWalletInfo?.symbol || "";
  return  `${symbol} ${money}`;
});

const { t } = useI18n();

const menuList = [
  {
    id: 1,
    path: "/personal/account",
    title: t("web.i18nFront.label.myPofile"),
    pathName: "UserAccount",
    icon: 'personalcard-fill',
    iconSize: '24px',
  },
  {
    id: 2,
    path: "/personal/finance/wallet",
    title: t("web.i18nFront.label.wallet"),
    pathName: "UserFinance",
    icon: 'wallet-fill',
    iconSize: '24px',
  },
  {
    id: 3,
    path: "/personal/proportion/rewards",
    title: t("web.i18nFront.label.myRewards"),
    pathName: "UserProportion",
    icon: 'myreward-fill',
    iconSize: '24px',
  },
  {
    id: 4,
    path: "/personal/report/total",
    title: t("web.i18nFront.label.myReport"),
    pathName: "UserRreport",
    icon: 'p-report-fill',
    iconSize: '24px',
  },
  {
    id: 5,
    path: "/personal/bill",
    title: t("web.i18nFront.label.accountDetail"),
    pathName: "UserBill",
    icon: 'detail-fill',
    iconSize: '24px',
  },
  {
    id: -1,
    path: "",
    title: "line",
    pathName: "line",
    icon: 'line-fill',
  },
  {
    id: 6,
    path: "/agent/account/open",
    title: t("web.i18nFront.label.agentShare"),
    pathName: "AgentAccount",
    icon: 'share-fill',
    iconSize: '24px',
  },
  {
    id: 7,
    path: "/agent/report/team-full",
    title: t("web.i18nFront.label.agentReport"),
    pathName: "AgentReport",
    icon: 'a-report-fill',
    iconSize: '24px',
  },
  {
    id: 8,
    path: "/personal/announcement",
    title: t("web.i18nFront.label.platNoti"),
    pathName: "Announcement",
    icon: 'icon-notice-fill',
    iconSize: '24px',
  },
];

function onClickMenu(item: any) {
  const { path } = item;
  router.push({ path });
}


const handleClick = (path: string) => {
  if(path === "transfor") {
    router.push({ path: "/personal/finance/wallet" });
  }  else if(path === "recharge") {
    goToPayment("deposit");
  } else if(path === "withdraw") {
    goToPayment("withdraw");
  }
};

async function onRefresh() {
  refreshLoading.value = true;
  await userStore.getUserBanlance();
  refreshLoading.value = false;
}
</script>

<style lang="scss" scoped>
.left-menu {
  box-shadow: 0 4px 16px rgba(152,161,182,.04);
  border-radius: 12px;
  background: #ffffff;
}
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 16px;
  height: 160px;
  color: #7981a4;
  background: #ffffff;
}
// .bottom-col {
//   border-right: 1px solid rgba(115, 122, 146, .14);
//   border-left: 1px solid rgba(115, 122, 146, .14);
// }
.avatar {
  padding: 6px;
  width: 94px;
  height: 94px;
  border-radius: 50%;
}
.menu-item {
  position: relative;
  height: 48px;
  line-height: 48px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
}
.row-line {
  height: auto;
  line-height: auto;
}
.info-item {
  border: none;
  // box-shadow: inset 0 -.5px 0 0 rgba(132, 144, 167, 0.3);
  color: #8491a5;
}
.menu-title {
  position: relative;
  z-index: 2;
  font-size: 16px;
}
.menu-item:hover .menu-content,
.menu-item .active {
  background-color: #f3fafd;
  color: #597ef7;
}
html.dark .menu-item.active {
  background-color: #1e222c;
  color: #fff;
}
.user-money {
  padding: 16px;
  position: relative;
  background-size: contain;
  background: #fff;
  // box-shadow: 0 0 6px 0 rgba(0, 0, 0, .05);
  border-radius: 12px 12px 0 0;
}
html.dark .user-money {
  background: #292e3b;
}
.money-container {
  display: flex;
  flex-basis: 20px;
  width: 182px;
  margin-top: 10px;
  border-radius: 7px;
  padding: 8px 0;
}
.icon-normal {
  display: block;
}
.icon-active {
  display: none;
}
.money-icon-box:hover .icon-active {
  display: block;
}
.money-icon-box:hover .icon-normal {
  display: none;
}
html.dark .money-container {
  background: #262933;
}
</style>
