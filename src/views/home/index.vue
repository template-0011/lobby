<template>
  <div class="dashboard-container mx-4 pt-3">
    <HomeTop />
    <div class="w-full mb-4 flex items-center gap-4">
      <a class="flex-1 cursor-pointer" v-for="item in [1,2,3,4]" :key="item">
        <div class="row-card-item">
          <div class="z-1">
            <p class="text-24px font-600 color-#ffffff">Sports</p>
            <p class="text-13px font-400 max-w-174px mt-3px color-#ffffff">大型锦标赛</p>
          </div>
          <div class="h-60px w-60px bg-gray-800 z-1 rounded-1 mr-4">
          </div>
        </div>
      </a>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div v-for="item in sportsList2" :key="item.outerGamerID" class="kk-sports-card w-full mt-5">
        <div class="w-full h-full flex items-center relative col-span-4">
          <div class="max-w-40%">
            <img class="w-60px h-60px object-contain" :src="item.activeIcon" alt="">
            <p class="text-16px leading-6 color-white ">
              {{ item.subTxt }}
            </p>
            <div @click="goToGame(item)" class="kk-jump-btn" style="--kk-jump-btn-bg: linear-gradient(255deg, #fac82e, #fac82e); --kk-jump-btn-text-color: #000;">
              {{ $t('web.i18nFront.game.goToGame') }}
            </div>
          </div>
          <img class="absolute right-0 top-[10%] h-[70%] object-contain" :src="item.image" alt="">
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-5">
      <!-- <HomeCardContainer>
        <template #header>
          <div class="flex items-center justify-between px-6 pt-6 pb-1">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-2 bg-gray-500"></div>
              <div class="font-700 text-32px color-#ffffff">Poker</div>
            </div>
            <div class="w-10 h-10 rounded-2 flex-center color-#1a68db text-12px font-600">
              <span>{{ $t("system.all") }}</span>
            </div>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-4 gap-4 px-6 pb-6 pt-4">
            <GameCard />
            <GameCard />
            <GameCard />
            <GameCard />
          </div>
        </template>
      </HomeCardContainer>
      <HomeCardContainer style="--notice-bar-bg: linear-gradient(90deg, rgb(141, 83, 233) 0%, rgb(0, 183, 255) 100%)">
        <template #header>
          <div class="flex items-center justify-between px-6 pt-6 pb-1">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-2 bg-gray-500"></div>
              <div class="font-700 text-32px color-#ffffff">Poker</div>
            </div>
            <div class="w-10 h-10 rounded-2 bg-gray-800"></div>
          </div>
        </template>
        <template #content>

        </template>
      </HomeCardContainer> -->
      <HomeCardContainer
        v-for="(item, index) in menusList"
        :key="item.id"
        :style="`--notice-bar-bg: ${BarColor[index as keyof typeof BarColor]}`">
        <template #header>
          <div class="flex items-center justify-between px-6 pt-5 pb-4">
            <div class="font-700 text-17px color-#ffffff">
              {{ item.title }}
            </div>
            <div class="w-10 h-10 rounded-2 flex-center color-#1a68db text-12px font-600 cursor-pointer" @click="goToPage(item)">
              <span>{{ $t("system.all") }}</span>
            </div>
          </div>
          <div class="px-6 pb-6 pt-1" v-if="item.gamerList && item.gamerList.length > 0">
            <ScrollMenu>
              <GamerMenuItem
                v-for="(gamer, idx) in item.gamerList"
                :key="`gamer + ${idx}`"
                :img-url="gamer.icon"
                :name="gamer.title"
                >
              </GamerMenuItem>
            </ScrollMenu>
          </div>
        </template>
        <template #content>
          <GameContent
            :game-list="item.children"
            :gamer-info="item.gamerList[item.gamerIndex ?? 0]"
            :full-data="item"
            :isHot="item.isHot" />
        </template>
      </HomeCardContainer>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useGameStore } from "@/store";
import { HotGame } from "./config/menuList";
import dayjs from "dayjs";
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { localImg } from "@/01-kk-system/allUtils/utils";
import { useSports } from "../sports/useSports";

defineOptions({
  name: "Home",
  inheritAttrs: false,
});

const BarColor = {
  0: 'linear-gradient(90deg, rgb(27, 241, 255) 0%, rgb(8, 85, 196) 100%)',
  1: 'linear-gradient(90deg, rgb(141, 83, 233) 0%, rgb(0, 183, 255) 100%)',
  2: 'linear-gradient(90deg, rgb(0, 183, 255) 0%, rgb(199, 0, 255) 50%, rgb(255, 187, 0) 100%)',
  3: 'linear-gradient(90deg, rgb(255, 78, 223) 0%, rgb(255, 41, 88) 100%)',
  4: 'linear-gradient(90deg, rgb(141, 83, 233) 0%, rgb(0, 183, 255) 100%)',
  5: 'linear-gradient(90deg, rgb(141, 83, 233) 0%, rgb(0, 183, 255) 100%)',
  6: 'linear-gradient(90deg, rgb(255, 78, 223) 0%, rgb(255, 41, 88) 100%)',
  7: 'linear-gradient(90deg, rgb(0, 183, 255) 0%, rgb(199, 0, 255) 50%, rgb(255, 187, 0) 100%',
}

const { t } = useI18n()

const { sportsList: sportsList2, goToGame } = useSports();

const lotteryCategoryList = ref<Record<string, any>[]>([]);
const loading = ref(false);
const lotteryLoading = ref(false);
const menusList = ref<Record<string, any>[]>([]);

const lotteryGames = ref<IObject[]>([]);

const gameStore = useGameStore();
const appStore = useAppStore();
const router = useRouter();

const sportsList = computed(() => {
  const list = gameStore.sportGameList || [];
  const data = list.map((game) => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: "Sports",
    image: localImg(`images/dropmenu/sports-${game.outerGamerID}.png`),
  }));
  return data;
});
const realBetList = computed(() => {
  const list = gameStore.liveGameList || [];
  const data = list.map((game) => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: "Live",
    image: localImg(`images/dropmenu/live-${game.outerGamerID}.png`),
  }));
  return data;
});
const chessList = computed(() => {
  const list = gameStore.chessGameList || [];
  const data = list.map((game) => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: "Live",
    image: localImg(`images/dropmenu/chess-${game.outerGamerID}.png`),
  }));
  return data;
});
const fishList = computed(() => {
  const list = gameStore.fishGameList || [];
  const data = list.map((game) => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: "fish",
    image: localImg(`images/dropmenu/fish-${game.outerGamerID}.png`),
  }));
  return data;
});
const egameList = computed(() => {
  const list = gameStore.eGameList || [];
  const data = list.map((game) => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: "Live",
    image: localImg(`images/dropmenu/slot-${game.outerGamerID}.png`),
  }));
  return data;
});

const menus = computed(() => {
  const groupList = gameStore.allGroups || []
  console.log("groupList", groupList);
  return [
    ...groupList,
    {
      title: t('web.i18nFront.title.egame'),
      id: 7,
      route: '/games',
      routeName: 'EGame',
      isHot: false,
      children: [],
      gamerList: egameList.value,
      gamerIndex: 0,
      type: "egame"
    },
    {
      title: t('web.i18nFront.title.fish'),
      id: 6,
      route: '/games',
      routeName: 'Fish',
      isHot: false,
      children: [],
      gamerList: fishList.value,
      gamerIndex: 2,
      type: "fish"
    },
    {
      title: t('web.i18nFront.title.lottery'),
      id: 2,
      route: '/games',
      routeName: 'GamesLobby',
      isHot: false,
      children: [],
      gamerList: lotteryCategoryList.value,
      gamerIndex: 0,
      type: "lottery"
    },
    {
      title: t('web.i18nFront.title.sports'),
      id: 3,
      route: '/sports',
      routeName: 'Sports',
      isHot: false,
      children: [],
      gamerList: sportsList.value,
      gamerIndex: 2,
      type: "sports"
    },
    {
      title: t('web.i18nFront.title.realbet'),
      id: 4,
      route: '/games',
      routeName: 'Realbet',
      isHot: false,
      children: [],
      gamerList: realBetList.value,
      gamerIndex: 0,
      type: "realbet"
    },
    {
      title: t('web.i18nFront.title.chess'),
      id: 5,
      route: '/games',
      routeName: 'Chess',
      isHot: false,
      children: [],
      gamerList: chessList.value,
      gamerIndex: 0,
      type: "chess"
    },
  ]
})

const init = async () => {
  const lotteryCate = (await gameStore.getFullSeries()) as unknown as Record<
    string,
    any
  >[];
  lotteryCategoryList.value = lotteryCate.map((item) => {
    const country = item.country?.toLowerCase() || '';
    const icon = localImg(`custom-images/lottery-icon/${country}-${item.lottoClassify}.png`);
    return {
      ...item,
      icon: icon.includes('undefined') ? item.logo : icon,
      title: item.name,
      subTitle: '',
    }
  });
  menusList.value = menus.value
};

function goToPage(item: Record<string, any>) {
  console.log('==item==', item);
  if (item.type !== 'group') {
    router.push({
      path: item.route,
      query: {
        t: item.type,
      }
    })
  } else {
    router.push({
      path: item.route,
    })
  }
}

// 去全部彩票页面
function goToLotteryMenu() {
  router.push({ path: "/games-lobby" });
}

onBeforeMount(() => {
  init()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  background-color: var(--kk-body-bg-color);
  background-repeat: repeat;
  background-position: top;
  background-size: 1920px 1772px;
  padding-bottom: 100px;
}
:deep(.el-carousel__button) {
  background-color: #567cf8;
}
.row-card-item {
  @apply h-75px w-full rounded-3 flex items-center justify-between select-none pl-6 relative;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    z-index: 0;
    background-image: linear-gradient(110deg, #1e283f, rgba(20, 27, 46, .6) 100%);
    opacity: .7;
    transition: opacity .15s ease-in-out;
    z-index: 0;
  }
  &:hover {
    &::before {
      opacity: 1;
    }
  }
}


.notice {
  background: url('@/assets/images/home/home_notice_bg.png');
  background-size: cover;
  margin-top: 10px;
  height: 82px;
  border-radius: unset;
  border: unset;
  padding: 0 32px 37px;
  margin-bottom: 30px;
}
.home-main {
  background: url('@/assets/images/home/main-background.png');
  background-repeat: repeat;
  background-position: top;
  background-size: 1920px 1772px;
}

.left,
.right {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  height: 165px;
  overflow: hidden;
  background-color: var(--cp-color1);
  border-radius: 10px;
}

.item-desc {
  font-size: 14px;
  line-height: 28px;
  color: var(--cp-color2);
}

.item-title {
  padding: 6px 12px;
  width: 142px;
  height: 38px;
  background-color: var(--cp-color3);
  border-radius: 100px;
  font-size: 15px;
  line-height: 26px;
  text-align: center;
  color: var(--cp-color4);
}

.kk-sports-card {
  background: linear-gradient(180.11deg, rgba(0, 0, 0, 0) 30.82%, rgba(31, 3, 80, .2) 99.91%), radial-gradient(64.3% 77.79% at 50.04% 90.29%, #4a0ab3 0%, rgba(112, 44, 246, 0) 100%), linear-gradient(123.86deg, #7572fc 6.33%, #702cf6 48.47%, #5110bc 98.95%), #7742e8;
  padding: 30px;
  height: 505px;
  border-radius: 20px;
  position: relative;
}
</style>
