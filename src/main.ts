import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

// 本地SVG图标
import "virtual:svg-icons-register";

// 样式
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
import "./handleHttpError";
import { getMobileHref, isMobileDevice } from "./01-kk-system/allUtils/utils";

  // 如果是手机访问，怎跳转到h5
  if (isMobileDevice() && import.meta.env.PROD) {
    location.href = getMobileHref()
  }

const app = createApp(App);
app.use(setupPlugins);
app.mount("#app");
