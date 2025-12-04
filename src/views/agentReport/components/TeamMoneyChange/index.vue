<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { teamHttp } from "@/01-kk-system/allHttp/userHall/team";
import { formatNum, getDateStartAndEnd } from "@/01-kk-system/allUtils/utils";
import { useUserStore } from "@/store";
import { quckDateList } from "@/01-kk-system/allUtils/const";
import { useCurrencyText } from "@/04-kk-component-admin/composables/useCurrencyText";
import { useMoneyChangeTypes } from "@/04-kk-component-admin/composables/useMoneyChangeTypes";

defineOptions({
  name: "TeamMoneyChange",
});

const userStore = useUserStore();
const { getCurrency } = useCurrencyText();
const { businessAndReason, getCurrentChangeTxt } = useMoneyChangeTypes();

const businessCode = ref("");
const reasonCode = ref("");
const reasonOtions = ref<IObject[]>([]);
const tableData = ref<IObject[]>([]);
const loading = ref(false);
const walletsList = ref<IObject[]>([]);
const pagination = ref({
  pageSize: 10,
  totalPage: 0,
  currentPage: 1,
});

const oncChangeHis = () => {
  let reList = [
    {
      label: "system.frontend.fundhistory.all",
      value: "",
    },
  ];
  if (businessCode.value) {
    const target = businessAndReason.filter(
      (item) => item.value === businessCode.value
    )[0];
    reList = reList.concat(target.children);
  }
  reasonOtions.value = reList;
  reasonCode.value = "";
};

const initDate = getDateStartAndEnd(0);
let currentDate: { dateFrom: string; dateTo: string } = {
  dateFrom: initDate.start,
  dateTo: initDate.end,
};
function updateDate(date: { dateFrom: string; dateTo: string }) {
  currentDate = date;
}

async function fetchList() {
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  const { dateFrom, dateTo } = currentDate || {};
  const params = {
    walletType,
    currencyCode,
    current: pagination.value.currentPage,
    size: pagination.value.pageSize,
    operateTimeFromFrom: dateFrom,
    operateTimeFromTo: dateTo,
    businessCode: businessCode.value === "0" ? null : businessCode.value,
    reasonCode: reasonCode.value === "0" ? null : reasonCode.value,
  };
  loading.value = true;
  const res = await teamHttp.historyFund(params).catch(() => null);
  const { code, data } = res || {};
  if (code === "0") {
    const { recordList, total } = data || {};
    tableData.value = recordList || [];
    pagination.value.totalPage = Number(total || 10);
  }
  loading.value = false;
}

function pageChange() {
  if (loading.value) {
    return;
  }
  fetchList();
}

onBeforeMount(() => {
  fetchList();
});
</script>

<template>
  <div class="app-container">
    <CommonHits />
    <div>
      <el-select
        v-model="businessCode"
        :placeholder="$t('system.frontend.fundhistory.all')"
        style="width: 240px"
        class="mr-4"
        @change="oncChangeHis"
      >
        <el-option
          v-for="item in businessAndReason"
          :key="item.value"
          :label="$t(item.label)"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="reasonCode"
        :placeholder="$t('system.frontend.fundhistory.all')"
        style="width: 240px"
      >
        <el-option
          v-for="item in reasonOtions"
          :key="item.value"
          :label="$t(item.label)"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="my-4 flex items-center justify-between">
      <DateQuickSelector
        :list="quckDateList"
        style="--custom-radio-checked-text-color: #ffffff"
        @update="updateDate"
      />

      <el-button class="search-button ml-3" @click="fetchList">
        {{ $t("system.i18nSystem.opration.search") }}
      </el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="userName"
          :label="$t('system.i18nSystem.label.userName')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="operateTime"
          align="center"
          :label="$t('web.i18nFront.label.time')"
        />
        <el-table-column
          prop="historyType"
          align="center"
          :label="$t('web.i18nFront.label.historyType')"
        >
          <template #default="{ row }">
            {{ getCurrentChangeTxt(row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          align="center"
          :label="$t('web.i18nFront.label.moneyChange')"
        >
          <template #default="scope">
            {{ formatNum(scope.row.money) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('web.i18nFront.label.currency')"
        >
          <template #default="scope">
            {{ getCurrency(scope.row.walletType, scope.row.currencyCode) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceAfterChange"
          align="center"
          :label="$t('web.i18nFront.label.balance')"
        >
          <template #default="scope">
            {{ formatNum(scope.row.balanceAfterChange) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="flex-center mt-6"
        background
        v-model:current-page="pagination.currentPage"
        layout="prev, pager, next"
        :page-size="pagination.pageSize"
        :total="pagination.totalPage"
        @change="pageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
