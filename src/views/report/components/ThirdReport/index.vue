<script setup lang="ts">
import {
  outerGamesEnum,
  winStatus,
} from "@/01-kk-system/allDefine/enum/frontend/game";
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { betRecordHttp } from "@/01-kk-system/allHttp/userHall/games";
import { quckDateList } from "@/01-kk-system/allUtils/const";
import { getDateStartAndEnd, formatNum } from "@/01-kk-system/allUtils/utils";
import { useUserStore } from "@/store";
import { translateTextBy } from "@/utils/i18n";

defineOptions({
  name: "ThirdReport",
});

const userStore = useUserStore();

const lotteryTypes = outerGamesEnum.data;

const contentCategory = ref("");
const tableData = ref<IObject[]>([]);
const loading = ref(false);
const pagination = ref({
  pageSize: 10,
  totalPage: 0,
  currentPage: 1,
});
const unit = computed(() => userStore.currentWalletInfo.abbreviation);

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
    createTimeFrom: dateFrom,
    createTimeTo: dateTo,
    contentCategory: contentCategory.value,
  };
  loading.value = true;
  const res = await betRecordHttp.outerRecordList(params).catch(() => null);
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
  <CommonHits />
  <div>
    <el-select
      v-model="contentCategory"
      :placeholder="$t('web.i18nFront.label.allGames')"
      style="width: 240px"
      class="mr-4"
    >
      <el-option
        v-for="item in lotteryTypes"
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
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column
        prop="contentCategory"
        :label="$t('web.i18nFront.label.cententCt')"
        align="center"
      >
        <template #default="scope">
          <span>{{
            translateTextBy(
              outerGamesEnum.getDes(scope.row.contentCategory || "")
            )
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="betTime"
        align="center"
        :label="$t('web.i18nFront.label.betTime')"
      />
      <el-table-column
        prop="realBuyMoney"
        align="center"
        :label="$t('web.i18nFront.label.realbetM')"
      />
      <el-table-column
        prop="methodDes"
        align="center"
        :label="$t('web.i18nFront.label.plays')"
      />
      <el-table-column
        prop="issueCode"
        align="center"
        :label="$t('web.i18nFront.label.issue')"
      />
      <el-table-column
        prop="theoryBuyMoney"
        align="center"
        :label="$t('web.i18nFront.label.betMoney')"
      >
        <template #default="scope">
          {{ formatNum(scope.row.theoryBuyMoney) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="winMoney"
        align="center"
        :label="$t('web.i18nFront.label.rewards')"
      >
        <template #default="scope">
          {{ formatNum(scope.row.winMoney) }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('web.i18nFront.label.status')">
        <template #default="scope">
          {{ translateTextBy(winStatus.getDes(scope.row.winStatus || "")) }}
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
</template>

<style lang="scss" scoped></style>
