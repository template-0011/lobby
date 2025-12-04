<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import {
  getDateStartAndEnd,
  formatNum,
  totalSell,
  totalWin,
} from "@/01-kk-system/allUtils/utils";
import { useUserStore } from "@/store";
import { useBreadcrumb } from "../CustomBreadcrumb/useBreadcrumb";
import { teamHttp } from "@/01-kk-system/allHttp/userHall/team";
import { quckDateList } from "@/01-kk-system/allUtils/const";

defineOptions({
  name: "TeamProfitReport",
});

const userStore = useUserStore();
const { getRootUser, breadcrumbUsers } = useBreadcrumb();

const hideZero = ref(false);
const tableData = ref<IObject[]>([]);
const loading = ref(false);

const unit = computed(() => userStore.currentWalletInfo.abbreviation);

const initDate = getDateStartAndEnd(0);
let currentDate: { dateFrom: string; dateTo: string } = {
  dateFrom: initDate.start,
  dateTo: initDate.end,
};
function updateDate(date: { dateFrom: string; dateTo: string }) {
  currentDate = date;
}

// 面包屑点击
function onClickCrumb(currentUser: BreadcrumbUser) {
  if (currentUser) {
    fetchList(currentUser.userID);
  }
}

function getUserList(row: IObject) {
  if (loading.value) {
    return;
  }
  const { userID, userName } = row;
  const lastUser = breadcrumbUsers.value[breadcrumbUsers.value.length - 1];
  if (lastUser.userID === userID) {
    return;
  }
  breadcrumbUsers.value.push({
    userID,
    userName,
  });
  fetchList(userID);
}

watchEffect(() => {
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  if (walletType && currencyCode) {
    onSearch();
  }
});

function onSearch() {
  const rootUser = getRootUser();
  if (rootUser) {
    fetchList(rootUser.userID);
    breadcrumbUsers.value = [rootUser];
  }
}

async function fetchList(userId: string) {
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  const { dateFrom, dateTo } = currentDate || {};
  const params = {
    walletType,
    currencyCode,
    dateFrom: dateFrom.split(" ")[0],
    dateTo: dateTo.split(" ")[0],
    superiorID: userId,
  };
  loading.value = true;
  const res = await teamHttp.subUserFundList(params).catch(() => null);
  const { code, data } = res || {};
  if (code === "0") {
    const list = data || [];
    if (hideZero.value) {
      const newL = list.filter((n) => {
        return !n.isAllZero;
      });
      tableData.value = newL;
    } else {
      tableData.value = list;
    }
  }
  loading.value = false;
}

function formatter(row: IObject, column: IObject) {
  return formatNum(row[column.property], 2);
}

function getSummaries(param: IObject) {
  const { columns, data } = param;
  const sums: any = [];
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = "总价";
      return;
    }

    const values = data.map((item: any) => {
      if (column.property === "totalSellMoney") {
        return +totalSell(item);
      } else if (column.property === "totalWinMoney") {
        return +totalWin(item);
      } else {
        return Number(item[column.property]);
      }
    });
    if (!values.every((value: any) => isNaN(value))) {
      sums[index] = values.reduce((prev: any, curr: any) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0);
      sums[index] = sums[index].toFixed(2);
    } else {
      sums[index] = "0.00";
    }
  });

  return sums;
}

onBeforeMount(() => {
  const rootUser = getRootUser();
  fetchList(rootUser.userID);
});
</script>

<template>
  <CommonHits :p3="true" />
  <div class="my-4 flex items-center justify-between">
    <DateQuickSelector
      :list="quckDateList"
      style="--custom-radio-checked-text-color: #ffffff"
      @update="updateDate"
    />
    <el-checkbox v-model="hideZero" @change="onSearch">
      {{ $t("web.i18nFront.label.hideZero") }}
    </el-checkbox>
    <el-button class="search-button ml-3" @click="onSearch">
      {{ $t("system.i18nSystem.opration.search") }}
    </el-button>
  </div>
  <div class="mb-3 mt-2 flex items-center gap-2">
    <CustomBreadcrumb v-model="breadcrumbUsers" @on-click="onClickCrumb" />
  </div>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        prop="userName"
        :label="$t('system.i18nSystem.label.userName')"
        align="center"
        :width="120"
      >
        <template #default="{ row }">
          <el-link type="warning" @click="getUserList(row)">
            {{ row.userName }}<el-icon><ArrowRight /></el-icon>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalActivityMoney"
        align="center"
        :formatter="formatter"
        :label="$t('web.i18nFront.label.allActivity')"
      />
      <el-table-column
        prop="totalDepositeMoney"
        align="center"
        :formatter="formatter"
        :label="$t('web.i18nFront.title.allRecharge')"
      />
      <el-table-column
        prop="totalRebateMoney"
        align="center"
        :formatter="formatter"
        :label="$t('web.i18nFront.label.allRebate')"
      />
      <el-table-column
        prop="totalSellMoney"
        align="center"
        :formatter="formatter"
        :label="$t('web.i18nFront.title.allSell')"
      >
        <template #default="scope">
          {{ totalSell(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="totalWinMoney"
        align="center"
        :label="$t('web.i18nFront.title.allWin')"
      >
        <template #default="scope">
          {{ totalWin(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="totalContractMoney"
        align="center"
        :formatter="formatter"
        :label="$t('web.i18nFront.label.allContract')"
      />
      <el-table-column
        prop="totalWithdrawMoney"
        align="center"
        :formatter="formatter"
        :label="$t('web.i18nFront.label.withdrawAll')"
      />
      <el-table-column
        prop="totalProfitMoney"
        align="center"
        :formatter="formatter"
        :label="$t('web.i18nFront.label.allProfit')"
      />
    </el-table>
  </div>
</template>

<style lang="scss" scoped></style>
