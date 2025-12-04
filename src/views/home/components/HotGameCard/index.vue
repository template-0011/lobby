<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils';

defineOptions({
  name: "HotGameCard",
});

defineProps({
  item: {
    type: Object as any,
    required: true,
    default: () =>({})
  },
  type: String
})

const emit = defineEmits<{
  onClick: [data: any]
}>()

function getImage(info: Record<string, any>) {
  const { country, lottoClassify, lottoID } = info || {}
  const countryCode = country ? country.toLowerCase() : ''
  const lottoClassifyImg = localImg(`custom-images/lottery/${countryCode}-${lottoClassify}.png`)
  if (lottoID) {
    const lotteryImg = localImg(`custom-images/lottery-games/${countryCode}-${lottoClassify}-${lottoID}.png`)
    return lotteryImg.includes('undefined') ? lottoClassifyImg : lotteryImg
  } else {
    return lottoClassifyImg
  }
}

</script>

<template>
  <div v-if="type === 'cate'" class="hot-game-card1">
    <div class="flex justify-between gap-15px">
      <div class="image-wrapper2 overflow-hidden">
        <img class="object-cover w-full h-full" :src="getImage(item)" alt="">
      </div>
      <div class="flex-1 flex flex-col my-5">
        <div class="lottery-name">
          <span>{{ item.name }}</span>
        </div>
        <div class="flex items-center justify-between mr-6 flex-1">
          <KKButton style="--kk-btn-bg-color-start: #7146ff;--kk-btn-bg-color-end:#597ef7;" :title="$t('web.i18nFront.game.betGame')" @onClick="emit('onClick', item)" />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="hot-game-card">
    <div class="flex justify-between gap-15px my-5px">
      <div class="image-wrapper overflow-hidden">
        <img class="object-contain w-full" :src="getImage(item)" alt="">
      </div>
      <div class="flex-1">
        <div class="lottery-name">
          <span>{{ item.gameName }}</span>
        </div>
        <div class="h-55px flex-center gap-2">
        <div
          v-for="(num, idx) in item.lastLuckyNumberArr" :key="`${idx}-num`"
          class="lottery-ball flex-center text-14px"
        >
          <span>{{ num }}</span>
        </div>
      </div>
      </div>
    </div>
    <div class="flex items-center justify-between mr-6">
      <p class="text-14px color-[var(--text-gray-color)]">
        {{ item.currentIssueCode }}
      </p>
      <div class="conutdown-wrapper px-4 color-#fff">
        <span>00</span>
        <span>:</span>
        <span>00</span>
        <span>:</span>
        <span>00</span>
      </div>
      <KKButton style="--kk-btn-bg-color-start: #7146ff;--kk-btn-bg-color-end:#597ef7;" :title="$t('web.i18nFront.game.onBet')" @onClick="emit('onClick', item)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hot-game-card1 {
  box-shadow: transparent 0px 0px 0px 0px, rgba(0, 0, 0, 0.11) 0px -1px 3px 0px inset, rgba(0, 0, 0, 0.12) 0px 0px 8px 0px;
  position: relative;
  height: 179px;
  background: rgb(255, 255, 255);
  border-radius: 16px;
  flex: 0 1 32%;
  margin: 10px 0px 0px;
  padding: 0;
  overflow: hidden;
}
.hot-game-card {
  box-shadow: transparent 0px 0px 0px 0px, rgba(0, 0, 0, 0.11) 0px -1px 3px 0px inset, rgba(0, 0, 0, 0.12) 0px 0px 8px 0px;
  position: relative;
  height: 179px;
  background: rgb(255, 255, 255);
  border-radius: 16px;
  flex: 0 1 32%;
  margin: 10px 0px 0px;
  padding: 20px 0px 20px 30px;
  overflow: hidden;
}
html.dark .hot-game-card,
html.dark .hot-game-card1 {
  box-shadow: rgba(0, 0, 0, 0.1) 0px -2px 2px 0px inset, rgba(255, 255, 255, 0.11) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.08) 0px 1px 8px 0px;
  background: rgb(62, 63, 69);
}
.image-wrapper {
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
}
.image-wrapper2 {
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 179px;
}
html.dark .image-wrapper,
html.light .image-wrapper2 {
  background: #313537;
}

.lottery-name {
  background: #f8f9fa;
  color: #677684;
  font-size: 16px;
  padding: 10px 15px;
  font-weight: 500;
}
html.dark .lottery-name {
  background: #313537;
  color: #fff;
}
.conutdown-wrapper {
  background-image: linear-gradient(180deg, #ff598e, #ff2d55);
  border-radius: 0 16px 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  font-weight: 600;
  font-size: 15px;
}
.lottery-ball {
  width: 32px;
  height: 32px;
  border-radius: 32px;
  color: #292b31;
  font-size: 14px;
  background: url(@/assets/custom-images/home/ball-bg.png) no-repeat 50% / 100%;
}

</style>
