import defaultSettings from "@/settings";

type SettingsValue = boolean | string;

export const useSettingsStore = defineStore("setting", () => {
  // 主题：light-亮色(默认) dark-暗色
  const theme = useStorage<string>("theme", defaultSettings.theme);
  // 首页menu激活路由
  const homeActivepath = ref("/hot");
  const triggerCompToTop = ref("");

  const settingsMap: Record<string, Ref<SettingsValue>> = {
    homeActivepath,
    triggerCompToTop,
  };

  function changeSetting({
    key,
    value,
  }: {
    key: string;
    value: SettingsValue;
  }) {
    const setting = settingsMap[key];
    if (setting) {
      setting.value = value;
    }
  }

  // /**
  //  * 切换主题颜色
  //  *
  //  * @param color 主题颜色
  //  *
  //  */
  // function changeThemeColor(color: string) {
  //   themeColor.value = color;
  // }

  return {
    homeActivepath,
    triggerCompToTop,
    theme,
    changeSetting,
  };
});
