<script setup lang="ts">
import { TabsPaneContext } from "element-plus";
import MoneyChange from "./components/MoneyChange.vue";

defineOptions({
  name: "Wallet",
});
const route = useRoute();
const router = useRouter();

const activeName = ref("finance");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event, activeName.value);
};
</script>

<template>
  <div class="app-container m-5">
    <el-tabs v-model="activeName" class="top-tabs" @tab-click="handleClick">
      <!-- <el-tab-pane :label="$t('web.i18nFront.label.recharge')" name="recharge">
        <el-empty />
      </el-tab-pane> -->
      <!-- <el-tab-pane :label="$t('web.i18nFront.label.transfor')" name="transfor">
        <el-empty />
      </el-tab-pane> -->
      <!-- <el-tab-pane :label="$t('web.i18nFront.label.withdraw')" name="withdraw">
        <el-empty />
      </el-tab-pane> -->
      <el-tab-pane :label="$t('web.i18nFront.label.transfor')" name="finance">
        <FinancePage />
      </el-tab-pane>
      <el-tab-pane lazy :label="$t('web.i18nFront.label.swap')" name="swap">
        <MoneyChange />
      </el-tab-pane>
      <!-- <el-tab-pane
        :label="$t('web.i18nFront.label.rechargeR')"
        name="recharge-record"
      >
        <el-empty />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.withdrawR')"
        name="withdraw-record"
      >
        <el-empty />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.transforR')"
        name="transfor-record"
      >
        <el-empty />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.top-tabs {
  --el-font-size-base: 16px;
}
</style>
