import { SizeEnum } from "./enums/SizeEnum";
import { ThemeEnum } from "./enums/ThemeEnum";

const { pkg } = __APP_INFO__;

const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

const defaultSettings: AppSettings = {
  title: pkg.name,
  version: pkg.version,
  theme: mediaQueryList.matches ? ThemeEnum.DARK : ThemeEnum.LIGHT,
  language: "en",
  themeColor: "#409EFF",
  showTokenAuthMessage: true,
};

export default defaultSettings;
