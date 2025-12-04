<script setup lang="ts">
import { LOCAL_FAVORITE_GAMES } from "@/01-kk-system/allDefine/common/const";
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { outerGameHttp } from "@/01-kk-system/allHttp/userHall/games";
import { useGameCollectionStore, useGameStore } from "@/store";

type GameType = 'egame' | 'lottery' | 'fish' | 'sports' | 'realbet' | 'chess' | ''

const gameStore = useGameStore();
const gameCollectionStore = useGameCollectionStore()
const route = useRoute();
const mainRef = ref<HTMLDivElement>()
const isShowCollect = ref(false)

const useSideMenu = () => {
  const loading = ref(false);
  const finished = ref(false);
  const currentGameType = ref<GameType>('egame')
  const currentGameMenu = ref<IObject[]>([])
  const currentGameList = ref<IObject[]>([])
  const selectedMenu = ref<IObject>({})
  const searchText = ref<string>('')

  const pagination = ref({
    pageNum: 1,
    pageSize: 20,
    totalPages: 0,
  })

  const scrollTop = () => {
    const appBody = document.querySelector('body')
    if (appBody) {
      appBody.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  // const fishGame = computed(() => gameStore.allSubGameEntrance?.fish || [])
  const getSideMenuList = async () => {
    switch (currentGameType.value) {
      case 'egame':
        currentGameMenu.value = gameStore.allSubGameEntrance?.egame || []
        break
      case 'lottery':
        currentGameMenu.value = gameStore.allSubGameEntrance?.lottery || []
        break
      case 'fish':
        currentGameMenu.value = gameStore.allSubGameEntrance?.fish || []
        break
      case 'sports':
        currentGameMenu.value = gameStore.allSubGameEntrance?.sports || []
        break
      case 'realbet':
        currentGameMenu.value = gameStore.allSubGameEntrance?.realbet || []
        break
      case 'chess':
        currentGameMenu.value = gameStore.allSubGameEntrance?.chess || []
        break
      default:
        currentGameMenu.value = []
        break
    }
  }

  const getOuterGameList = async (game: IObject) => {
  try {
    loading.value = true

    const { outerGamerAgentCode, outerGamerID, contentCategory } = game || {}
    const params = {
      outerGamerAgentCode,
      outerGamerID,
      contentCategory,
      current: pagination.value.pageNum,
      size: pagination.value.pageSize,
    }
    const combParams = searchText.value ? { ...params, subgameDes: searchText.value } : params
    const { data } = await outerGameHttp.fetchSubGamePage(combParams)
    const { recordList, total, current, pages } = data || {}
    pagination.value.totalPages = Number(total || 0)
    if (current === "1") {
      currentGameList.value = recordList || []
    } else {
      currentGameList.value = [...currentGameList.value, ...recordList]
    }
    finished.value = current === pages
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function refreshGameList() {
  pagination.value.pageNum = 1
  getOuterGameList(selectedMenu.value)
  scrollTop()
}

function loadMore() {
  if (finished.value || loading.value) return
  console.log('loadMore')
  pagination.value.pageNum++
  getOuterGameList(selectedMenu.value)
}

async function getLotteryList() {
  loading.value = true;
  currentGameMenu.value = await gameStore.getAllSeriesAndGamesList();
  selectedMenu.value = currentGameMenu.value[0] || {}
  currentGameList.value = selectedMenu.value.children || []
  finished.value = true
  loading.value = false;
}

  return {
    loading,
    finished,
    searchText,
    selectedMenu,
    currentGameType,
    currentGameMenu,
    currentGameList,
    getSideMenuList,
    refreshGameList,
    loadMore,
    getLotteryList
  }
}

const { getSideMenuList, refreshGameList, loadMore, loading, searchText, finished, currentGameType, currentGameMenu, currentGameList, selectedMenu, getLotteryList } = useSideMenu()

async function onclick(game: IObject) {
  loading.value = true
  // currentGameMenu.value = await getSideMenuList()
  loading.value = false
}

async function init() {
  currentGameList.value = []
  selectedMenu.value = {}
  currentGameMenu.value = []

  if (currentGameType.value !== 'lottery') {
    await getSideMenuList()
    selectedMenu.value = currentGameMenu.value[0]
    refreshGameList()
  } else {
    getLotteryList()
  }
}

const onSelect = (game: IObject) => {
  console.log('onSelect', game)
  selectedMenu.value = game
  currentGameList.value = []
  searchText.value = ''
  if (game.lottoClassify) {
    currentGameList.value = game.children || []
  } else {
    refreshGameList()
  }
}

const onSearch = (text: string) => {
  if (currentGameType.value === 'lottery') {
    currentGameList.value = []
    const newList = selectedMenu.value.children.filter((item: { lottoName: string }) => item.lottoName.includes(text))
    currentGameList.value = newList
  } else {
    searchText.value = text
    currentGameList.value = []
    refreshGameList()
  }
}

const collectGameList = computed(() => gameCollectionStore.favoriteGames)

let tempGameList: IObject[] = []
const onCollection = (isCollect: boolean) => {
  console.log('isCollect', isCollect)
  isShowCollect.value = isCollect
  if (isCollect) {
    tempGameList = [...currentGameList.value]
    gameCollectionStore.getLocalCollections()
    currentGameList.value = collectGameList.value ?? []
  } else {
    currentGameList.value = [...tempGameList]
  }
}

watch(() => route.query, (newVal) => {
  if (newVal.t) {
    currentGameType.value = newVal.t as GameType
    init()
  }
})

// store 数据初始化
const initData = async () => {
  await Promise.allSettled([
    gameStore.getAvailableOuterSubGamesEntry(),
    gameStore.getAllSeriesAndGamesList(),
  ])
  // init list
  currentGameType.value = route.query.t as GameType ?? ''
  init()
}

onBeforeMount(() => {
  initData()
})
</script>

<template>
  <div class="flex bg-[var(--kk-body-bg-color)] select-none">
    <GameSideBar
      :menu-list="currentGameMenu"
      :selected-game="selectedMenu"
      @onSelect="onSelect"
      @onSearch="onSearch"
      @onCollection="onCollection" />
    <main ref="mainRef" class="flex flex-col grow-1 overflow-y-auto pt-4 px-4">
      <div class="min-h-[calc(100vh-120px)]">
        <div class="w-full py-4 color-white font-600 text-6">
          {{ selectedMenu?.outerGamerName || selectedMenu?.name }}
        </div>
        <div v-if="currentGameList.length > 0" class="grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
          <GameCard
            v-for="(item, index) in currentGameList"
            :key="`game-card-${index}`"
            :item="item"
            :type="item.contentCategory ? 'outer' : 'lottery'" />
        </div>
        <div v-else class="flex justify-center h-full w-full">
          <div v-if="loading" class="flex-center flex-col gap-2 color-white">
            <KKLoading />
            <p>{{ '加载中...' }}</p>
          </div>
          <el-empty class="kk-dark" v-else description="暂无数据" />
        </div>
      </div>
      <ScrollLoadMore v-if="currentGameList.length > 0"  :finished="finished || isShowCollect" @loadMore="loadMore" />
    </main>
  </div>
</template>

<style lang="scss" scoped>

.game-list-box {
  margin-top: 20px;
  min-height: 600px;
  -webkit-flex-flow: column nowrap;
  flex-flow: column nowrap;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-align-items: center;
  align-items: center;
  position: relative;
}

.list-container {
  width: 100%;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  gap: 0 16px;
}

</style>
