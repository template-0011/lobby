<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils';
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import useLinkOpenFunc from '@/04-kk-component-admin/components/hooks/useLinkOpenFunc';
import { useGoGameRoom } from '@/hooks/useGoGameRoom';

defineOptions({
  name: "OuterGameCard",
});

const { onClickOuterSubGame, onClickClassiGame } = useLinkOpenFunc();

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  type: {
    type: String,
    default: 'outer', // outer / lottery
  }
})

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

const { goToGameRoom } = useGoGameRoom()
async function onClickCard(item: Record<string, any>) {
  let url = ''
  if (props.type === 'outer') {
    url = await onClickOuterSubGame(item, true)
  } else {
    url = await onClickClassiGame(item, true) as string
  }
  goToGameRoom(item, encodeURIComponent(url || ''))
}
</script>

<template>
  <div class="list-card">
    <div class="card-top">
      <img class="w-full" :src="getImage(item)" alt="">
    </div>
    <div class="card-bottom text-one-line">{{ item.subgameDes || item.lottoName }}</div>
    <div class="card-cover">
      <el-button @click="onClickCard(item)" type="primary">{{ $t('web.i18nFront.label.startGame') }}</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.list-card {
  position: relative;
  width: 211px;
  height: 260px;
  margin: 0;
  border: none;
  box-shadow: 0 4px 8px rgba(136, 149, 205, .2);
  border-radius: 12px;
  overflow: hidden;
  background-color: #141b2f;
  margin-bottom: 20px;
}

.card-top {
  height: 214px;
  width: 214px;
  position: relative;
  z-index: 2;
  left: -1px;
  top: -1px;
  overflow: hidden;
  background: #cbced8;
}
.card-bottom {
  color: #ffffff;
  height: 48px;
  line-height: 48px;
  width: 100%;
  font-size: 14px;
  padding: 0 12px;
  overflow: hidden;
  font-weight: 500;
}
.card-cover {
  position: absolute;
  text-align: center;
  width: 100%;
  z-index: 10;
  line-height: 214px;
  height: 214px;
  top: -214px;
  background-color: rgba(0, 0, 0, .5);
  transition: all .5s;
  text-align: center;
  display: block;

}
.list-card:hover .card-cover {
  top: 0;
}
</style>
