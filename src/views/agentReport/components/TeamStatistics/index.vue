<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { teamHttp } from "@/01-kk-system/allHttp/userHall/team";
import {
  getDateStartAndEnd,
  totalSell,
  totalWin,
  formatNum,
} from "@/01-kk-system/allUtils/utils";
import { useUserStore } from "@/store";

defineOptions({
  name: "TeamStatistics",
});

const emit = defineEmits<{
  onSearch: [{ dateFrom: string; dateTo: string }];
}>();

const { t } = useI18n();
const userStore = useUserStore();
const teamOverall = ref<IObject>({});
const teamSubAllFund = ref<IObject>({});
const loading = ref(false);
const refreshLoading = ref(false);
const chartData = ref<any[]>([]);
const barChartRef = ref<any>();

const totalSellVal = computed(() => totalSell(teamSubAllFund.value, 4));
const totalWinVal = computed(() => totalWin(teamSubAllFund.value, 4));
const unit = computed(() => userStore.currentWalletInfo.abbreviation);

const initDate = getDateStartAndEnd(0);
let currentDate: { dateFrom: string; dateTo: string } = {
  dateFrom: initDate.start,
  dateTo: initDate.end,
};
function updateDate(date: { dateFrom: string; dateTo: string }) {
  currentDate = date;
}

watchEffect(() => {
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  if (walletType && currencyCode) {
    init();
  }
});

async function getTeamOverall() {
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  const params = {
    currencyCode,
    walletType,
  };
  // const res = await teamHttp.memberList();
  const res = await teamHttp.moneyAll(params).catch(() => null);
  const { code, data } = res || {};
  if (code === "0") {
    teamOverall.value = data || {};
  }
}

async function onClickSearch() {
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  const { dateFrom, dateTo } = currentDate || {};
  const params = {
    currencyCode,
    walletType,
    dateFrom: dateFrom.split(" ")[0],
    dateTo: dateTo.split(" ")[0],
  };
  loading.value = true;
  const res = await teamHttp.subAll(params);
  const { code, data } = res || {};
  if (code === "0") {
    teamSubAllFund.value = data;
  }
  loading.value = false;
}

async function getLatest10Day() {
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  const { start, end } = getDateStartAndEnd(-10);
  const params = {
    currencyCode,
    walletType,
    dateFrom: start.split(" ")[0],
    dateTo: end.split(" ")[0],
  };
  loading.value = true;
  const res = await teamHttp.subByDate(params);
  const { code, data = [] } = res || {};
  if (code === "0") {
    const list: any[] = [];
    data.forEach((element: IObject) => {
      element = element || {};
      const temp = {
        product: element.date,
        [t("web.i18nFront.label.allActivity")]: element.totalActivityMoney,
        [t("web.i18nFront.title.allRewards")]: element.totalBonusMoney,
        [t("web.i18nFront.title.allRecharge")]: element.totalDepositeMoney,
        [t("web.i18nFront.title.allLost")]: element.totalLossMoney,
        [t("web.i18nFront.label.allProfit")]: element.totalProfitMoney,
        [t("web.i18nFront.label.allRebate")]: element.totalRebateMoney,
        [t("web.i18nFront.title.allSalary")]: element.totalSalaryMoney,
        [t("web.i18nFront.title.allSell")]: element.totalSellMoney,
        [t("web.i18nFront.title.allWin")]: element.totalWinMoney,
        [t("web.i18nFront.title.allWithdraw")]: element.totalWithdrawMoney,
      };
      list.push(temp);
    });
    chartData.value = list;
    updateChartData();
  }
  loading.value = false;
}

function updateChartData() {
  const option = {
    legend: {
      top: 10,
      bottom: 10,
    },
    tooltip: {},
    dataset: {
      dimensions: [
        "product",
        t("web.i18nFront.label.allActivity"),
        t("web.i18nFront.title.allRewards"),
        t("web.i18nFront.title.allRecharge"),
        t("web.i18nFront.title.allLost"),
        t("web.i18nFront.label.allProfit"),
        t("web.i18nFront.label.allRebate"),
        t("web.i18nFront.title.allSalary"),
        t("web.i18nFront.title.allSell"),
        t("web.i18nFront.title.allWin"),
        t("web.i18nFront.title.allWithdraw"),
      ],
      source: chartData.value,
    },
    xAxis: { type: "category" },
    yAxis: {},
    series: [
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
    ],
  };
  if (barChartRef.value && barChartRef.value.updateChart) {
    barChartRef.value.updateChart(option);
  }
}

function onRefresh() {
  getLatest10Day();
}

function init() {
  getTeamOverall();
  onClickSearch();
  getLatest10Day();
}

onBeforeMount(() => {
  init();
});
</script>

<template>
  <div>
    <CommonHits :p2="true" />
    <div v-loading="loading">
      <div class="yb-card flex flex-wrap gap-5 mt-6">
        <el-card shadow="always" class="flex-1 shrink-0">
          <div class="flex-y-center gap-2">
            <el-icon><User /></el-icon>
            <span>{{ $t("web.i18nFront.label.teamPeople") }}</span>
          </div>
          <p class="px-1 text-16px">{{ teamOverall.totalUserCount }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Wallet /></el-icon>
            <span>{{ $t("web.i18nFront.label.teamBalance") }}</span>
            <span>{{ unit }}</span>
          </span>
          <p class="px-1 text-16px">{{ formatNum(teamOverall.totalMoney) }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span class="pr-1">
              {{ `${$t("web.i18nFront.label.balance")}＜10 ${unit}` }}
            </span>
          </span>
          <p class="px-1 text-16px">{{ teamOverall.balanceBelow10 }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span class="pr-1">
              {{ `${$t("web.i18nFront.label.balance")}≥10 ${unit}` }}
            </span>
          </span>
          <p class="px-1 text-16px">{{ teamOverall.balanceAbove10 }}</p>
        </el-card>
      </div>

      <el-card shadow="always" class="mt-10">
        <template #header>
          <div class="flex-center my-4">
            <DateQuickSelector
              style="--custom-radio-checked-text-color: #ffffff"
              @update="updateDate"
            />
            <el-button
              class="search-button ml-3"
              @click="onClickSearch"
            >
              {{ $t("system.i18nSystem.opration.search") }}
            </el-button>
          </div>
        </template>
        <div class="flex gap-5 mt-6">
          <el-card shadow="always" class="flex-1 shrink-0">
            <span class="flex-y-center">
              <el-icon><Money /></el-icon>
              <span>{{ `${$t("web.i18nFront.label.sellAll")} ${unit}` }}</span>
            </span>
            <p class="px-1 text-16px">{{ totalSellVal }}</p>
          </el-card>
          <el-card shadow="always" class="flex-1 shrink-0">
            <span class="flex-y-center">
              <el-icon><Money /></el-icon>
              <span>{{ `${$t("web.i18nFront.label.winAll")} ${unit}` }}</span>
            </span>
            <p class="px-1 text-16px">{{ totalWinVal }}</p>
          </el-card>
          <el-card shadow="always" class="flex-1 shrink-0">
            <span class="flex-y-center">
              <el-icon><Money /></el-icon>
              <span>{{
                `${$t("web.i18nFront.label.rechargeAll")} ${unit}`
              }}</span>
            </span>
            <p class="px-1 text-16px">
              {{ formatNum(teamSubAllFund.totalDepositeMoney) }}
            </p>
          </el-card>
          <el-card shadow="always" class="flex-1 shrink-0">
            <span class="flex-y-center">
              <el-icon><Money /></el-icon>
              <span>{{
                `${$t("web.i18nFront.label.withdrawAll")} ${unit}`
              }}</span>
            </span>
            <p class="px-1 text-16px">
              {{ formatNum(teamSubAllFund.totalWithdrawMoney) }}
            </p>
          </el-card>
        </div>
        <div class="card flex gap-5 mt-6">
          <el-card shadow="always" class="flex-1 shrink-0">
            <span class="flex-y-center">
              <el-icon><Money /></el-icon>
              <span>{{
                `${$t("web.i18nFront.label.allActivity")} ${unit}`
              }}</span>
            </span>
            <p class="px-1 text-16px">
              {{ formatNum(teamSubAllFund.totalActivityMoney) }}
            </p>
          </el-card>
          <el-card shadow="always" class="flex-1 shrink-0">
            <span class="flex-y-center">
              <el-icon><Money /></el-icon>
              <span>{{
                `${$t("web.i18nFront.label.allContract")} ${unit}`
              }}</span>
            </span>
            <p class="px-1 text-16px">
              {{ formatNum(teamSubAllFund.totalContractMoney) }}
            </p>
          </el-card>
          <el-card shadow="always" class="flex-1 shrink-0">
            <span class="flex-y-center">
              <el-icon><Money /></el-icon>
              <span>{{
                `${$t("web.i18nFront.label.allRebate")} ${unit}`
              }}</span>
            </span>
            <p class="px-1 text-16px">
              {{ formatNum(teamSubAllFund.totalRebateMoney) }}
            </p>
          </el-card>
          <el-card shadow="always" class="flex-1 shrink-0">
            <span class="flex-y-center">
              <el-icon><Money /></el-icon>
              <span>{{
                `${$t("web.i18nFront.label.allProfit")} ${unit}`
              }}</span>
            </span>
            <p class="px-1 text-16px">
              {{ formatNum(teamSubAllFund.totalProfitMoney) }}
            </p>
          </el-card>
        </div>
      </el-card>

      <el-card shadow="always" class="mt-10">
        <div slot="header" class="clearfix">
          <div class="flex items-center">
            <el-icon class="mr-1"><DataAnalysis /></el-icon>
            <span>{{ $t("web.i18nFront.label.last10Trend") }}</span>
            <el-button
              text
              icon="Refresh"
              :loading="refreshLoading"
              @click="onRefresh"
            >
              <template #icon>
                <el-icon
                  v-show="!refreshLoading"
                  class="cursor-pointer"
                  size="20"
                >
                  <Refresh />
                </el-icon>
              </template>
            </el-button>
          </div>
        </div>
        <div class="h-400px w-full">
          <BarChart ref="barChartRef" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .search-button {
//   --el-button-bg-color: var(--cp-color14);
//   --el-color-primary: #ff9054;
// }
.yb-card {
  background-color: var(--cp-color174);
  border: 4px solid var(--cp-color175);
  border-radius: 6px;
  padding: 12px 15px;
  margin-bottom: 18px;
}
</style>
