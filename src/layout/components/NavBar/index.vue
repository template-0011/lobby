<template>
  <div class="h-52px w-full px-4 flex items-center justify-between">
    <div class="flex items-center">
      <Logo />
    </div>
    <div class="flex items-center">
      <div class="nav-right-item">
        <el-popover
          placement="bottom"
          width="auto"
          popper-style="--el-popover-font-size: 11px;--el-popover-padding: 4px;min-width: auto;padding: 4px 8px;color: #276aa5;"
        >
          <template #reference>
            <div class="w-8 h-8 rounded-2 bg-[#276aa5] flex-center group cursor-pointer">
              <img
                src="@/assets/images/icons/icon-gift.svg"
                alt="icon-gift"
                class="w-4 h-4 group-hover:animate-[kk-anim-shake_0.3s_ease-in-out]"
              />
            </div>
          </template>
          <div class="flex flex-col items-center p-0">
            <p>{{ '成为支付代理商' }}</p>
          </div>
        </el-popover>
      </div>
      <div class="nav-right-item">
        <el-popover
          placement="bottom"
          width="auto"
          popper-style="--el-popover-font-size: 11px;--el-popover-padding: 4px;min-width: auto;padding: 4px 8px;color: #276aa5;"
        >
          <template #reference>
            <div class="w-8 h-8 rounded-2 bg-[#276aa5] flex-center group cursor-pointer">
              <img
                src="@/assets/images/icons/icon-gift.svg"
                alt="icon-gift"
                class="w-4 h-4 group-hover:animate-[kk-anim-scale_0.3s_ease-in-out]"
              />
            </div>
          </template>
          <div class="flex flex-col items-center p-0">
            <p>{{ '存款' }}</p>
          </div>
        </el-popover>
      </div>
      <div class="nav-right-item">
        <el-popover
          placement="bottom"
          width="auto"
          popper-style="--el-popover-font-size: 11px;--el-popover-padding: 4px;min-width: auto;padding: 4px 8px;color: #276aa5;"
        >
          <template #reference>
            <div class="w-8 h-8 rounded-2 bg-[#276aa5] flex-center group cursor-pointer">
              <img
                src="@/assets/images/icons/icon-gift.svg"
                alt="icon-gift"
                class="w-4 h-4 group-hover:animate-[kk-anim-shake_0.3s_ease-in-out]"
              />
            </div>
          </template>
          <div class="flex flex-col items-center p-0">
            <p>{{ '奖励' }}</p>
          </div>
        </el-popover>
      </div>
      <template v-if="!isLoggedIn">
        <div class="nav-right-item">
          <button class="bg-[#7eac2f] h-8 hover:bg-[#93c738] text-white cursor-pointer transition-all py-1 px-4 rounded-2 duration-300 text-sm flex-center" @click="onShowLogin">
            <span>
              {{ $t("system.i18nSystem.opration.register") }}
            </span>
          </button>
        </div>
        <div class="nav-right-item">
          <button class="bg-[#276aa5] h-8 hover:bg-[#3387d1] text-white cursor-pointer transition-all py-1 px-4 rounded-2 duration-300 text-sm flex-center" @click="onShowLogin">
            <span>
              {{ $t("system.i18nSystem.opration.login") }}
            </span>
          </button>
        </div>
      </template>
      <template v-else>
        <Avatar />
        <div class="flex-center mr-10px h-8 rounded-r-2 rounded-l-none overflow-hidden bg-[#276aa5]">
          <div class="flex flex-row items-end">
            <WalletAndCurrencySelector :show-title="false" />
            <div class="leading-20px text-12px color-white font-600">
              {{ balance }}
            </div>
          </div>
          <div class="w-1px h-4 bg-white/20 mx-2"></div>
          <el-icon class="text-12px text-white mr-2 cursor-pointer" size="16" :class="{ 'animate-spin': loading }" @click="handleRefresh">
            <Refresh />
          </el-icon>
        </div>
        <div class="recharge-btn cursor-pointer mr-2 flex-center shrink-0 h-8 rounded-2 px-3 font-600 color-white z-101" @click.prevent="handleClick('recharge')">
          <span class="text-13px whitespace-nowrap">
            {{ $t("web.i18nFront.label.recharge") }}
          </span>
        </div>
        <Notice @onClick="handleNoticeClick" />
      </template>

      <div class="relative flex items-center gap-[1px]">
        <el-popover
          class="box-item"
          placement="bottom-end"
          trigger="click"
          width="400px"
        >
          <template #reference>
            <div
              class="flex items-center gap-2 bg-[#276aa5] hover:bg-[#3387d1] text-white cursor-pointer transition-all duration-300 h-8 px-2 rounded-l-2 rounded-r-none cursor-pointer relative"
            >
              <el-icon size="16"><Setting /></el-icon>
              <el-icon><ArrowDown /></el-icon>
            </div>
          </template>
          <div>
            <SettingPanel />
          </div>
        </el-popover>
        <!-- language -->
        <div class="language-box">
          <SwitchLanguagePop11 width="400px" effect="light" />
        </div>
      </div>
    </div>
  </div>

  <div ref="stickyRef"  class="h-47px w-full px-4 sticky top-0 z-1000 px-4">
    <div ref="stickyContentRef" class="kk-sticky-box">
      <div class="flex h-full items-center mr-4 grow-1">
        <div class="h-full w-full relative">
          <TopMenu />
        </div>
      </div>
      <div class="flex items-center" v-if="!isLoggedIn">
        <button class="kk-login-btn kk-button text-12px mr-10px" @click="onShowLogin">
          <span>
            {{ $t("system.i18nSystem.opration.login") }}
          </span>
        </button>
        <button class="kk-register-btn kk-button text-12px flex-center" @click="onShowLogin">
          <span class="kk-icon-wrapper inline-flex flex-center w-5 h-5 rounded-full mr-3">
            <el-icon><Plus /></el-icon>
          </span>
          <span>
            {{ $t("system.i18nSystem.opration.register") }}
          </span>
        </button>
      </div>
    </div>
  </div>
  <NoticePannel v-model:show="isShowNotice" />
</template>

<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { getMobileHref, localImg } from "@/01-kk-system/allUtils/utils";
import useGameLocalImage from "@/hooks/useGameLocalImage";
import useLinkOpenFunc from "@/04-kk-component-admin/components/hooks/useLinkOpenFunc";
import { useGameStore, useUserStore } from "@/store";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import SettingPanel from "../SettingPanel.vue";

const { goToPayment } = useLinkOpenFunc();

const gameStore = useGameStore();
const userStore = useUserStore();
const { getImage } = useGameLocalImage();
const { onClickClassiGame, onClickOuterGame } = useLinkOpenFunc();

const lotteryGames = ref<IObject[]>([]);

const stickyRef = ref<HTMLElement | null>(null)
const stickyContentRef = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

const loading = ref(false);
const isShowNotice = ref(false);
const onShowLogin = () => {
  userStore.setLoginModalState(true);
};

const isLoggedIn = computed(() => userStore.userInfo.userID);

const balance = computed(() => {
  const money = userStore?.balanceInfo?.balance
    ? userStore.balanceInfo.balance
    : "0.00";
  return `${money}`;
});

const handleClick = (path: string) => {
  if(path === "recharge") {
    goToPayment("deposit");
  }
};

const handleNoticeClick = () => {
  isShowNotice.value = !isShowNotice.value;
}

const handleRefresh = async () => {
  loading.value = true;
  await userStore.getUserBanlance();
  loading.value = false;
}



// 二维码
const qrcodeTxt = shallowRef("");
// @ts-ignore
const qrcode = useQRCode(qrcodeTxt);

function getH5Url() {
  qrcodeTxt.value = getMobileHref(true);
}

function getMenuLotteryImage(info: Record<string, any>) {
  const { lottoClassifyCountry, lottoClassify, lottoID } = info || {};
  const countryCode = lottoClassifyCountry
    ? lottoClassifyCountry.toLowerCase()
    : "";
  return localImg(`custom-images/lottery/${countryCode}-${lottoClassify}.png`);
}

const init = async () => {
  getH5Url();
  const lottery = await gameStore.getAllSeriesAndGamesList();
  let listFour = [];
  if (lottery) {
    for (let series of lottery) {
      const { children } = series || {};
      const game = children[0];
      if (game) {
        // const cty = (game?.lottoClassifyCountry || '').toLowerCase()
        // const lottoClassify = game?.lottoClassify || ''
        listFour.push({
          ...game,
          icon: localImg("images/dropmenu/icon-01.png"),
          title: game.lottoName,
          subTitle: "Lottery",
          image: getMenuLotteryImage(game),
        });
      }
    }
  }
  lotteryGames.value = listFour;
};


onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stickyContentRef.value?.classList.remove('sticked')
        } else {
          stickyContentRef.value?.classList.add('sticked')
        }
      })
    },
    {
      threshold: 1.0,
      rootMargin: '-1px 0px 0px 0px'
    }
  )

  if (stickyRef.value) {
    observer.value.observe(stickyRef.value)
  }
})

onBeforeMount(() => {
  init();
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<style lang="scss" scoped>
.navbar-container {
  @apply w-full;
  height: $navbar-height;
  z-index: 100;
}

.image-box {
  @apply w-7 h-7 rounded-full flex-center mr-3;
  background: linear-gradient(86.37deg, #d062ff 2.96%, #7bb0ff 99.68%),
    linear-gradient(90deg, #ed6ea0 0%, #ec8c69 100%);
  box-shadow: 0 5px 15px #c955ff66;
}

.nav-right-item {
  @apply mr-2 relative;
}
.nav-right-item::before {
  content: "";
  display: block;
  height: 14px;
  width: 1px;
  background: rgba(255, 255, 255, .2);
  position: absolute;
  right: -12px;
  top: calc(50% - 7px);
}

.kk-sticky-box {
  @apply flex items-center;
  max-width: 1900px;
  max-height: 47px;
  height: 100%;
  margin: 0 auto;
  padding: 0 10px;
  background-color: #205583;
  border-radius: 10px;
  transition: border-radius .2s;
  will-change: border-radius, transform;
  position: relative;
}

.kk-sticky-box::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  border-radius: 10px;
  transition: opacity .4s ease, border-radius .2s, transform .2s;
  background-color: #205583;
  opacity: 1;
}

.kk-sticky-box.sticked::before {
  border-radius: 0 0 10px 10px;
  transform: scaleX(1.006);
  box-shadow: 0 2px 5px 3px #0009;
  opacity: 1;
}
.kk-button {
  color: #fff;
  font-weight: 600;
  justify-content: center;
  padding: 0 15px;
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  border-width: 0;
  min-height: 30px;
  cursor: pointer;
  transition: all .1s;
  border-color: transparent;
  border-radius: 8px;
  border-style: solid;
  background-image: linear-gradient(103deg, #108de7 -30%, #0855c4 100%);
}
.kk-login-btn {
  background-image: linear-gradient(0deg, transparent 0%, transparent 100%);
  background-color: #1f2841;
  cursor: pointer;
  transition: all .1s;
}
.kk-login-btn:hover {
  background-color: #202735;
}
.kk-register-btn {
  background-image: linear-gradient(70deg, #31bc69 -8%, #089e4e 96%);
}
.kk-register-btn:hover {
  opacity: 0.9;
}
.kk-icon-wrapper {
  background-image: linear-gradient(210deg, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, .06) 48%, #fff 133%);
}
.recharge-btn {
  background-image: linear-gradient(89deg, var(--color-gd-green));
}

</style>
