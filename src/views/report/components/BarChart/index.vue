<script setup lang="ts">
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { IObject } from "@/01-kk-system/allHttp/types/common";
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
]);

defineOptions({
  name: "YBBarChart",
});

interface Props {
  option?: IObject;
}

const props = withDefaults(defineProps<Props>(), {});

let chartEle: echarts.ECharts;
// provide(THEME_KEY, "dark");

// const option = ref({
//   title: {
//     text: "Traffic Sources",
//     left: "center",
//   },
//   tooltip: {
//     trigger: "item",
//     formatter: "{a} <br/>{b} : {c} ({d}%)",
//   },
//   legend: {
//     // orient: "vertical",
//     left: "left",
//     data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"],
//   },
//   series: [
//     {
//       name: "Traffic Sources",
//       type: "bar",
//       radius: "55%",
//       center: ["50%", "60%"],
//       data: [
//         { value: 335, name: "Direct" },
//         { value: 310, name: "Email" },
//         { value: 234, name: "Ad Networks" },
//         { value: 135, name: "Video Ads" },
//         { value: 1548, name: "Search Engines" },
//       ],
//       emphasis: {
//         itemStyle: {
//           shadowBlur: 10,
//           shadowOffsetX: 0,
//           shadowColor: "rgba(0, 0, 0, 0.5)",
//         },
//       },
//     },
//   ],
// });

function initChart() {
  chartEle = echarts.init(document.getElementById("myEcharts"), "dark");
  chartEle.setOption(props.option || {});
}

function updateChart(option: IObject) {
  chartEle.setOption(option);
}

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  chartEle && echarts.dispose(chartEle);
});

defineExpose({ updateChart });
</script>

<template>
  <div id="myEcharts" class="w-full h-full" :option="option" autoresize></div>
</template>

<style lang="scss" scoped></style>
