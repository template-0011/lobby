<script setup lang="ts">
import { winStatus } from "@/01-kk-system/allDefine/enum/frontend/game";
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { teamHttp } from "@/01-kk-system/allHttp/userHall/team";
import { formatNum } from "@/01-kk-system/allUtils/utils";
import { useUserStore } from "@/store";
import { translateTextBy } from "@/utils/i18n";
import { useBreadcrumb } from "../CustomBreadcrumb/useBreadcrumb";

defineOptions({
  name: "TeamManage",
});

const { t } = useI18n();
const userStore = useUserStore();
const { getRootUser, breadcrumbUsers } = useBreadcrumb();

const tableData = ref<IObject[]>([]);
const loading = ref(false);
const showTransfor = ref(false);
const showContract = ref(false);
const currenRow = ref<IObject>();
const pagination = ref({
  pageSize: 2,
  totalPage: 0,
  currentPage: 1,
});

const canSubSign = computed(
  () => Number(userStore.myContractSalary[0] || 0) === 1
);

async function fetchTeamUserList(superiorID: string) {
  // const { walletType, currencyCode } = userStore.currentWalletInfo;
  // const { dateFrom, dateTo } = currentDate || {};
  const params = {
    superiorID,
    current: pagination.value.currentPage,
    size: pagination.value.pageSize,
  };
  loading.value = true;
  const res = await teamHttp.teamUserPage(params).catch(() => null);
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
  if (breadcrumbUsers.value.length <= 0) {
    ElMessage.error(t("web.i18nFront.hint.userError"));
    return;
  }
  fetchTeamUserList(breadcrumbUsers.value[0].userID);
}

function getUserList(row: IObject) {
  if (loading.value) {
    return;
  }
  const { userID, userName } = row;
  breadcrumbUsers.value.push({
    userID,
    userName,
  });
  fetchTeamUserList(userID);
}

// 是否是直属下级
function isDirectSub(item: IObject) {
  return Number(userStore.userInfo.userLevel) - Number(item.userLevel) === -1;
}
// 面包屑点击
function onClickCrumb(currentUser: BreadcrumbUser) {
  if (currentUser) {
    fetchTeamUserList(currentUser.userID);
  }
}

// 转账
function sedMoney(row: IObject) {
  currenRow.value = row;
  showTransfor.value = true;
}
// 日工资
function salarySign(row: IObject) {}
// 签约
function signContractShow(row: IObject) {
  currenRow.value = row;
  showContract.value = true;
}

onBeforeMount(() => {
  const rootUser = getRootUser();
  fetchTeamUserList(rootUser.userID);
  // 获取我的契约工资
  userStore.getMyContractSalary();
});
</script>

<template>
  <CommonHits />
  <!-- <div class="flex items-center gap-2">
    <span>{{ $t("system.i18nSystem.label.userName") }}:</span>
    <el-input
      class="w-200px"
      v-model="searchUserName"
      style="--el-input-border-color: var(--cp-color68)"
    />
  </div> -->
  <div class="mb-3 mt-2 flex items-center gap-2">
    <CustomBreadcrumb v-model="breadcrumbUsers" @on-click="onClickCrumb" />
  </div>

  <div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column
        prop="userName"
        :label="$t('system.i18nSystem.label.userName')"
        align="center"
        :width="120"
      >
        <template #default="{ row }">
          <el-link type="primary" @click="getUserList(row)">
            {{ row.userName }}<el-icon><ArrowRight /></el-icon>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="balance"
        align="center"
        :width="120"
        :label="$t('web.i18nFront.label.playerBalance')"
      >
        <template #default="{ row }">
          {{ formatNum(row.balance, 8) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastLoginIP"
        align="center"
        :width="120"
        :label="$t('system.i18nSystem.label.lastLoginIP')"
      />
      <el-table-column
        prop="lastLoginDate"
        align="center"
        :width="120"
        :label="$t('system.i18nSystem.label.lastLoginDate')"
      />
      <el-table-column
        prop="bonusGroupOffi"
        align="center"
        :width="80"
        :label="$t('web.i18nFront.label.classicLott')"
      />
      <el-table-column
        prop="bonusGroupSelf"
        align="center"
        :width="80"
        :label="$t('web.i18nFront.label.hotLott')"
      />
      <el-table-column
        prop="bonusGroupThird"
        align="center"
        :width="80"
        :label="$t('web.i18nFront.label.aboradLott')"
      />
      <el-table-column
        prop="status"
        align="center"
        :width="80"
        :label="$t('web.i18nFront.label.status')"
      >
        <template #default="{ row }">
          {{ row.status }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('web.i18nFront.label.isDown')">
        <template #default="scope">
          {{
            isDirectSub(scope.row)
              ? $t("web.i18nFront.title.yes")
              : $t("web.i18nFront.title.no")
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :width="240"
        fixed="right"
        :label="$t('system.i18nSystem.opration.operation')"
      >
        <template #default="{ row }">
          <el-button
            v-if="isDirectSub(row)"
            round
            size="small"
            @click="sedMoney(row)"
          >
            {{ $t("web.i18nFront.label.transfor") }}
          </el-button>
          <el-button
            v-if="canSubSign && isDirectSub(row)"
            round
            size="small"
            @click="salarySign(row)"
          >
            {{ $t("web.i18nFront.label.daySalary") }}
          </el-button>
          <el-button round size="small" @click="signContractShow(row)">
            {{ $t("web.i18nFront.label.sign") }}
          </el-button>
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
    <TransforToSubordinate
      @onRefresh="pageChange"
      v-model="showTransfor"
      :sub-info="currenRow"
    />
    <ContractSub
      @onRefresh="pageChange"
      v-model="showContract"
      :sub-info="currenRow"
    />
  </div>
</template>

<style lang="scss" scoped></style>
