<script setup lang="ts">
import { outerGameHttp } from "@/01-kk-system/allHttp/userHall/games";
import { useUserStore } from "@/store";

defineOptions({
  name: "FinancePage",
});

const userStore = useUserStore();
const backLoading = ref(false);
const refreshLoading = ref(false);
const listKey = ref(1);

const { t } = useI18n();

const balance = computed(() => {
  const money = userStore?.balanceInfo?.balance
    ? userStore.balanceInfo.balance
    : "0.00";
  const symbol = userStore?.currentWalletInfo?.symbol || "";
  return `${symbol} ${money}` || "0.00";
});

async function onRefresh() {
  refreshLoading.value = true;
  await userStore.getUserBanlance();
  refreshLoading.value = false;
}

provide('Outer-Game-Provider', {
  onRefresh
})

const getAllBack = useThrottleFn(async () => {
  backLoading.value = true;
  const res = await outerGameHttp.getAllOuterBalanceBack().catch(() => null);
  if (res?.code === "0") {
    ElMessage.success(t("web.i18nFront.hint.outer2sOk"));
    setTimeout(() => {
      onRefresh()
      listKey.value += 1
    }, 1000);
  }
  backLoading.value = false;
}, 2000);
</script>

<template>
  <div>
    <div
      class="flex items-center text-sm h-46px w-full rounded-6px px-2 color-black"
    >
      <h3>{{ $t("web.i18nFront.label.centerWlt") }}:</h3>
      <span class="money text-15px ml-2 color-[var(--el-color-primary)]">{{ balance }}</span>
      <el-button
        text
        icon="Refresh"
        :loading="refreshLoading"
        @click="onRefresh"
      >
        <template #icon>
          <el-icon v-show="!refreshLoading" class="cursor-pointer" size="20">
            <Refresh />
          </el-icon>
        </template>
      </el-button>
      <el-button
        type="danger"
        size="small"
        :loading="backLoading"
        round
        @click="getAllBack"
      >
        {{ $t("web.i18nFront.label.getBack") }}
      </el-button>
    </div>
  </div>
  <MoneySwitchThird />
  <h3 class="font-500 text-16px  mt-5 mb-4 color-black">
    {{ $t("web.i18nFront.title.walletList") }}
  </h3>
  <OuterBalanceCardList :key="listKey" />
</template>

<style lang="scss" scoped>
</style>
