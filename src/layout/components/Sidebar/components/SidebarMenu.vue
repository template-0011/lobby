<template>
  <nav class="flex gap-y-3 justify-between flex-wrap">
    <SidebarMenuItem
      v-for="item in menuList"
      @onClick="onClickItem"
      :key="item.path"
      :item="item"
    />
  </nav>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store";
import { isExternal } from "@/utils/index";
import path from "path-browserify";

const appStore = useAppStore();
const currentRoute = useRoute();
const props = defineProps({
  menuList: {
    required: true,
    default: () => {
      return [];
    },
    type: Array<any>,
  },
});

const emit = defineEmits<{
  onClick: [data: any];
}>();

const onClickItem = (data: any) => {
  console.log("onClickItem--2", data);
  emit("onClick", data);
};
</script>

<style lang="sess" scoped></style>
