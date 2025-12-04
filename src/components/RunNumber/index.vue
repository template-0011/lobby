<script setup lang="ts">
defineOptions({
  name: "KKRunNumber",
});

const props = defineProps({
  num: {
    type: Number,
    required: true,
    default: 0
  }
})

const numbers = ref<string[]>([])

watch(() => props.num, () => {
  runNumber()
})

onMounted(() => {
  runNumber()
})

function formatNumberWithCommas(num: number | string) {
    // 首先将数字转换为字符串
    const strNum = num.toString();
    // 使用正则表达式替换每三位数字之间插入逗号
    return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isEmptyValue(value: any) {
  return value === null || value === undefined || value === ''
}

const runNumber = () => {
  if (isEmptyValue(props.num)) {
    return
  }
  const formattedNum = formatNumberWithCommas(props.num);
  const initNums = Array.from(formattedNum)?.map(val => val === ',' ? ',' : '0')
  numbers.value = initNums;
  setTimeout(() => {
    numbers.value = Array.from(formattedNum)
  }, 10)
}

</script>

<template>
  <div class="kk-number-container">
    <template v-for="(num, i) in numbers" :key="i+'num'">
      <div class="num-bg" v-if="num !== ','">
        <span class="number-img" :style="{ 'background-position-y': `${-494 + 54 * Number(num)}px` }"></span>
      </div>
      <div class="dou" v-else></div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.kk-number-container {
  @apply relative w-full h-72px flex-center;
}
.kk-number-container::before {
  background-image: url('@/assets/images/common/num-c.png') no-repeat center 100%;
  background-size: contain;
  content: "";
  display: block;
  position: absolute;
  width: 812px;
  height: 135px;
  z-index: 0;
  top: -32px;
}
.dou {
  background: url('@/assets/images/common/dou.webp') no-repeat center 100%;
  background-size: contain;
  margin: 0 5px;
  min-width: 17px;
  max-width: 17px;
  height: 77px;
  z-index: 1;
}
.num-bg {
  position: relative;
  background: url('@/assets/images/common/num-bg.webp') no-repeat center 100%;
  background-position: 50%;
  background-size: 100% 100%;
  width: 48px;
  height: 70px;
  margin-right: 7px;
}
.number-img {
  width: 30px;
  height: 52px;
  background-size: 41px auto;
  background-position-x: -6px;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url('@/assets/images/common/num.webp');
  background-repeat: repeat;
  transition: background 1s;
  background-position-y: -494px;

}
</style>
