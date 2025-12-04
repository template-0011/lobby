<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { contractHttp } from "@/01-kk-system/allHttp/userHall/user";
import {
  contractType,
  contractCircle,
} from "@/01-kk-system/allDefine/enum/frontend/contract";
import { formatNum } from "@/01-kk-system/allUtils/utils";
import { TableColumnCtx } from "element-plus";

defineOptions({
  name: "AllRards",
});

const { t } = useI18n();
const list = ref<IObject[]>([]);
const loading = ref(false)

async function getList() {
  loading.value = true;
  const res = await contractHttp.getMyContractList().catch(() => null);
  const { code, data } = res || {};
  if (code === "0") {
    const tempList = data || [];
    tempList.forEach((item) => {
      if (typeof item.jsonConf === "string") {
        item.ConfigList = JSON.parse(item.jsonConf);
      }
    });
    list.value = tempList;
  }
  loading.value = false;
}

function getI18ntxt(key: string) {
  return t(key || "");
}

function formatRowValue(row: any, column: TableColumnCtx<any>, cellValue: any, index: number) {
  return formatNum(cellValue, 2)
}

onBeforeMount(() => {
  getList();
});
</script>

<template>
  <template v-if="list && list.length > 0">
    <div class="tables">
      <div v-for="(data, i) in list" :key="i" class="table-card">
        <!-- <span class="title">
          {{ $t("web.i18nFront.label.contractId") }}：
          {{ data.contractID }}
        </span> -->
        <el-table
          :data="[data]"
          border
          style="width: 100%; margin-bottom: 10px"
          size="small"
          class="cus-table"
        >
          <el-table-column
            prop="contractType"
            align="center"
            :label="$t('web.i18nFront.label.contracttp')"
          >
            <template #default="scope">
              {{ getI18ntxt(contractType.getDes(scope.row.contractType)) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="contractCircle"
            align="center"
            :label="$t('web.i18nFront.label.contractcr')"
          >
            <template #default="scope">
              {{ getI18ntxt(contractCircle.getDes(scope.row.contractCircle)) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="canSubSign"
            align="center"
            :label="$t('web.i18nFront.label.downSign')"
          >
            <template #default="scope">
              {{
                scope.row.canSubSign === "0"
                  ? $t("web.i18nFront.title.cannot")
                  : $t("web.i18nFront.title.can")
              }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('web.i18nFront.label.supportGm')"
          >
            <template #default="scope">
              {{
                scope.row.acceptBetInner === "1" &&
                scope.row.acceptBetOuter === "1"
                  ? $t("web.i18nFront.label.all")
                  : scope.row.acceptBetInner === "1"
                    ? $t("web.i18nFront.label.lottGm")
                    : scope.row.acceptBetOuter === "1"
                      ? $t("web.i18nFront.label.otherGm")
                      : "--"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            :label="$t('system.i18nSystem.label.createTime')"
          ></el-table-column>
        </el-table>

        <el-table :data="data.ConfigList" style="width: 100%" class="cus-table">
          <el-table-column
            align="center"
            width="60"
            type="index"
            :label="$t('web.i18nFront.label.stepStg')"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="name"
            :label="$t('web.i18nFront.label.mainCd')"
          >
            <el-table-column
              align="center"
              prop="name"
              :label="$t('web.i18nFront.label.sellRange')"
            >
              <template #default="scope"> ≥ {{ scope.row.min }} </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            prop="conditionActiveUser"
            :label="$t('web.i18nFront.label.otherCd1')"
          >
            <el-table-column
              align="center"
              prop="conditionActiveUser"
              :label="$t('web.i18nFront.label.activeCount')"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            prop="conditioTotalSell"
            :label="$t('web.i18nFront.label.otherCd2')"
          >
            <el-table-column
              align="center"
              prop="conditioTotalSell"
              :formatter="formatRowValue"
              :label="$t('web.i18nFront.label.allAmount')"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            prop="conditionTotalDeposit"
            :label="$t('web.i18nFront.label.otherCd3')"
          >
            <el-table-column
              align="center"
              prop="conditionTotalDeposit"
              :formatter="formatRowValue"
              :label="$t('web.i18nFront.label.allRechage')"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            prop="conditionTotalProfit"
            :label="$t('web.i18nFront.label.otherCd4')"
          >
            <el-table-column
              align="center"
              prop="conditionTotalProfit"
              :formatter="formatRowValue"
              :label="$t('web.i18nFront.label.allProfitM')"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            prop="value"
            :label="
              data.contractCalcMod === '1'
                ? $t('web.i18nFront.label.contractRate')
                : $t('web.i18nFront.label.contractAmount')
            "
          >
            <template #default="scope"
              >{{ formatNum(scope.row.value) }}
              <span v-if="data.contractCalcMod === '1'">%</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </template>
  <template v-else>
    <el-empty />
  </template>
</template>

<style lang="scss" scoped>
.tables .cus-table {
  --el-table-header-bg-color: var(--el-color-primary);
  font-size: 14px;
  --el-table-header-text-color: #ffffff;
}
.tables :deep(.el-table thead.is-group th.el-table__cell) {
  background: var(--el-color-primary);
}
.tables .table-card {
  background-color: var(--cp-color174);
  border: 4px solid var(--cp-color175);
  border-radius: 6px;
  padding: 12px 15px;
  margin-bottom: 18px;
}
.tables .title {
  display: block;
  color: var(--el-color-primary);
  margin-bottom: 15px;
  font-size: 16px;
}
</style>
