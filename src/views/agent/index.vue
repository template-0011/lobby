<script setup lang="ts">
import { TabsPaneContext } from "element-plus";

defineOptions({
  name: "AgentAccount",
});
const route = useRoute();
const router = useRouter();

const activeName = ref("consolidate");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event, activeName.value);
};
</script>

<template>
  <div class="app-container m-5">
    <el-tabs v-model="activeName" class="top-tabs" @tab-click="handleClick">
      <el-tab-pane
        :label="$t('web.i18nFront.label.normalOpen')"
        name="consolidate"
        :lazy="true"
      >
        <NormalOpen />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.linkOpen')"
        name="game"
        :lazy="true"
      >
        <LinkOpen />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.linkManage')"
        name="lottery"
        :lazy="true"
      >
        <LinkManage />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.top-tabs {
  --el-font-size-base: 16px;
}
</style>
