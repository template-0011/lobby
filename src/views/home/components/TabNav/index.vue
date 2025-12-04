<script setup lang="ts">
import { Menus } from "../../config/menuList";
import { useSettingsStore } from "@/store/modules/settings";

defineOptions({
  name: "",
});
const props = defineProps({
  currentMenu: {
    type: String,
    default: "",
  },
});

const settingStore = useSettingsStore();
const activePath = computed(() => settingStore.homeActivepath);

const currentPath = ref("/hot");

function onClick(data: Record<string, any>) {
  const { path } = data;
  settingStore.changeSetting({ key: "homeActivepath", value: path });
  settingStore.changeSetting({ key: "triggerCompToTop", value: path });
}
</script>

<template>
  <ul class="nav-mian">
    <li
      class="nav-item"
      :class="{ active: activePath === item.path }"
      v-for="(item, i) in Menus"
      :key="i"
      @click="onClick(item)"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.nav-mian {
  display: flex;
  width: 100%;
  border-bottom: 1px solid var(--cp-color8);
  height: 46px;
}
.nav-item {
  animation: none !important;
  position: relative;
  font-size: 16px;
  line-height: 46px;
  min-width: 86px;
  padding: 0 10px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: inline-block;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  color: var(--cp-color300);
  font-weight: 500;
}
.nav-item.active {
  color: var(--cp-color9);
}
.nav-item.active::after {
  position: absolute;
  content: "";
  background-color: var(--cp-color9);
  width: 100%;
  height: 2px;
  bottom: -1px;
  background: #ddc57f;
  border-radius: 5px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
