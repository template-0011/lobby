<script setup lang="ts">
import { localImg } from "@/01-kk-system/allUtils/utils";
import CanvasCircle from "./CanvasCircle.vue"

defineOptions({
  name: "SafeSection",
});

const { t } = useI18n()

const list = [
  {
    id: 'safe-01',
    title: t('web.i18nFront.label.safeDeposit'),
    number: 60,
    unit: t('web.i18nFront.label.unitSec'),
    percent: 0.4,
  },
  {
    id: 'safe-02',
    title: t('web.i18nFront.label.safePattern'),
    number: 80,
    unit: t('web.i18nFront.label.unitPlat'),
    percent: 0.6,
  },
  {
    id: 'safe-03',
    title: t('web.i18nFront.label.safeWithdraw'),
    number: 90,
    unit: t('web.i18nFront.label.unitSec'),
    percent: 0.6,
  },
  {
    id: 'safe-04',
    title: t('web.i18nFront.label.safeGames'),
    number: 27,
    unit: t('web.i18nFront.label.unitPlat'),
    percent: 0.5,
  },
]

const list2 = [
  {
    id: 'safe-card-01',
    icon: localImg(`images/home/sevice_icon01.png`),
    nameicon: localImg(`images/home/seerver-name01.png`),
    desc: '独家开发，采用128位加密技术和严格的安全管理体系，客户资金得到最全面的保障，让您尽享娱乐、赛事投注等，且无后顾之忧！',
  },
  {
    id: 'safe-card-02',
    icon: localImg(`images/home/sevice_icon02.png`),
    nameicon: localImg(`images/home/seerver-name02.png`),
    desc: '每天为您提供近千场精彩体育赛事，更有电竞、真人、棋牌、彩票、电子游戏等多种娱乐方式选择，让您拥有完美游戏体验。',
  },
  {
    id: 'safe-card-03',
    icon: localImg(`images/home/sevice_icon03.png`),
    nameicon: localImg(`images/home/seerver-name03.png`),
    desc: '平台采用最新技术自主研发的财务处理系统，真正做到极速存、取、转。独家网络优化技术，为您提供一流的游戏体验，最大优化网络延迟。',
  },
  {
    id: 'safe-card-04',
    icon: localImg(`images/home/sevice_icon04.png`),
    nameicon: localImg(`images/home/seerver-name04.png`),
    desc: '引领市场的卓越技术，自主研发了全套终端应用，让您畅享 Web、H5，更有iOS、Android原生App，让您娱乐投注随时随地，随心所欲！',
  },
]
</script>

<template>
  <div class="flex items-center justify-between">
      <div class="card" v-for="item in list" :key="item.id">
        <div class="w-200px h-200px flex-center relative">
          <CanvasCircle :size="182" :total="item.percent" />
          <div class="absolute top-0 left-0 bottom-0 right-0 flex flex-col items-center justify-center">
            <p class="number">{{ item.number }}</p>
            <p class="desc">{{ item.unit }}</p>
          </div>
        </div>
        <p class="title">{{ item.title }}</p>
      </div>
  </div>
  <div class="mt-12">
    <ul class="flex justify-between">
      <li class="server-card" v-for="card in list2" :key="card.id">
        <img class="w-20 h-90px mb-8" :src="card.icon" alt="">
        <img class="w-72px h-6 mb-7" :src="card.nameicon" alt="">
        <p class="server-desc">{{ card.desc }}</p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.number {
  color: #7981a4;
  font-size: 60px;
  height: 48px;
  line-height: 1;
  margin-bottom: 4px !important;
  margin-top: 6px;
  font-family: DINCondensed-Bold !important;
}
.desc {
  color: #3b5bb0;
  font-family: PingFang SC;
  font-size: 16px;
  line-height: 20px;
}
.title {
  margin-top: 10px;
  color: #464854;
  text-align: center;
  font-family: PingFang SC;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}
.server-card {
  position: relative;
    display: -webkit-flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  width: 278px;
  height: 378px;
  background: url('@/assets/images/home/service_card_bg.png') no-repeat;
  background-size: cover;
  padding: 50px 36px 41px;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-flex-direction: column;
  flex-direction: column;
}
.server-desc {
  color: #7981a4;
  text-align: justify;
  font-family: PingFang SC;
  font-size: 14px;
  height: 110px;
}
</style>
