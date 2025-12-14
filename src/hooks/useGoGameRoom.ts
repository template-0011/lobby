import { isEqual } from 'lodash-es'

export const useGoGameRoom = () => {
  const LOCAL_GAME_ROOM_KEY = 'kk_g_r_key'
  const router = useRouter()

  const goToGameRoom = (game: Object, key: string) => {
    if (!key) {
      return
    }
    setGameRoomData(game)
    router.push({
      path: '/game-room',
      query: {
        ref: key,
      }
    })
  }

  const sameData = (game: Object) => {
    const gameRoomData = getGameRoomData()
    return gameRoomData ? isEqual(gameRoomData, game) : false
  }

  const setGameRoomData = (game: Object,) => {
    localStorage.setItem(LOCAL_GAME_ROOM_KEY, JSON.stringify(game))
  }

  const getGameRoomData = () => {
    const game = localStorage.getItem(LOCAL_GAME_ROOM_KEY)
    return game ? JSON.parse(game) : null
  }

  return {
    goToGameRoom,
    setGameRoomData,
    getGameRoomData,
  }
}
