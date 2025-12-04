<script setup lang="ts">
import { outerGameHttp } from "@/01-kk-system/allHttp/userHall/games";
import { useThirdGameMoney } from "@/04-kk-component-admin/components/hooks/useThirdGameMoney";
import { useUserStore } from "@/store";

defineOptions({
  name: "OuterBalanceCard",
});
defineProps({
  game: {
    type: Object,
    default: () => ({}),
  },
});

const injectObj = inject<{ onRefresh: () => void }>('Outer-Game-Provider')

const { trans2Out, onRefresh, loading, refreshLoading, balance } = useThirdGameMoney()

const trans2OutFunc = (game: Record<string, any>) => {
  trans2Out(game, injectObj?.onRefresh)
}
</script>

<template>
  <div class="wallet-card outer-item">
    <span class="toptips absolute -top-2 right-0">
      <el-tooltip
        v-if="game.tips"
        class="box-item"
        effect="dark"
        color="#ffba75"
        :content="game.tips"
        placement="top"
      >
        <el-icon size="16"><InfoFilled /></el-icon>
      </el-tooltip>
    </span>
    <div class="wallet-info flex items-center justify-between">
      <span class="wallet-name text-sm flex-1 single-text">{{
        game.outerGamerName
      }}</span>
      <el-button
        type="danger"
        size="small"
        :loading="loading"
        round
        @click="trans2OutFunc(game)"
      >
        {{ $t("web.i18nFront.label.sys2outer") }}
      </el-button>
    </div>
    <div class="w-full line-height-26px h-26px flex items-center">
      <b class="text-16px color-#bab5c9 font-500 flex-1 text-one-line">
        {{ balance }}
      </b>
      <el-button
        text
        icon="Refresh"
        :loading="refreshLoading"
        size="small"
        @click="onRefresh(game)"
      >
        <template #icon>
          <el-icon v-show="!refreshLoading" class="cursor-pointer" size="18"
            ><Refresh
          /></el-icon>
        </template>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wallet-info {
  --el-color-danger: #4a4a54;
}
.outer-item {
  width: 200px;
  height: 70px;
  border-radius: 5px;
  padding: 10px 8px;
  margin-right: 8px;
  margin-bottom: 16px;
  vertical-align: top;
  position: relative;
  background-color: #fff;
  color: #292b31;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, .1);
  border-radius: 8px;
}
html.dark .outer-item {
  background: #1e212a;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, .1);
  border-radius: 8px;
  color: #677684
}
</style>
