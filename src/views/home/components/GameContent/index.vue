<template>
  <div v-loading="loading" class="grid grid-cols-4 gap-4 px-6 pb-6 min-h-150px grow-1">
    <template v-if="currentList.length > 0">
      <GameCard
        v-for="(item, index) in currentList"
        :key="`game-card-${index}`"
        :item="item"
        :type="item.contentCategory ? 'outer' : 'lottery'" />
    </template>
    <template v-else>
      <div class="w-full h-full flex items-center relative col-span-4">
        <div class="">
          <p class="text-16px leading-6 color-white">进来吧，玩游戏并赢取奖金</p>
          <div class="kk-jump-btn" @click="goSports">
            获得奖金
          </div>
        </div>
        <img class="absolute right-0 top-0 h-full object-contain" src="@/assets/custom-images/sport/sports-1011.png" alt="">
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { outerGameHttp } from "@/01-kk-system/allHttp/userHall/games";
import { useAppStore, useGameStore } from "@/store";

defineOptions({
  name: "KKGameContent",
});

const props = defineProps({
  fullData: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
    required: false,
  },
});

const loading = ref(false)
const currentList = ref<Record<string, any>[]>([])

const appStore = useAppStore();
const gameStore = useGameStore();
const router = useRouter();

const goSports = () => {
  router.push('/sports')
}

async function fetchGameList(game: Record<string, any>) {
  try {
    loading.value = true
    const { outerGamerAgentCode, outerGamerID, contentCategory } = game || {}
    const params = {
      outerGamerAgentCode,
      outerGamerID,
      contentCategory,
      current: 1,
      size: 8,
    }
    const { data } = await outerGameHttp.fetchSubGamePage(params)
    const { recordList } = data || {}
    currentList.value = recordList || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getLotteryList = async () => {
  const cateList = await gameStore.getAllSeriesAndGamesList();
  const gameList = cateList[0].children || []
  currentList.value = gameList.slice(0, 8)
}

onBeforeMount(() => {
  const { children, gamerList, gamerIndex, type } = props.fullData || {}
  const gamerInfo = gamerList[gamerIndex ?? 0]
  if (children && children.length > 0) {
    currentList.value = children
  } else if(type !== "sports" && gamerInfo && gamerInfo.contentCategory) {
    fetchGameList(gamerInfo)
  } else if(type === "lottery") {
    getLotteryList()
  }
});
</script>

<style lang="scss" scoped>
.home-top-container {
  --home__header-carousel-width: 840;
  --home__header-carousel-height: 320;
  --home__header-base-width: 1410;
  margin-bottom: 15px;
  padding-bottom: calc(100% / (var(--home__header-base-width) / var(--home__header-carousel-height)));
  position: relative;
}

</style>
