<template>
  <div class="wh-full overflow-hidden bg-[var(--kk-body-bg-color)] flex">
    <!-- body -->
    <div class="relative w-full h-full flex app-body">
      <div class="app-main">
        <div class="w-1400px min-h-full flex mx-auto mt-24px">
          <!-- menu -->
          <SideMenu />
          <!-- body -->
          <section class="content-box flex-1 w-0 min-h-full">
            <router-view>
              <template #default="{ Component, route }">
                <transition name="ease-width" mode="out-in">
                  <component :is="Component" :key="route.path" />
                </transition>
              </template>
            </router-view>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";

const appStore = useAppStore();

const isOpenSidebar = computed(() => appStore.sidebar.opened);
</script>

<style lang="scss" scoped>
.app-body {
  background-size: 100%;
}
.app-main {
  position: relative;
  height: calc(100% - $navbar-height);
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  background: #f3f6fc;
}
.sidebar-box {
  flex-shrink: 0;
  width: $sidebar-width;
  background-color: $menu-background;
}
.sidebar-container {
  position: fixed;
  left: 0;
  top: $navbar-height;
  bottom: 0;
  z-index: 99;
  width: $sidebar-width;
  background-color: $menu-background;
  transition: width 0.28s;
}
.content-box {
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(152,161,182,.04);
  box-sizing: border-box;
  margin-left: 0px;
  margin-bottom: 10px;
  margin-bottom: 36px;
  border-radius: 12px;
}
html.dark .content-box {
  background-color: #292e3b;
}
</style>
