<template>
  <div class="w-full">
    <NavBar />
    <!-- body -->
    <div class="relative w-full app-body">
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";

const appStore = useAppStore();

const isOpenSidebar = computed(() => appStore.sidebar.opened);
</script>

<style lang="scss" scoped>
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
</style>
