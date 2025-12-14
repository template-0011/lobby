import { getLanguage } from "@/i18n";
import { importOneComponentLanguage } from "@/utils/i18n";
import { CURRENT_LANGUAGE } from "@/01-kk-system/allDefine/common/const";
import en from "element-plus/es/locale/lang/en";
import { store } from "@/store";
import { SidebarStatusEnum } from "@/enums/SidebarStatusEnum";
import { platformHttp } from "@/01-kk-system/allHttp/userHall/platform";
import { PlatformImageCode } from "@/01-kk-system/allHttp/models/common";
import { localImg } from "@/01-kk-system/allUtils/utils";
import { IObject } from "@/01-kk-system/allHttp/types/common";

// 导入 Element Plus 中英文语言包  import Element Plus language json
const getAllUILibLanguage = () => {
  const language = importOneComponentLanguage(
    import.meta.glob("@/02-kk-i18n-system/uiLib/**/*.js", { eager: true })
  );
  return language;
};

// setup
export const useAppStore = defineStore("app", () => {
  // state
  const language = useStorage(CURRENT_LANGUAGE, getLanguage());
  const sidebarStatus = useStorage("sidebarStatus", SidebarStatusEnum.CLOSED);
  const logo = ref("");
  const favicon = ref("");
  const banners = ref<string[]>([]);
  const platDiffConfig = ref<IObject>({});

  const sidebar = reactive({
    opened: sidebarStatus.value === SidebarStatusEnum.OPENED,
    withoutAnimation: false,
  });
  // const activeTopMenuPath = useStorage("activeTopMenuPath", "");
  /**
   * 根据语言标识读取对应的语言包 get ui lib language messages by current lang
   */
  const locale = computed(() => {
    const langKey = language?.value || "zh_CN";
    const languageObj = getAllUILibLanguage();
    // @ts-ignore
    return languageObj[langKey] || en;
  });

  // actions
  function toggleSidebar() {
    sidebar.opened = !sidebar.opened;
    sidebarStatus.value = sidebar.opened
      ? SidebarStatusEnum.OPENED
      : SidebarStatusEnum.CLOSED;
  }

  /**
   * 切换语言
   *
   * @param val
   */
  function changeLanguage(val: string) {
    language.value = val;
  }
    /**
   * fetch app images
   *  @pramas code 1: favicon 2: logo
   */
    async function getAppLogoByCode(code: PlatformImageCode) {
      if ([PlatformImageCode.H5_LOGO, PlatformImageCode.PC_LOGO].includes(code) && logo.value) {
        return logo.value
      }
      else if ([PlatformImageCode.H5_FAVICON, PlatformImageCode.PC_FAVICON].includes(code) && favicon.value) {
        return favicon.value
      }
      const res = await platformHttp.getPlatformImageByCode(code).catch(() => null)
      if ([PlatformImageCode.H5_FAVICON, PlatformImageCode.PC_FAVICON].includes(code)) {
        favicon.value = res || ''
        setFavicon()
      }
      else if ([PlatformImageCode.H5_LOGO, PlatformImageCode.PC_LOGO].includes(code) && res) {
        logo.value = res || ''
      }
      return res || ''
    }

    /**
   * fetch app banner images
   *  @pramas code = ['3', '4', '5', '6', '7']
   */
  async function getAppBanners(isLocal: boolean = false) {
    if (isLocal || window.location?.origin?.includes('localhost') || window.location?.origin?.includes('kk-template')) {
      return [
        localImg(`custom-images/banner/banner3.avif`),
        localImg(`custom-images/banner/banner1.avif`),
        localImg(`custom-images/banner/banner2.avif`),
        localImg(`custom-images/banner/banner4.avif`),
        localImg(`custom-images/banner/banner5.avif`),
      ]
    }
    if (banners.value && banners.value.length > 0) {
      return banners.value
    }
    const allBannerFetch: any[] = [];
    ['3', '4', '5', '6'].forEach((code) => {
      allBannerFetch.push(platformHttp.getPlatformImageByCode(code))
    })
    const res = await Promise.allSettled(allBannerFetch).catch(() => [])
    if (res && res.length > 0) {
      const tempBans: string[] = []
      res.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          tempBans.push(result.value)
        }
      })
      banners.value = tempBans
    }
    return banners.value
  }

  function setFavicon() {
    const icon = useFavicon();
    icon.value = favicon.value;
  }

  async function getDiffConfig() {
    try {
      if (Object.keys(platDiffConfig.value).length > 0) {
        return platDiffConfig.value
      }
      const res = await platformHttp.diffConfig()
      const { data = [] } = res || {}
      let result: IObject = {}
      data?.forEach(item => {
        const { confKey, conf } = item
        result[confKey] = conf
      })
      platDiffConfig.value = result
      return platDiffConfig.value
    } catch (error) {
      console.error('get diff config error:', error);
    }
  }

  return {
    sidebar,
    language,
    locale,
    logo,
    changeLanguage,
    toggleSidebar,
    getAppLogoByCode,
    getAppBanners,
    getDiffConfig,
  };
});

// 手动提供给 useStore() 函数 pinia 实例
// https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
export function useAppStoreHook() {
  return useAppStore(store);
}
