<script setup lang="ts">
import { TabsPaneContext } from "element-plus";

defineOptions({
  name: "AgentReport",
});
const route = useRoute();
const router = useRouter();

const activeName = ref("teamManage");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event, activeName.value);
};
</script>

<template>
  <div class="app-container m-5">
    <el-tabs v-model="activeName" class="top-tabs" @tab-click="handleClick">
      <el-tab-pane
        :label="$t('web.i18nFront.label.teamM')"
        name="teamManage"
        :lazy="true"
      >
        <TeamManage />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.teamSta')"
        name="teamStatistic"
        :lazy="true"
      >
        <TeamStatistics />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.teamProfit')"
        name="teamProfit"
        :lazy="true"
      >
        <TeamProfitReport />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.teamAc')"
        name="teamAc"
        :lazy="true"
      >
        <TeamMoneyChange />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.teamLottery')"
        name="lottery"
        :lazy="true"
      >
        <TeamLotteryBetRecords />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.teamLotteryChess')"
        name="chase"
        :lazy="true"
      >
        <TeamChaseBetRecords />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.teamOther')"
        name="other"
        :lazy="true"
      >
        <TeamThirdBetRecords />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.top-tabs {
  --el-font-size-base: 16px;
}
</style>
