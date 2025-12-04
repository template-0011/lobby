<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils';

defineOptions({
  name: "LiveGameCard",
});

const props = defineProps({
  item: {
    type: Object as any,
    required: true,
    default: () =>({})
  },
})

const emit = defineEmits<{
  onClick: [data: any]
}>()

function getImage(info: Record<string, any>) {
  console.log('item', info)
  const country = info.country ? info.country.toLowerCase() : ''
  return localImg(`custom-images/lottery/${country}-${info.lottoClassify}.png`)
}

</script>

<template>
  <div class="live-game-card">
    <div class="image-wrapper">
      <img class="person object-contain" src="@/assets/custom-images/home/live-person-01.png" alt="">
      <img class="other-img" src="@/assets/custom-images/home/live-ae-icon.png" alt="">
    </div>
    <div class="gamme-info flex flex-col items-center justify-center h-full gap-4">
      <img class="h-10" src="@/assets/custom-images/home/live-logo-icon.png" alt="">
      <p class="leading-10 text-28px font-600 color-[var(--kk-live-game-color)]">{{ item.outerGamerName }}</p>
      <KKButton style="--kk-btn-bg-color-start: #7146ff;--kk-btn-bg-color-end:#597ef7;" :title="$t('web.i18nFront.game.goToGame')" @onClick="emit('onClick', item)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.live-game-card {
  cursor: pointer;
  position: relative;
  transition: -webkit-transform .3s;
  transition: transform .3s;
  transition: transform .3s, -webkit-transform .3s;
  width: 684px;
  height: 200px;
  background-repeat: no-repeat;
  background-image: url(@/assets/custom-images/home/live-car-bg-light.png);
  background-size: contain;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, .2);
  border-radius: 24px;
  overflow: hidden;
}
html.dark .live-game-card {
  background-image: url(@/assets/custom-images/home/live-car-bg-dark.png);
}
.image-wrapper {
  width: 240px;
  left: 65px;
  height: 100%;
  position: relative;
  z-index: 1;
  pointer-events: none;
}
.live-game-card:hover .image-wrapper .person,
.live-game-card:hover .kk-btn {
  transform: scale(1.1);
}
.image-wrapper .person {
  width: 168px;
  top: auto;
  bottom: 0;
  transition: all .5s;
  position: absolute;
}
.image-wrapper .other-img {
  position: absolute;
  height: 78px;
  width: auto;
  left: auto;
  right: 0;
  bottom: 0;
  -webkit-transform: translateX(-5px);
  transform: translateX(-5px);
}

.gamme-info {
  position: absolute;
  right: 40px;
  bottom: 35px;
  width: 250px;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  height: 162px;
  top: 14px;
  transition: -webkit-transform .3s;
  transition: transform .3s;
  transition: transform .3s, -webkit-transform .3s;
}

</style>
