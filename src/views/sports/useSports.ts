import { localImg } from "@/01-kk-system/allUtils/utils"
import { GameLineTypes } from "@/01-kk-system/middleware/fusionApi/game";
import useLinkOpenFunc from "@/04-kk-component-admin/components/hooks/useLinkOpenFunc";
import { useGameStore } from "@/store";


interface GameType {
  icon: string;
  activeIcon: string;
  title: string;
  subTxt: string;
  titleIcon: string;
  image: string;
}

export const useSports = () => {

  const gameStore = useGameStore();
  const { onClickOuterGame } = useLinkOpenFunc();

const gameTxt = [
  "真实、及时的赛事资讯和比赛情报，详尽的赛事、球队、球员数据资料。提供多种赔率模式与玩法，带给您最佳的体育投注体验！",
  "倾力打造刺激火爆的体育娱乐游戏，多种娱乐方式选择，超高游戏赔付率，每天为您提供千场精彩体育赛事。",
  "清爽界面，便捷操作，高清画质，您将置身于世界体育盛事，尽情享受比赛带来的无尽激情，确保您不错过任何精彩瞬间。",
  "线上竞技，无限可能！畅享体育游戏，精彩瞬间，尽在掌握！一起开启胜利之旅！",
  "线上体育游戏带来无尽刺激！与全球玩家实时下注，体验最真实的体育快感，赢得胜利从未如此激动人心！",
  "与全球玩家同场，尽享线上体育游戏的无限激情！实时对战，真实体验，成就巅峰荣耀。立即加入，赢得每一场胜利！",
  '业界赔率最佳、赛事最全，涵盖海量热门体育赛事，提供视频直播、专业体育数据统计，满足对体育赛事的一切需求！',
]

const sportsList = computed(() => {
  const list = gameStore.sportGameList || []
  const data = list.map((game, index) => ({
    ...game,
    icon: localImg(`custom-images/sport/sports-icon-${game.outerGamerID}.png`),
    activeIcon: localImg(`custom-images/sport/sports-icon-${game.outerGamerID}-active.png`),
    title: game.outerGamerName,
    titleIcon: localImg(`custom-images/outergameicon/title-sport-${game.outerGamerID}.png`),
    subTxt: gameTxt[index],
    image: localImg(`custom-images/sport/sports-${game.outerGamerID}.png`),
  }))
  return data
})

const goToGame = (game: GameLineTypes & GameType) => {
  if (game) {
    onClickOuterGame(game)
  }
}

return {
  sportsList,
  goToGame,
}
}
