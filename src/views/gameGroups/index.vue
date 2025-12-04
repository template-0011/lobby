<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { gameGroupHttp, outerGameHttp } from "@/01-kk-system/allHttp/userHall/games";
import { generateRandomInteger, localImg } from "@/01-kk-system/allUtils/utils";
import { useGameStore } from "@/store/modules/game";

defineOptions({
  name: "GameGroups",
});

const route = useRoute();
// const loading = ref(false)
const gameStore = useGameStore();

const testNum = ref(234598643);
const currentList = ref<IObject[]>([])
const bannerImg = ref(localImg('images/egame/slot-bg.webp'))
const loading = ref(false)

watchEffect(() => {
  const groupList = gameStore.allGroups || []
  const groupID = route.params?.groupId
  const target = groupList.find(group => group.id == groupID)
  currentList.value = target?.children ?? []
  const banner = localImg(`images/group/banner${target?.index}.png`)
  if (!banner.includes('undefined')) {
    bannerImg.value = banner
  }
})

const init = async () => {
  window.setInterval(() => {
    const random = generateRandomInteger(10, 3000)
    testNum.value += random
  }, 4000)
}

const onsearchRequest = async (searchText: string) => {
  try {
    loading.value = true
    const groupID = route.params?.groupId
    const res = await gameGroupHttp.groupGames({ groupID, gameName: searchText })
    const list = res?.data ?? []
    currentList.value = list.map(group => group.gameDetailJson)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const onSearch = async (searchText: string) => {
  if (searchText) {
    onsearchRequest(searchText)
  } else {
    const groupList = gameStore.allGroups || []
    const groupID = route.params?.groupId
    const target = groupList.find(group => group.id == groupID)
    currentList.value = target?.children ?? []
  }
}

onBeforeMount(() => {
  init()
})
</script>

<template>
  <div class="app-container pb-25 bg-[var(--kk-body-bg-color)]">
    <div class="h-420px w-auto min-w-1200px relative mx-4">
      <img class="h-full w-full object-cover" :src="bannerImg" alt="">
      <div class="absolute bottom-67px fish-number flex-center w-full">
        <RunNumber :num="testNum" />
      </div>
    </div>
    <SubGameList
      type="outer"
      :loading="loading"
      :gameList="currentList"
      :is-show-more="false"
      @onSearch="onSearch"
    />
    </div>
</template>
<style scoped>
.fish-number {
  z-index: 99;
}
</style>
