<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils';
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import useLinkOpenFunc from '@/04-kk-component-admin/components/hooks/useLinkOpenFunc';
import debounce from 'lodash-es/debounce';
import { useGameStore } from '@/store';

defineOptions({
  name: "OuterGameCard",
});

const { onClickOuterSubGame, onClickClassiGame } = useLinkOpenFunc();

const props = defineProps({
  selectedGame: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  type: {
    type: String,
    default: 'outer', // outer / lottery
  },
  menuList: {
    type: Array as PropType<IObject[]>,
    default: () => [],
  }
})

const emit = defineEmits(['onSearch', 'onCollection', 'onSelect'])

const gameStore = useGameStore();

const isCollect = ref(false)
const searchValue = ref('')

function getLotteryImage(info: Record<string, any>) {
  const { lottoClassifyCountry, lottoClassify, lottoID } = info || {}
  const countryCode = lottoClassifyCountry ? lottoClassifyCountry.toLowerCase() : ''
  const lottoClassifyImg = localImg(`custom-images/lottery/${countryCode}-${lottoClassify}.png`)
  if (lottoID) {
    const lotteryImg = localImg(`custom-images/lottery-games/${countryCode}-${lottoClassify}-${lottoID}.png`)
    return lotteryImg.includes('undefined') ? lottoClassifyImg : lotteryImg
  } else {
    return lottoClassifyImg
  }
}

const contentCategoryObj = {
  1001: 'lottery',
  1002: 'chess',
  1003: 'slot',
  1004: 'fish',
  1005: 'live',
  1006: 'sport',
  1007: 'vSport',
  1008: 'eSport',
}
function getOuterImage(game: IObject) {
  const { outerGamerID, subgameCode, contentCategory } = game || {}
  // @ts-ignore
  if (contentCategoryObj[contentCategory]) {
     // @ts-ignore
    const path = `${contentCategoryObj[contentCategory]}-subgame`
    const subCode = subgameCode?.toLowerCase()
    const imagepath = localImg(`custom-images/${path}/${outerGamerID}-${subCode}.jpg`)
    if (imagepath.includes('undefined')) {
      return localImg(`custom-images/${path}/${outerGamerID}-${subCode}.png`)
    } else {
      return imagepath
    }
  }
}

function getImage(info: Record<string, any>) {
  if (props.type === 'outer') {
    return getOuterImage(info)
  } else {
    return getLotteryImage(info)
  }
}

function onClickCard(item: Record<string, any>) {
  if (props.type === 'outer') {
    onClickOuterSubGame(item)
  } else {
    onClickClassiGame(item)
  }
}

function onClickCollection() {
  isCollect.value = !isCollect.value
  emit("onCollection", isCollect.value)
}

function onInput() {
  emit("onSearch", searchValue.value)
}
const debounceInput = debounce(onInput, 500, { leading: false, trailing: true })


const onSelect = (game: IObject) => {
  isCollect.value = false
  searchValue.value = ""
  emit('onSelect', game)
}
</script>

<template>
  <aside class="kk-game-sidebar">
    <div class="flex flex-col max-h-full h-full">
      <section class="kk-game-s-body h-full">
        <header class="flex m-4 shrink-0 gap-2">
          <div class="flex items-center flex-1 h-9 rounded-2 relative bg-#1f2941">
            <el-icon size="17px" class="color-#7388b6 ml-2"><Search /></el-icon>
            <input
              v-model="searchValue"
              type="text"
              @input="debounceInput"
              class="flex-1 h-full rounded-2 bg-transparent border-none outline-none text-14px color-#7388b6 pl-2"
              :placeholder="$t('web.i18nFront.title.search')">
          </div>
          <div class="kk-collect-c" :class="{ 'cc-active': isCollect }" @click="onClickCollection">
            <svg-icon icon-class="icon-star" size="18px" />
          </div>
        </header>
        <main class="flex-1 mb-4 max-h-full overflow-x-hidden overflow-y-auto">
          <h2 class="kk-game-category">提供商</h2>
          <div class="mt-1 px-3px pt-5px" v-if="menuList.length">
            <SideMenuItem
              v-for="item in menuList"
              :key="item.outerGamerID"
              :game="item"
              :is-select="!isCollect && (item.lottoClassify ? item.name === selectedGame.name : item.outerGamerID === selectedGame.outerGamerID)"
              @onSelect="onSelect"
            />
          </div>
        </main>
      </section>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.kk-game-sidebar {
  position: sticky;
  top: 62px;
  flex: none;
  margin: 15px 0 15px 15px;
  width: 270px;
  height: calc(100vh - 77px);
}
.kk-game-s-body {
  background-color: #141b2f;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.kk-collect-c {
  @apply w-9 h-9 rounded-2 color-#ffd031 flex-center bg-[#ffd0311a] cursor-pointer;
}
.kk-collect-c.cc-active {
  @apply bg-[#ffd031] color-#141b2f;
}
.kk-game-category {
  color: #7388b6;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -.12px;
  margin: 0 15px;
  opacity: .3;
  text-transform: uppercase;
}
</style>
