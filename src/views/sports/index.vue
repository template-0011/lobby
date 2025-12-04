<script setup lang="ts">
import { localImg } from "@/01-kk-system/allUtils/utils";
import { GameLineTypes } from "@/01-kk-system/middleware/fusionApi/game";
import useLinkOpenFunc from '@/04-kk-component-admin/components/hooks/useLinkOpenFunc';
import { useGameStore } from "@/store/modules/game";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';

defineOptions({
  name: "SportsPage",
});

const { onClickOuterGame } = useLinkOpenFunc();

interface GameType {
  icon: string;
  activeIcon: string;
  title: string;
  subTxt: string;
  titleIcon: string;
  image: string;
}

const gameStore = useGameStore();
const currentGame = ref<GameLineTypes & GameType>({
  outerGamerAgentCode: "",
  outerGamerID: "",
  outerGamerName: "",
  outerGamerLineID: "",
  walletType: "",
  currencyCode: "",
  icon: "",
  activeIcon: "",
  title: "",
  titleIcon: "",
  subTxt: "",
  image: ""
})
const switchTag = ref(false)
const currentIndex = ref(0)

const gameTxt = [
  "真实、及时的赛事资讯和比赛情报，详尽的赛事、球队、球员数据资料。提供多种赔率模式与玩法，带给您最佳的体育投注体验！",
  "倾力打造刺激火爆的体育娱乐游戏，多种娱乐方式选择，超高游戏赔付率，每天为您提供千场精彩体育赛事。",
  "清爽界面，便捷操作，高清画质，您将置身于世界体育盛事，尽情享受比赛带来的无尽激情，确保您不错过任何精彩瞬间。",
  "线上竞技，无限可能！畅享体育游戏，精彩瞬间，尽在掌握！一起开启胜利之旅！",
  "线上体育游戏带来无尽刺激！与全球玩家实时下注，体验最真实的体育快感，赢得胜利从未如此激动人心！",
  "与全球玩家同场，尽享线上体育游戏的无限激情！实时对战，真实体验，成就巅峰荣耀。立即加入，赢得每一场胜利！",
  '业界赔率最佳、赛事最全，涵盖海量热门体育赛事，提供视频直播、专业体育数据统计，满足对体育赛事的一切需求！',
]

const sportsList = computed(() => {
  const list = gameStore.sportGameList || []
  const data = list.map((game, index) => ({
    ...game,
    icon: localImg(`custom-images/sport/sports-icon-${game.outerGamerID}.png`),
    activeIcon: localImg(`custom-images/sport/sports-icon-${game.outerGamerID}-active.png`),
    title: game.outerGamerName,
    titleIcon: localImg(`custom-images/outergameicon/title-sport-${game.outerGamerID}.png`),
    subTxt: gameTxt[index],
    image: localImg(`custom-images/sport/sports-${game.outerGamerID}.png`),
  }))
  return data
})


watch(() => sportsList.value, () => {
  if (sportsList.value?.length > 0) {
    currentGame.value = sportsList.value[0] || {}
    switchTag.value = true;
  }
});

const onSelect = (game: GameLineTypes & GameType, index: number) => {
  switchTag.value = false
  currentIndex.value = index ?? 0
  setTimeout(() => {
    currentGame.value = game
    switchTag.value = true
  }, 500);
}

const goToGame = (game: GameLineTypes & GameType) => {
  if (game) {
    onClickOuterGame(game)
  }
}

onBeforeMount(() => {
  gameStore.getAvailableOuterGames();
});
</script>

<template>
  <div class="max-w-960px flex flex-col items-center mx-auto relative py-5">
    <div v-for="item in sportsList" :key="item.outerGamerID" class="kk-sports-card w-full mt-5">
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
        <img class="absolute right-0 top-0 h-full object-contain" :src="item.image" alt="">
      </div>
    </div>
    <!-- <Transition name="sports-animation">
      <div v-if="switchTag" class="h-670px w-1200px flex justify-between mx-auto">
        <div class="relative w-612px h-634px">
            <div class="sports-top flex w-450px h-114px">
              <img class="w-full h-full object-contain" src="@/assets/custom-images/sport/sport-icon.png" alt="">
            </div>
          <div class="sports-imge absolute w-612px h-580px letf-0 bottom-0">
            <img v-if="currentGame.image" class="w-full h-full object-contain" :src="currentGame.image" alt="">
          </div>
        </div>
        <div class="relative w-450px">
            <div class="relative min-h-266px">
              <div class="sport-ani-top absolute top-0 left-0">
                <div class="w-350px h-110px max-w-full">
                  <img class="h-110px object-contain" :src="currentGame.titleIcon" alt="">
                </div>
                <p class="sports-text">{{ currentGame?.subTxt }}</p>
                <div class="w-auto h-66px">
                  <img class="h-full" src="@/assets/custom-images/sport/sport-sub-list.png" alt="">
                </div>
              </div>
            </div>
          <div class="relative text-center min-h-142px w-full group px-30px">
            <swiper
              :modules="[Navigation]"
              :initialSlide="currentIndex"
              :navigation="{enabled: true, prevEl: '.kk-swiper-button-prev', nextEl: '.kk-swiper-button-next'}"
              :slides-per-view="4"
              :space-between="10"
            >
              <swiper-slide class="kk-swiper-item cursor-pointer" v-for="(sport, index) in sportsList" :key="index+'sports'" @click="onSelect(sport, index)">
                <div :class="`sport-game-card w-90px h-104px mb-4 relative z-1 flex-center ${sport.outerGamerID === currentGame.outerGamerID ? 'sport-game-card-active' : ''}`">
                  <div class="w-52px h-52px relative">
                    <img :class="`active-logo absolute top-0 left-0 w-full object-contain ${sport.outerGamerID === currentGame.outerGamerID ? 'visible' : 'invisible'}`" :src="sport.activeIcon" alt="" />
                    <img :class="`default-logo absolute top-0 left-0 w-full object-contain ${sport.outerGamerID === currentGame.outerGamerID ? 'invisible' : 'visible'}`" :src="sport.icon" alt="" />
                  </div>
                </div>
                <p class="text-#303442 text-base leading-22px">{{ sport.title }}</p>
              </swiper-slide>
            </swiper>
            <div class="kk-swiper-button-prev hidden group-hover:flex cursor-pointer">
              <el-icon class="cursor-pointer"><ArrowLeft /></el-icon>
            </div>
            <div class="kk-swiper-button-next hidden group-hover:flex cursor-pointer">
              <el-icon class="cursor-pointer"><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="click-game-button" @click="goToGame">
            {{ $t('web.i18nFront.game.goToGame') }}
          </div>
        </div>
      </div>
    </Transition> -->
  </div>
</template>

<style lang="scss" scoped>
.kk-sports-card {
  background: linear-gradient(180.11deg, rgba(0, 0, 0, 0) 30.82%, rgba(31, 3, 80, .2) 99.91%), radial-gradient(64.3% 77.79% at 50.04% 90.29%, #4a0ab3 0%, rgba(112, 44, 246, 0) 100%), linear-gradient(123.86deg, #7572fc 6.33%, #702cf6 48.47%, #5110bc 98.95%), #7742e8;
  padding: 30px;
  height: 505px;
  border-radius: 20px;
  position: relative;
}
</style>
