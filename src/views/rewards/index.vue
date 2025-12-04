<script setup lang="ts">
import { TabsPaneContext } from "element-plus";

defineOptions({
  name: "Rewards",
});
const route = useRoute();
const router = useRouter();

const activeName = ref("benefit");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event, activeName.value);
};
</script>

<template>
  <div class="app-container m-5">
    <el-tabs v-model="activeName" class="top-tabs" @tab-click="handleClick">
      <el-tab-pane
        :label="$t('web.i18nFront.label.benefitOverview')"
        name="benefit"
      >
        <AllRards />
      </el-tab-pane>
      <!-- <el-tab-pane
        :label="$t('web.i18nFront.label.cashbackRecord')"
        name="cashback"
      >
        <el-empty />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.commissionRecord')"
        name="commission"
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
