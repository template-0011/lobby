<template>
  <div class="p-4 box-border">
    <el-scrollbar>
      <nav class="flex gap-y-3 justify-between flex-wrap">
        <SidebarMenuItem
          v-for="item in menuList"
          @onClick="onClickItem"
          :key="item.path"
          :item="item"
        />
      </nav>
      <div class="box-border mt-7">
        <a class="list-item" @click="goTo('/personal/finance/wallet')">
          <div class="item-img">
            <svg-icon size="30" icon-class="icon_tzjl" />
          </div>
          <div class="item-text">
            <h4>{{ $t("web.i18nFront.label.reChargeWdR") }}</h4>
          </div>
        </a>
        <a class="list-item" @click="goTo('/personal/report/lottery')">
          <div class="item-img">
            <svg-icon size="30" icon-class="icon_record" />
          </div>
          <div class="item-text">
            <h4>{{ $t("web.i18nFront.label.gameRecord") }}</h4>
          </div>
        </a>
        <a
          class="list-item color-bg"
          style="--start: var(--cp-color71); --end: var(--cp-color72)"
          @click="goTo('/activity')"
        >
          <div class="item-img">
            <img
              class="w-34px object-contain"
              src="@/assets/images/icon_activity.png"
              alt=""
            />
          </div>
          <div class="item-text">
            <h6>{{ $t("web.i18nFront.title.activitys") }}</h6>
            <p>{{ $t("web.i18nFront.tips.activityTip") }}</p>
          </div>
        </a>
        <a
          class="list-item color-bg"
          style="--start: var(--cp-color75); --end: var(--cp-color76)"
          @click="goTo('/personal/proportion/rewards')"
        >
          <div class="item-img">
            <img
              class="w-34px object-contain"
              src="@/assets/images/icon_rebate.png"
              alt=""
            />
          </div>
          <div class="item-text">
            <h6>{{ $t("web.i18nFront.label.rewards") }}</h6>
            <p>{{ $t("web.i18nFront.tips.rewardTip") }}</p>
          </div>
        </a>
        <a
          class="list-item color-bg"
          style="--start: var(--cp-color79); --end: var(--cp-color80)"
          @click="goTo('/agent/account/open')"
        >
          <div class="item-img">
            <img
              class="w-34px object-contain"
              src="@/assets/images/icon_promote.png"
              alt=""
            />
          </div>
          <div class="item-text">
            <h6>{{ $t("web.i18nFront.label.agentShare") }}</h6>
            <p>{{ $t("web.i18nFront.tips.agentTip") }}</p>
          </div>
        </a>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { localImg } from "@/01-kk-system/allUtils/utils";
import { translateTextBy } from "@/utils/i18n";

const router = useRouter();

export type MenuItem = {
  title: string;
  path: string;
  icon: string;
  image: string;
  active: boolean;
  size?: string;
};
const menuList = ref<MenuItem[]>([
  {
    title: translateTextBy("web.i18nFront.title.hot"),
    path: "/hot",
    icon: "icon_game_hot",
    image: localImg("images/icon_hot.png"),
    active: true,
    size: "24",
  },
  {
    title: translateTextBy("web.i18nFront.title.lottery"),
    path: "/lottery",
    icon: "icon_game_lottery",
    image: localImg("images/icon_lottery.png"),
    active: false,
    size: "30",
  },
  {
    title: translateTextBy("web.i18nFront.title.realbet"),
    path: "/realbet",
    icon: "icon_game_real",
    image: localImg("images/icon_realbet.png"),
    active: false,
    size: "24",
  },
  {
    title: translateTextBy("web.i18nFront.title.chess"),
    path: "/chess",
    icon: "icon_game_chess",
    image: localImg("images/icon_chess.png"),
    active: false,
    size: "30",
  },
  {
    title: translateTextBy("web.i18nFront.title.sports"),
    path: "/sports",
    icon: "icon_game_sports",
    image: localImg("images/icon_sports.png"),
    active: false,
    size: "24",
  },
  {
    title: translateTextBy("web.i18nFront.title.fish"),
    path: "/fish",
    icon: "icon_game_fish",
    image: localImg("images/icon_fishing.png"),
    active: false,
    size: "28",
  },
  {
    title: translateTextBy("web.i18nFront.title.egame"),
    path: "/egame",
    icon: "icon_game_egame",
    image: localImg("images/icon_egame.png"),
    active: false,
    size: "28",
  },
  {
    title: translateTextBy("web.i18nFront.title.history"),
    path: "/history",
    icon: "icon_game_history",
    image: localImg("images/icon_history.png"),
    active: false,
    size: "24",
  },
]);

const onClickItem = (item: any) => {
  const { path } = item;
  menuList.value.forEach((val) => {
    val.active = val.path === path;
  });
};

const goTo = (path: string) => {
  router.push({ path });
};
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding: 4px 16px;
  height: 58px;
  background-color: var(--cp-color47);
  border-radius: 6px;
  text-decoration: none;
  transition: 0.25s linear;
  color: #aca6bf;
}
.item-img {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  width: 58px;
  height: 58px;
  color: var(--cp-color53);
}
.item-text {
  flex: 1;
  h4 {
    font-size: 17px;
    color: var(--cp-color49);
  }
}
.color-bg {
  background-image: linear-gradient(90deg, var(--start), var(--end));
  h6 {
    font-size: 14px;
    color: var(--cp-color50);
  }
  p {
    font-size: 12px;
    color: #fff;
  }
}
</style>
