<template>
  <ul class="kk-top-menu h-full w-full overflow-x-auto flex items-center justify-start text-13px color-white">
    <li class="relative h-full px-2 flex-center cursor-pointer" ref="menuRefs" v-for="menu in menus" :key="menu.id" @click="onClickMenu(menu)">
      <div :class="`top-menu relative h-full flex-center ${ (currentType === menu.type || `${menu.routeName}` === `${groupID}`) ? 'active' : '' }`">
        <div class="relative title">{{ menu.title }}</div>
      </div>
    </li>
    <div class="scroll-view" :style="scrollViewStyle">
      <div class="w-full h-full relative flex flex-col justify-end">
        <div class="scroll-view-item"></div>
      </div>
    </div>
  </ul>
</template>

<script lang="ts" setup>
import { IObject } from '@/01-kk-system/allHttp/types/common';
import { useGameStore } from '@/store';

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore();

const menuRefs = ref<HTMLElement[]>([])
const activeIndex = ref(-1)

const currentType = computed(() => route.query.t)

// 计算滚动指示器的样式
const scrollViewStyle = computed(() => {
  if (activeIndex.value === -1) return {
    width: '0px'
  }
  const activeMenu = menuRefs.value[activeIndex.value]
  if (!activeMenu) return {}

  const { left, width } = activeMenu.getBoundingClientRect()
  const parentLeft = activeMenu.parentElement?.getBoundingClientRect().left || 0
  return {
    transform: `translateX(${left - parentLeft}px)`,
    width: `${width}px`
  }
})

const groupID = computed(() => route.params?.groupId as unknown as string)

const menus = computed(() => {
  const groupList = gameStore.allGroups || []
  return [
    {
      title: t('web.i18nFront.label.home'),
      id: 1,
      route: '/home',
      routeName: 'Home',
      css: '',
      type: 'home',
      isHot: false,
      children: null,
    },
    ...groupList,
    {
      title: t('web.i18nFront.title.egame'),
      id: 7,
      route: '/games',
      routeName: 'EGame',
      type: 'egame',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.fish'),
      id: 6,
      route: '/games',
      routeName: 'Fish',
      type: 'fish',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.lottery'),
      id: 2,
      route: '/games',
      routeName: 'GamesLobby',
      type: 'lottery',
      isHot: true,
    },
    {
      title: t('web.i18nFront.title.sports'),
      id: 3,
      route: '/sports',
      routeName: 'Sports',
      isHot: false,
      type: 'sports',
      children: null,
    },
    {
      title: t('web.i18nFront.title.realbet'),
      id: 4,
      route: '/games',
      routeName: 'Realbet',
      type: 'realbet',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.chess'),
      id: 5,
      route: '/games',
      routeName: 'chess',
      type: 'chess',
      isHot: false,
      children: null,
    },
  ]
})

// 更新当前选中的菜单索引
const updateActiveIndex = (menu: any) => {
  const index = menus.value.findIndex(m => m.id === menu.id)
  // if (index !== -1) {
  activeIndex.value = index
  // }
}

const onClickMenu = (menu: IObject) => {
  if (menu.type !== 'group' && menu.type !== 'home') {
    router.push({
      path: menu.route,
      query: {
        t: menu.type,
      }
    })
  } else {
    router.push(menu.route)
  }
  updateActiveIndex(menu)
}

const getCurrentMenu = () => {
  console.log(route.path)
  let index = -1
  if (route.path === '/games') {
    index = menus.value.findIndex(menu => menu.type === currentType.value)
  } else if (route.path === '/home') {
    index = menus.value.findIndex(menu => route.path === menu.route)
  } else if (route.path?.includes('/group') ) {
    index = menus.value.findIndex(menu => `${menu.routeName}` === `${groupID.value}`)
  }
  return index !== -1 ? menus.value[index] : null
}

watch(route, (newVal) => {
  const menu = getCurrentMenu()
  if (menu) {
    updateActiveIndex(menu)
  }
})

// 组件挂载时初始化选中状态
onMounted(() => {
  const menu = getCurrentMenu()
  if (menu) {
    updateActiveIndex(menu)
  }
})
</script>

<style lang="scss" scoped>
.kk-top-menu {
  margin: 0 auto;
}
.top-menu {
  transition: all 0.2s;
  white-space: nowrap;
}
.active {
  font-weight: 600;
}

.scroll-view {
  @apply absolute top-0 left-0 h-full user-select-none pointer-events-none;
  width: var(--kk-top-menu-width, 100px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left top;
}
.scroll-view-item {
  background-image: linear-gradient(103deg, #108de7 -30%, #0855c4 100%);
  border-radius: 4px 4px 0 0;
  height: 4px;
  width: 100%;
}
</style>
