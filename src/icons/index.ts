import SvgIcon from "@/04-kk-component-admin/components/SvgIcon/index.vue"; // Svg Component
import "virtual:svg-icons-register";
import type { App } from "vue";

export function loadSvg(app: App<Element>) {
  app.component("SvgIcon", SvgIcon);
}
