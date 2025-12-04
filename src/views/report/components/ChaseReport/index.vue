<script setup lang="ts">
import {
  lottoOwnerEnum,
  winStatus,
} from "@/01-kk-system/allDefine/enum/frontend/game";
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { betRecordHttp } from "@/01-kk-system/allHttp/userHall/games";
import { quckDateList } from "@/01-kk-system/allUtils/const";
import { getDateStartAndEnd, formatNum } from "@/01-kk-system/allUtils/utils";
import { useCurrencyText } from "@/04-kk-component-admin/composables/useCurrencyText";
import { useUserStore } from "@/store";
import { translateTextBy } from "@/utils/i18n";

defineOptions({
  name: "ChaseReport",
});

const userStore = useUserStore();
const { getCurrency } = useCurrencyText();

const lotteryTypes = [
  {
    value: "",
    label: "web.i18nFront.label.allGames",
  },
  ...lottoOwnerEnum.data,
];

const lottoOwnerShip = ref("");
const tableData = ref<IObject[]>([]);
const loading = ref(false);
const pagination = ref({
  pageSize: 10,
  totalPage: 0,
  currentPage: 1,
});
const showDetail = ref(false);
const detail = ref<IObject>({});

const initDate = getDateStartAndEnd(0);
let currentDate: { dateFrom: string; dateTo: string } = {
  dateFrom: initDate.start,
  dateTo: initDate.end,
};
function updateDate(date: { dateFrom: string; dateTo: string }) {
  currentDate = date;
  fetchList();
}

async function fetchList() {
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  const { dateFrom, dateTo } = currentDate || {};
  const params = {
    walletType,
    currencyCode,
    current: pagination.value.currentPage,
    size: pagination.value.pageSize,
    betTimeFrom: dateFrom,
    betTimeTo: dateTo,
    lottoOwnerShip: lottoOwnerShip.value,
  };
  loading.value = true;
  const res = await betRecordHttp.chaseRecordList(params).catch(() => null);
  const { code, data } = res || {};
  if (code === "0") {
    const { recordList, total } = data || {};
    tableData.value = recordList || [];
    pagination.value.totalPage = Number(total || 0);
  }
  loading.value = false;
}

function longfiter(val: any) {
  if (val.length > 10) {
    return val.substring(0, 8) + "...";
  } else {
    return val;
  }
}

function pageChange() {
  if (loading.value) {
    return;
  }
  fetchList();
}

function handleRowClick(row: IObject) {
  showDetail.value = true;
  detail.value = row;
}

onBeforeMount(() => {
  fetchList();
});
</script>

<template>
  <CommonHits />
  <div>
    <el-select
      v-model="lottoOwnerShip"
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
  <div class="max-w-full">
    <el-table :data="tableData" border v-loading="loading" @row-click="handleRowClick">
      <el-table-column
        prop="lottoOwnerShip"
        width="120px"
        :label="$t('web.i18nFront.label.lotOwnerShip')"
        align="center"
      >
        <template #default="scope">
          <span>
            {{
              translateTextBy(lottoOwnerEnum.getDes(scope.row.lottoOwnerShip || ""))
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lottoName"
        width="120px"
        align="center"
        :label="$t('web.i18nFront.label.lotteryName')"
      />
      <el-table-column
        prop="betTime"
        width="120px"
        align="center"
        :label="$t('web.i18nFront.label.betTime')"
      />
      <el-table-column
        prop="methodDes"
        width="120px"
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
        width="120px"
        align="center"
        :label="$t('web.i18nFront.label.betMoney')"
      >
        <template #default="scope">
          {{ formatNum(scope.row.theoryBuyMoney) }}
        </template>
      </el-table-column>
      <el-table-column
        width="100px"
        align="center"
        :label="$t('web.i18nFront.label.currency')"
      >
        <template #default="{ row }">
          {{ getCurrency(row.walletType, row.currencyCode) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="winMoney"
        width="120px"
        align="center"
        :label="$t('web.i18nFront.label.rewards')"
      >
        <template #default="scope">
          {{ formatNum(scope.row.winMoney) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="betNumber"
        width="120px"
        align="center"
        :label="$t('web.i18nFront.label.betNum')"
      >
        <template #default="scope">
          <el-tooltip
            :content="scope.row.betNumber"
            placement="bottom"
            effect="light"
          >
            <span>{{ longfiter(scope.row.betNumber) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="luckyNumber"
        width="120px"
        align="center"
        :label="$t('web.i18nFront.label.openCode')"
      >
        <template #default="scope">
          <el-tooltip
            :content="scope.row.luckyNumber"
            placement="bottom"
            effect="light"
          >
            <span>{{ longfiter(scope.row.luckyNumber) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="120px"
        :label="$t('web.i18nFront.label.status')"
      >
        <template #default="scope">
          {{ translateTextBy(winStatus.getDes(scope.row.winStatus || "")) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="theoryBuyMoney"
        width="120px"
        :label="$t('web.i18nFront.label.theoryBuyMoney')"
      >
        <template #default="scope">
          {{ formatNum(scope.row.theoryBuyMoney) }}
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
    <GameBetDetail v-model:show="showDetail" :detail="detail" />
  </div>
</template>

<style lang="scss" scoped></style>
