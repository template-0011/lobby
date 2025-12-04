// @ts-nocheck
import { ElLoading } from "element-plus";

window.$cusLoading = null;

export default () => {
  const showLoading = (options?: any) => {
    closeLoading();
    window.$cusLoading = ElLoading.service({
      lock: true,
      fullscreen: true,
      ...options,
    });
  };

  const closeLoading = () => {
    window.$cusLoading && window.$cusLoading.close();
    window.$cusLoading = null
  };
  return { showLoading, closeLoading };
};
