<script setup lang="ts">
import { localImg } from "@/01-kk-system/allUtils/utils";
import { useSettingsStore } from "@/store/modules/settings";

const props = defineProps({
  path: {
    type: String,
    default: "/hot",
  },
  title: String,
  icon: String,
  showMore: Boolean,
  size: {
    type: String,
    default: "38",
  },
  list: Array<any>,
  nameKey: {
    type: String,
    default: "name",
  },
  logoType: {
    type: String,
    default: "lottery", // lottery, outerGame
  },
});

const emit = defineEmits<{
  onClickMore: [data: any];
  onClick: [data: any];
}>();

const settingStore = useSettingsStore();

const menuRowRef = ref<any>(null);
// const topVal = ref(0);
const rect = reactive(useElementBounding(menuRowRef));
watchThrottled(
  () => rect.top,
  () => {
    if (rect.top <= 100 && rect.top >= -100) {
      settingStore.changeSetting({ key: "homeActivepath", value: props.path });
    }
  },
  { throttle: 60 }
);
watch(
  () => settingStore.triggerCompToTop,
  (newVal) => {
    if (newVal === props.path) {
      if (menuRowRef?.value) {
        menuRowRef?.value.scrollIntoView({
          // block: "end",
          behavior: "smooth",
        });
      }
    }
  }
);

let initElementTop = 0;

onMounted(() => {
  if (menuRowRef?.value) {
    initElementTop = menuRowRef?.value.getBoundingClientRect().top;
  }
});

function onClickGame(game: any) {
  emit("onClick", game);
}

function getImage(info: Record<string, any>) {
  if (props.logoType === 'lottery') {
    const country = info.country ? info.country.toLowerCase() : ''
    console.log(`custom-images/lottery/${country}-${info.lottoClassify}.png`)
    return localImg(`custom-images/lottery/${country}-${info.lottoClassify}.png`)
  }
  else {
    const type = info.lobbyCode ? info.lobbyCode.toLowerCase() : ''
    return localImg(`custom-images/${type}/${info.image}`)
  }
}
</script>

<template>
  <div class="my-6" ref="menuRowRef">
    <div class="section-title text-center font-700 color-[var(--kk-section-title-color)]">
      <span>{{ title }}</span>
    </div>
    <slot>
      <el-empty />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.section-title {
  display: block;
    text-align: center;
    position: relative;
    line-height: 94px;
    transform: scale(0.65);
    transform-origin: 50% 80%;
    font-size: 40px !important;
    font-weight: 700 !important;
    height: auto !important;
    background: url(@/assets/custom-images/home/title-bg.png) 50% center no-repeat;
}
.section-title::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 498px;
  height: 38px;
  margin-left: -452px;
  background: url(@/assets/custom-images/home/title-left.png) 50% center no-repeat;
}
.section-title::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 498px;
  height: 38px;
  margin-left: 452px;
  background: url(@/assets/custom-images/home/title-right.png) 50% center no-repeat;
}

.game-span {
  position: absolute;
  left: 0;
  bottom: 8px;
  width: 100%;
  text-align: center;
}
.game-span h4 {
  transition: 0.25s linear;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  text-shadow: 1px 1px 2px #3b3b3b;
}
</style>
