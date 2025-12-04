import { localImg } from "@/01-kk-system/allUtils/utils"

export default function useGameLocalImage() {
  const getlotteryImage = (info: Record<string, any>) => {
    const { lottoClassifyCountry, lottoClassify, lottoID } = info || {}
    const countryCode = lottoClassifyCountry ? lottoClassifyCountry.toLowerCase() : ''
    const lottoClassifyImg = localImg(`custom-images/lottery/${countryCode}-${lottoClassify}.png`)
    if (lottoID) {
      const lotteryImg = localImg(`custom-images/lottery-games/${countryCode}-${lottoClassify}-${lottoID}.png`)
      return lotteryImg.includes('undefined') ? lottoClassifyImg : lotteryImg
    } else {
      return lottoClassifyImg
    }
  }
  const getImage = (info: Record<string, any>) => {
    if (info.lottoID) {
      return getlotteryImage(info)
    } else {
      const type = info.lobbyCode ? info.lobbyCode.toLowerCase() : ''
      return localImg(`custom-images/${type}/${info.image}`)
    }
  }
  return {
    getImage
  }
}
