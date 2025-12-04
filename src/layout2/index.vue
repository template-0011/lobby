<template>
  <div class="wh-full min-h-full">
    <NavBar />
    <!-- body -->
    <div class="app-main">
      <div class="w-1200px min-h-full flex mx-auto mt-24px">
        <!-- menu -->
        <PersonalMenu />
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
      <Footer />
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
  overflow-x: hidden;
  background: #f3f6fc;
  margin: 0 16px;
}
.content-box {
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
