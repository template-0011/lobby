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
  name: "",
});
// const searchData = ref<Array<any> | undefined>([new Date(), new Date()]);
const emit = defineEmits<{
  onSearch: [{ dateFrom: string; dateTo: string }];
}>();

const { t } = useI18n();
const userStore = useUserStore();
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
  const res = await teamHttp.selfAll(params);
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
  const res = await teamHttp.selfByDate(params);
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

onBeforeMount(() => {
  onClickSearch();
  getLatest10Day();
});
</script>

<template>
  <div>
    <CommonHits :p2="true" />
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
    <div v-loading="loading">
      <div class="card flex gap-5 mt-6">
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span>{{ $t("web.i18nFront.label.sellAll") }}</span>
          </span>
          <p>{{ totalSellVal }}{{ unit }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span>{{ $t("web.i18nFront.label.winAll") }}</span>
          </span>
          <p>{{ totalWinVal }}{{ unit }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span>{{ $t("web.i18nFront.label.rechargeAll") }}</span>
          </span>
          <p>{{ formatNum(teamSubAllFund.totalDepositeMoney) }}{{ unit }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span>{{ $t("web.i18nFront.label.withdrawAll") }}</span>
          </span>
          <p>{{ formatNum(teamSubAllFund.totalWithdrawMoney) }}{{ unit }}</p>
        </el-card>
      </div>
      <div class="card flex gap-5 mt-6">
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span>{{ $t("web.i18nFront.label.allActivity") }}</span>
          </span>
          <p>{{ formatNum(teamSubAllFund.totalActivityMoney) }}{{ unit }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span>{{ $t("web.i18nFront.label.allContract") }}</span>
          </span>
          <p>{{ formatNum(teamSubAllFund.totalContractMoney) }}{{ unit }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span>{{ $t("web.i18nFront.label.allRebate") }}</span>
          </span>
          <p>{{ formatNum(teamSubAllFund.totalRebateMoney) }}{{ unit }}</p>
        </el-card>
        <el-card shadow="always" class="flex-1 shrink-0">
          <span class="flex-y-center">
            <el-icon><Money /></el-icon>
            <span>{{ $t("web.i18nFront.label.allProfit") }}</span>
          </span>
          <p>{{ formatNum(teamSubAllFund.totalProfitMoney) }}{{ unit }}</p>
        </el-card>
      </div>
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
</style>
