import { setupElIcons } from "./icons";
import { setupPermission } from "./permission";
// import { setupDirective } from '@/directive'
import { setupI18n } from "@/i18n";
import { setupRouter } from "@/router";
import { setupStore } from "@/store";
import { App } from "vue";

export default {
  install(app: App<Element>) {
    // 自定义指令(directive)
    // setupDirective(app)
    // 路由(router)
    setupRouter(app);
    // 状态管理(store)
    setupStore(app);
    // 国际化
    setupI18n(app);
    // Element-plus图标
    setupElIcons(app);
    // 路由守卫
    setupPermission();
  },
};
