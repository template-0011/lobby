import { eventEmitter } from "@/01-kk-system/allUtils/eventEmitter";
import {
  TOKEN_AUTH_FAIL,
  HTTP_ERROR,
} from "@/01-kk-system/allDefine/common/const";
import { useUserStoreHook } from "@/store/modules/user";

// token fail
eventEmitter.on(TOKEN_AUTH_FAIL, (data: any) => {
  ElMessage.closeAll();
  // showMessage(data);
  const userStore = useUserStoreHook();
  userStore.resetToken();
  userStore.showLogin = true;
});

// http error
eventEmitter.on(HTTP_ERROR, (data: any) => {
  ElMessage.closeAll();
  showMessage(data);
});

const showMessage = (data: any) => {
  ElMessage.closeAll();
  ElMessage.error(data || "error");
};
