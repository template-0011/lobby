<template>
  <section class="app-main flex-1">
    <div class="mx-auto my-0">
      <router-view>
        <template #default="{ Component, route }">
          <transition name="fade-page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </template>
      </router-view>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  position: relative;
  height: calc(100% - $navbar-height);
  background-color: var(--kk-body-bg-color);
}
/* fade-transform */
.fade-page-leave-active,
.fade-page-enter-active {
  transition: all 0.5s;
}

.fade-page-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
