<script setup lang="ts">
defineOptions({
  name: "CanvasCircle",
});

const props = defineProps({
  size: {
    type: Number,
    default: 300,
  },
  color: {
    type: String,
    default: "#597ef7",
  },
  total: {
    type: Number,
    default: 0,
  },
})

let canvas: any = null
const kkCanvasRef = ref<any>()
const circleRef = ref<any>()
function degToRad(deg: number) {
  return (Math.PI / 180) * deg;
}

const initCanvas = () => {
  if (!canvas) {
    canvas = unref(kkCanvasRef) as any
  }
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas || {}
  ctx.clearRect(0, 0, width, height);
  const ratio = window.devicePixelRatio || 2;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);
}

const drawCircle = (percent: number) => {
  const ctx = canvas.getContext("2d");
  const width = props.size
  const height = props.size
  ctx.clearRect(0, 0, width, height);
  const start = degToRad(127)
  const end = degToRad(127) + degToRad(360 + 62 - 127) * percent
  const r = width / 2

  ctx.beginPath();
  ctx.arc(
    width / 2, // 圆心 x
    height / 2, // 圆心 y
    r - r * 0.2, // radius
    start, // startAngle  37
    end, // endAngle 62
  );
  ctx.strokeStyle = props.color || "#597ef7"; // 线条颜色
  ctx.lineWidth = r * 0.19; // 线条宽度
  ctx.lineCap = "butt"; // 线段末端以方形结束
  ctx.stroke();
}

let timer: number | null = null
const circle = (speed: number) => {
  clearAnimation()
  drawCircle(speed > props.total ? props.total : speed);
  timer = window.requestAnimationFrame(() => {
    //在1秒内完成一次的进度显示
    if (speed > props.total) {
      clearAnimation()
      return;
    }
    circle(speed);
  });
  speed += 0.01
}

const clearAnimation = () => {
  timer && window.cancelAnimationFrame(timer as number);
}

// 使用 Intersection Observer API 监听组件可见性
const { stop } = useIntersectionObserver(
  circleRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      circle(0.1)
    }
  },
  {
    // 目标元素和根元素相交比例达到该值时触发回调
    threshold: 0.2,
  }
)

onMounted(() => {
  initCanvas()
  circle(0.1);
});

onUnmounted(() => {
  stop()
})

</script>

<template>
  <div ref="circleRef" class="relative" :style="{ width: size + 'px', height: size + 'px' }">
    <canvas class="z-1 relative" ref="kkCanvasRef" :width="size" :height="size"></canvas>
    <img class="absolute top-5% left-5% z-2 w-90% h-90% object-contain" src="@/assets/images/home/circle_top.png"
      alt="">
    <img class="absolute top-0 left-0 z-0 w-full h-full object-contain" src="@/assets/images/home/circle_bottom.png"
      alt="">
  </div>
</template>

<style lang="scss" scoped></style>
