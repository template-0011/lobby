<script setup lang="ts">
import { useUserStore } from "@/store";
import { TabsPaneContext } from "element-plus";

defineOptions({
  name: "Wallet",
});
const route = useRoute();

const activeName = ref((route.params.menu as string) || "total");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event, activeName.value);
};
</script>

<template>
  <div class="app-container m-5">
    <el-tabs v-model="activeName" class="top-tabs" @tab-click="handleClick">
      <el-tab-pane
        :label="$t('web.i18nFront.label.personCompReport')"
        name="total"
        :lazy="true"
      >
        <PersonalStatistics />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.personGameReport')"
        name="game"
        :lazy="true"
      >
        <el-empty />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.personLotteryReport')"
        name="lottery"
        :lazy="true"
      >
        <LotteryReport />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.personChaseReport')"
        name="chase"
        :lazy="true"
      >
        <ChaseReport />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.personOuterpReport')"
        name="outer"
        :lazy="true"
      >
        <ThirdReport />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.top-tabs {
  --el-font-size-base: 16px;
}
</style>
