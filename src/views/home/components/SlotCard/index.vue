<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils';

defineOptions({
  name: "SlotCard",
});

defineProps({
  item: {
    type: Object as any,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits<{
  onClick: [data: any]
}>()

function getImage(info: Record<string, any>) {
  const type = info.lobbyCode ? info.lobbyCode.toLowerCase() : ''
  return localImg(`custom-images/${type}/${info.image}`)
}
</script>

<template>
  <div class="slot-card">
    <div class="card-container items-center justify-center">
      <KKButton style="--kk-btn-bg-color-start: #7146ff;--kk-btn-bg-color-end:#597ef7;" :title="$t('web.i18nFront.game.goToGame')" @onClick="emit('onClick', item)" />
    </div>
    <el-image fit="cover" class="w-full" :src="getImage(item)" />
    <div class="game-name">{{ item.outerGamerName }}</div>
  </div>
</template>

<style lang="scss" scoped>
.slot-card {
  background: #fff;
    border-radius: 16px;
    box-shadow: 0 0 0 0 transparent, inset 0 -1px 3px 0 rgba(0, 0, 0, .11), 0 0 8px 0 rgba(0, 0, 0, .12);
    cursor: pointer;
    display: flex;
    flex: 0 13%;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    height: 168px;
}
html.dark .slot-card {
  background: #3e3f45;
  box-shadow: inset 0 -2px 2px 0 rgba(0, 0, 0, .1), inset 0 1px 0 0 hsla(0, 0%, 100%, .11), 0 1px 8px 0 rgba(0, 0, 0, .08);
}
.card-container {
  position: absolute;
  width: 170px;
  height: 168px;
  bottom: 0;
  font-size: 14px;
  -webkit-transform: translateY(5px);
  transform: translateY(5px);
  overflow: hidden;
  display: none;
  z-index: 10;
}
.slot-card:hover .card-container {
  display: flex;
}
.game-name {
  background: #d5d6d8;
  color: #313236;
  border-radius: 0 0 16px 16px;
  font-size: 14px;
  padding: 8px 0;
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
  width: 100%;
  font-weight: 500;
}
.slot-card:hover .game-name {
  background: #cfb892;
  color: #ffffe3;
}
html.dark .slot-card:hover .game-name {
  background: #425de3;
  color: #e3e3e3;
}
html.dark .game-name {
  background: #323337;
  color: #e3e3e3;
}
</style>
