<script setup lang="ts">

const props = defineProps({
  game: {
    type: Object as PropType<Record<string, any>>
  },
  type: {
    type: String,
    default: 'outer', // outer, lottery
  },
  isSelect: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onSelect'])

function getImage() {
  if(props.game?.lottoClassify) {
    const { lottoClassify, country } = props.game || {}
    const ctry = country?.toLowerCase()
    if (lottoClassify && ctry) {
      return `${ctry}-${lottoClassify}`
    }
    return 'cn-101'
  } else {
    const { outerGamerID } = props.game || {}
    if (outerGamerID) {
      return outerGamerID
    }
    return '1001'
  }
}

const title = computed(() => {
  const { outerGamerName, name } = props.game || {}
  return outerGamerName || name
})

const onClick = () => {
  emit('onSelect', props.game)
}
</script>

<template>
  <div
    class="rounded-3 h-45px relative select-none overflow-hidden hover:bg-[#262e4880]  hover:before:bg-transparent before:bg-[#262e4880] before:b-0 before:content-[''] before:h-1px before:left-3 before:right-3 before:absolute"
    :class="{ 'selected-menu before:bg-transparent': isSelect }"
    @click="onClick">
    <div class="cursor-pointer flex items-center min-h-43px px-3 py-2">
      <!-- <img class="w-6 h-6 color-#fff rounded-2 object-contain" src="" alt=""> -->
      <div class="w-6 h-6 rounded-1 flex-center bg-[#5B9AFD] shrink-0">
        <svg-icon :icon-class="getImage()"
          class="color-#fff"
          size="20px"
        />
      </div>
      <p class="text-12px color-#fff ml-2 mr-5px font-600 text-one-line">{{ title }}</p>
      <!-- <p class="ml-auto text-10px color-#7388b6">12</p> -->
    </div>
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
.selected-menu {
  background-image: linear-gradient(260deg, #00ff86, #00a858 48%, #00a858);
  box-shadow: 0 2px 14px #00bc6333;
}

</style>
