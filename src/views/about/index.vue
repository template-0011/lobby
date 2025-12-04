<script setup lang="ts">
import { TabsPaneContext } from "element-plus";

defineOptions({
  name: "AboutUs",
});
const route = useRoute();

const activeName = ref((route.params.type as string) || "aboutUs");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event, activeName.value);
};
</script>

<template>
  <div class="bg-[var(--cp-color141)] rounded-1 my-4 py-4 px-5 w-1400px mx-auto">
    <el-tabs v-model="activeName" class="top-tabs" @tab-click="handleClick">
      <el-tab-pane
        :label="$t('web.i18nFront.label.aboutUs')"
        name="aboutUs"
        :lazy="true"
      >
        <div class="content">
          <h3 class="text-22px leading-50px">
            {{ $t("web.i18nFront.label.aboutUs") }}
          </h3>
          <p>
            {{ $t("web.i18nFront.desc.aboutus") }}
          </p>
          <!-- <p>
            公司总部设立在菲律宾马尼拉，并经第三方游戏平台Gaming Laboratories
            International(GLI) 权威认证。
          </p>
          <p>
            公司自主研发程序，通过GLOBAL TRUST国际安全认证，采用AES
            256位加密保障资金信息安全，使用CDN多线加速，分布式高防云防御和军用级防火墙保证高速稳定，并与国内21家主流银行深度对接，稳定流畅，功能齐全，彩种及玩法应有尽有。
          </p>
          <p>公司持有菲律宾合法博彩机构PAGCOR颁发的博彩执照。</p>
          <p>
            集团公司拥有强大的自主研发团队，程序稳定流畅，功能齐全，彩种及玩法应有尽有；
          </p>
          <p>手机 APP 安卓端、苹果端，手机 WAP 版，站内信聊天工具一应俱全；</p>
          <p>
            支持各大银行网银支付、微信扫码、支付宝扫码，无卡支付等多渠道充值方式：
            平台 API全自动付款只为打造秒充秒提的快捷服务，给您带来一站式完美体验
            。
          </p> -->
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('web.i18nFront.label.gameBiling')"
        name="response"
        :lazy="true"
      >
        <div class="content">
          <h3 class="text-22px leading-50px">
            {{ $t("web.i18nFront.label.gameBiling") }}
          </h3>
          <p>
            {{ $t("web.i18nFront.desc.gameBiling") }}
          </p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.top-tabs {
  --el-color-primary: #5bafff;
  --el-text-color-primary: #ffffff;
  --el-font-size-base: 16px;
}
.content {
  color: #ffffff;
  font-size: 14px;
  line-height: 28px;
  min-height: 60vh
}
.content p {
  margin-bottom: 16px;
  white-space: pre-line;
}
</style>
