<template>
  <a
    href="javascript:void(0)"
    class="menu-item relative flex-center flex-col w-94px h-68px overflow-hidden cursor-pointer rounded-10px decoration-none hover:text-[var(--cp-color46)]"
    :class="{ active: item.path === activePath }"
    @click="onClickItem"
  >
    <div class="w-9 h-30px flex flex-center">
      <svg-icon
        :icon-class="item.icon"
        :size="item.size"
        class="w-6 h-6 transition"
      />
    </div>
    <p class="transition text-14px">
      {{ item.title }}
    </p>
  </a>
</template>
<script setup lang="ts">
import { useSettingsStore } from "@/store/modules/settings";

defineOptions({
  name: "SidebarMenuItem",
  inheritAttrs: false,
});
const settingStore = useSettingsStore();
const activePath = computed(() => settingStore.homeActivepath);
const route = useRoute();
const router = useRouter();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});

const emit = defineEmits<{
  onClick: [data: any];
}>();

const onClickItem = () => {
  let time = 0;
  if (route.path !== "/home") {
    router.replace("/home");
    time = 1000;
  }
  setTimeout(() => {
    settingStore.changeSetting({
      key: "homeActivepath",
      value: props.item.path,
    });
    settingStore.changeSetting({
      key: "triggerCompToTop",
      value: props.item.path,
    });
  }, time);
  // console.log("onClickItem");
  // settingStore.changeSetting({ key: "homeActivepath", value: props.item.path });
  // settingStore.changeSetting({
  //   key: "triggerCompToTop",
  //   value: props.item.path,
  // });
};
</script>

<style lang="scss" scoped>
.menu-item {
  background: linear-gradient(var(--cp-color69), var(--cp-color70));
  color: #ffffff;
  // background: var(--cp-color70);
}
.menu-item.active {
  color: var(--cp-color46);
}
.menu-item.active::after,
.menu-item:hover::after {
  background-color: var(--cp-color46);
}
.menu-item::after {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  content: " ";
  height: 4px;
  background-color: var(--cp-color45);
  transition: 0.25s linear;
}
</style>
