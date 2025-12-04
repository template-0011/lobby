<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils'

const props = defineProps({
  game: {
    type: Object as any,
    required: true,
    default: () => ({})
  },
})

const emit = defineEmits<{
  onClickMore: [data: any]
  onClick: [data: any]
}>()

const menuRowRef = ref<any>(null)
// const topVal = ref(0);

onMounted(() => {

})

function onClickGame(game: any) {
  emit('onClick', game)
}

function getImage(info: Record<string, any>) {
  console.log(info)
  const type = info.lobbyCode ? info.lobbyCode.toLowerCase() : ''
  return localImg(`custom-images/${type}/${info.image}`)
}
</script>

<template>
  <div
    class="game-item min-h-230px"
    @click="onClickGame(game)"
  >
    <div class="game-thumb">
      <img class="w-full object-contain" alt="" :src="getImage(game)">
    </div>
    <div class="game-span">
      <h4 class="text-overflow">
        {{ game.outerGamerName }}
      </h4>
    </div>
    <div class="list-games-shadow" />
    <div class="game-play-masking">
      <i class="game-play" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-item {
  position: relative;
  width: 100%;
  min-height: 174px;
  overflow: hidden;
  border-radius: 8px;
  transition: 0.25s linear;
  // aspect-ratio: 312 / 444;
  cursor: pointer;
  transition: top 0.25s linear;
}
.game-thumb img {
  display: block;
  width: 100%;
  height: 100%;
}
.game-play-masking {
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3));
  align-items: center;
  bottom: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  text-align: center;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  transition: opacity 0.6s;
  z-index: 5;
}
.game-play {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 40px;
  height: 40px;
  transition: 0.25s linear;
  transform: translate3d(-50%, -50%, 0);
  background-image: url('@/assets/images/icon-play.png');
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
}
.game-play-masking:hover {
  opacity: 1;
}
.game-span {
  width: 100%;
  text-align: center;
}
.game-span h4 {
  transition: 0.25s linear;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  padding: 6px 0;
  text-shadow: 1px 1px 2px #3b3b3b;
}
</style>
