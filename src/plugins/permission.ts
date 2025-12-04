import { ElMessage } from "element-plus";
import NProgress from "nprogress"; // progress bar
import router from "@/router";
import { usePermissionStore, useUserStore, useUserStoreHook } from "@/store";
import "nprogress/nprogress.css"; // progress bar style
import { kkAuth } from "@/01-kk-system/allUtils/kkAuth";

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login"];
  const userStore = useUserStoreHook();

  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // document.title = getPageTitle(to.meta.title)

    const hasToken = kkAuth.getToken();
    const needLogin = to.meta?.needLogin;

    console.log("---hasToken------", hasToken, to);
    // if (needLogin && !hasToken) {
    //   next({ path: "/" });
    //   userStore.showLogin = true;
    // } else {
    //   next();
    // }

    if (hasToken) {
      if (to.path === "/login") {
        next({ path: "/" });
      } else {
        const userStore = useUserStore();
        const hasGetUserInfo = userStore.userInfo?.userID;
        if (hasGetUserInfo) {
          next();
        } else {
          try {
            await userStore.getUserInfo();
            next();
          } catch (error) {
            userStore.resetToken();
            await userStore.getUserInfo();
            ElMessage.error(error || "Has Error");
            next(`/`);
            userStore.showLogin = true;
          }
        }
      }
    } else {
      if (needLogin) {
        next('/');
        userStore.showLogin = true;
      } else {
        next();
      }
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}


export function hasAuth(key: string): boolean {
  return true
}
