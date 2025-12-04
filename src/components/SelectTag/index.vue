<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { localImg } from "@/01-kk-system/allUtils/utils";
defineOptions({
  name: "KKSelectTag",
});
const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
  isSelect: {
    type: Boolean,
    default: false,
  }
})

// console.log('---props.game-------', props.game)

function getImage() {
  if(props.game?.lottoClassify) {
    const { lottoClassify, country } = props.game
    const ctry = country?.toLowerCase()
    if (lottoClassify && ctry) {
      return `${ctry}-${lottoClassify}`
    }
    return 'cn-101'
  } else {
    const { outerGamerID } = props.game
    if (outerGamerID) {
      return outerGamerID
    }
    return '1001'
  }
}

function getOuterImage(isActive: boolean = false) {
  const { contentCategory, outerGamerID } = props.game
  const activeTxt = isActive ? '-a' : ''
  if (contentCategory && outerGamerID) {
    return localImg(`custom-images/outergameicon/${outerGamerID}${activeTxt}.png`)
  }
  return localImg(`custom-images/outergameicon/1001${activeTxt}.png`)
}

const emit = defineEmits<{
  onSelect: [data: IObject]
}>()
</script>

<template>
  <div class="tag-button flex-center group" :class="{ active: isSelect }" @click="emit('onSelect', game)">
    <div class="w-8 h-8 rounded-full group">
      <svg-icon :icon-class="getImage()" :class="`group-hover:!fill-white ${isSelect ? 'fill-[#ffffff]' : '!fill-[#5B9AFD]' }`"  size="32"/>
    </div>
    <span class="text-base ml-1">{{ game.outerGamerName || game.name }}</span>
  </div>
</template>

<style lang="scss" scoped>
.tag-button {
  position: relative;
  overflow: hidden;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-flex-flow: row nowrap;
  flex-flow: row nowrap;
  height: 50px;
  border-radius: 30px;
  cursor: pointer;
  margin-right: 16px;
  width: auto;
  background-image: none;
  padding: 0 20px;
  margin-bottom: 10px;
  border: 1px solid #dee9f3;
  transition: all 0.3s;
}

.tag-button:hover,
.tag-button.active {
  background: linear-gradient(90deg, #7e8bfa, #5e6af0);
  color: #ffffff;
}

.show-img {
  display: block !important;
}
</style>
