<script setup lang="ts">
import { useGameStore } from "@/store";

defineOptions({
  name: "OuterBalanceCard",
});

const { t } = useI18n();
const gameStore = useGameStore();
const gameList = ref<Record<string, any>[]>([]);

const handleGameList = async () => {
  const allGames = await gameStore.getAvailableOuterGamesLine();
  let list: Record<string, any>[] = [];
  for (let k in allGames) {
    const game: Record<string, any> = allGames[k];
    if (game) {
      switch (game.outerGamerID) {
      case "1001":
        {
          const gameName = "AG";
          game.tips = t("web.i18nFront.tips.outer", { game: gameName });
        }
        break;
      case "1002":
        {
          const gameName = "BBIN";
          game.tips = t("web.i18nFront.tips.outer", { game: gameName });
        }
        break;
      case "1008":
        {
          const gameName = "DG";
          game.tips = t("web.i18nFront.tips.outer", { game: gameName });
        }
        break;
      default:
        break;
    }
    list.push(game);
    }
  }
  gameList.value = list;
};

onBeforeMount(() => {
  handleGameList();
});
</script>

<template>
  <div class="flex flex-wrap min-h-50">
    <OuterBalanceCard v-for="(item, i) in gameList" :key="i" :game="item" />
    <!-- <div class="w-full flex-center" v-if="!hidden && fullList.length > initNum">
      <p class="text-center text-sm color-#949494 my-5 font-500 cursor-pointer" @click="showMore">
        {{ $t("web.i18nFront.label.more") }}
        <el-icon>
          <ArrowDown />
        </el-icon>
      </p>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.more {
  width: 100%;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  color: #949494;
  margin: 20px auto;
}
</style>
