<template>
  <div class="h-full">
    <div class="w-220px">
      <el-menu
        :default-active="defaultActive"
        class="!border-none rounded-12px overflow-hidden"
      >
        <el-sub-menu
          v-for="(group, i) in list"
          :key="i"
          :index="group.id"
        >
          <template #title>
            <!-- <svg-icon :icon-class="group.icon" :size="group.iconSize" /> -->
            <!-- <el-icon><QuestionFilled /></el-icon> -->
            <el-icon v-if="icon && icon.startsWith('el-icon')" class="sub-el-icon">
              <component :is="icon.replace('el-icon-', '')" />
            </el-icon>
            <svg-icon v-else-if="icon" :icon-class="icon" />
            <span>{{ group.title }}</span>
          </template>
            <el-menu-item
              v-for="(item, i) in group.children"
              :key="i"
              :index="item.title"
              @click="onClickMenu(item)"
            >
              {{ item.title }}
            </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import useLinkOpenFunc from '@/04-kk-component-admin/components/hooks/useLinkOpenFunc';
import { useUserStore } from "@/store";
import { IObject } from "@/01-kk-system/allHttp/types/common";

const userStore = useUserStore();
const router = useRouter();
const { goToPayment } = useLinkOpenFunc();

const refreshLoading = ref(false);

const props = withDefaults(defineProps<{
  list: IObject[];
  defaultActive: string;
  currentTitle?: string;
  titleKey?: string;
  contentKey?: string;
  icon?: string;
}>(), {
  defaultActive: "1",
  titleKey: "title",
  contentKey: "content",
  icon: "el-icon-question-filled",
});

const { t } = useI18n();
const emit = defineEmits<{
  "onClickMenu": [item: IObject];
}>();

function onClickMenu(item: any) {
  console.log(item)
  emit("onClickMenu", item);
}


const handleClick = (path: string) => {
  if(path === "transfor") {
    router.push({ path: "/personal/finance/wallet" });
  }  else if(path === "recharge") {
    goToPayment("deposit");
  } else if(path === "withdraw") {
    goToPayment("withdraw");
  }
};

async function onRefresh() {
  refreshLoading.value = true;
  await userStore.getUserBanlance();
  refreshLoading.value = false;
}
</script>

<style lang="scss" scoped>
.left-menu {
  font-family: PingFang SC;
  box-shadow: 0 4px 16px rgba(152,161,182,.04);
  border-radius: 12px;
  background: #ffffff;
}
.menu-item {
  position: relative;
  height: 48px;
  line-height: 48px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
}
.info-item {
  border: none;
  // box-shadow: inset 0 -.5px 0 0 rgba(132, 144, 167, 0.3);
  color: #8491a5;
}
.menu-title {
  font-family: PingFang SC;
  position: relative;
  font-weight: 500;
  z-index: 2;
  font-size: 14px;
}
.menu-item:hover .menu-content,
.menu-item .active {
  background-color: #f3fafd;
  color: #597ef7;
}
html.dark .menu-item.active {
  background-color: #1e222c;
  color: #fff;
}
.user-money {
  padding: 16px;
  position: relative;
  background-size: contain;
  background: #fff;
  // box-shadow: 0 0 6px 0 rgba(0, 0, 0, .05);
  border-radius: 12px 12px 0 0;
}
html.dark .user-money {
  background: #292e3b;
}
.money-container {
  display: flex;
  flex-basis: 20px;
  width: 182px;
  margin-top: 10px;
  border-radius: 7px;
  padding: 8px 0;
}
.icon-normal {
  opacity: 1;
  transition: all 0.3s ease;
}
.icon-active {
  opacity: 0;
  transition: all 0.3s ease;
}
.money-icon-box:hover .icon-active {
  opacity: 1;
}
.money-icon-box:hover .icon-normal {
  opacity: 0;
}
html.dark .money-container {
  background: #262933;
}
</style>
