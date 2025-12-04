<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils';

defineOptions({
  name: "SportGameCard",
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
  const country = info.country ? info.country.toLowerCase() : ''
  return localImg(`custom-images/lottery/${country}-${info.lottoClassify}.png`)
}

</script>

<template>
  <div class="sport-game-card flex">
    <div class="gamme-info flex flex-col items-center justify-center h-full gap-4">
      <img class="h-10" src="@/assets/custom-images/home/live-logo-icon.png" alt="">
      <p class="leading-10 text-28px font-600 color-[var(--kk-live-game-color)]">{{ item.outerGamerName }}</p>
      <KKButton style="--kk-btn-bg-color-start: #7146ff;--kk-btn-bg-color-end:#597ef7;" :title="$t('web.i18nFront.game.goToGame')" @onClick="emit('onClick', item)" />
    </div>
    <div class="image-wrapper">
      <img class="person object-contain" src="@/assets/custom-images/home/sports-person-01.png" alt="">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sport-game-card {
  cursor: pointer;
  position: relative;
  transition: -webkit-transform .3s;
  transition: transform .3s;
  transition: transform .3s, -webkit-transform .3s;
  width: 450px;
  height: 270px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .2);
  border-radius: 24px;
  background-repeat: no-repeat;
  background-image: url(@/assets/custom-images/home/bg_sports_item-light.png) no-repeat 50% / 100%;;
  border-radius: 24px;
  overflow: hidden;
}
html.dark .sport-game-card {
  background-image: url(@/assets/custom-images/home/bg_sports_item-dark.png) no-repeat 50% / 100%;;
}
.image-wrapper {
  width: 209px;
  margin-right: 10px;
  z-index: 1;
  pointer-events: none;
}
.sport-game-card:hover .image-wrapper .person,
.sport-game-card:hover .kk-btn {
  transform: scale(1.1);
}
.image-wrapper .person {
  transition: transform .3s, -webkit-transform .3s;
  width: 100%;
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
  width: 230px;
  padding: 26px 0 0 28px;
}

</style>
