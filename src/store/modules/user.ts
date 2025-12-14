import { store } from "@/store";
import { kkAuth } from "@/01-kk-system/allUtils/kkAuth";
import { contractHttp, userHttp } from "@/01-kk-system/allHttp/userHall/user";
import {
  GameUserInfo,
  LoginRequestData,
} from "@/01-kk-system/allHttp/types/common";
import { platformHttp } from "@/01-kk-system/allHttp/userHall/platform";
import { getWalletAndCurrencyList } from "@/01-kk-system/middleware/cacheHttp";
import { getAvailableWalletsWithCurrency, getFlatAvailableWalletsInfo } from "@/01-kk-system/middleware/fusionApi/wallets";
import { BalanceType } from "@/types/api";
import { authenticationHttp } from "@/01-kk-system/allHttp/userHall/login";

export const useUserStore = defineStore("user", () => {
  const token = ref(kkAuth.getToken() || "");
  const userInfo = ref<GameUserInfo>(kkAuth.getUserInfo() || {});
  const showLogin = ref(false);
  const showRegester = ref(false);
  const currentWalletInfo = ref({
    walletType: "1",
    currencyCode: "1",
    abbreviation: "CNY",
    symbol: "CN¥",
  });
  const balanceInfo = ref<BalanceType>({});
  const walletAndCurrency = ref<Record<string, any>[]>([]);
  const avalableWallets = ref<Record<string, any>[]>([]);
  const avalableFlatWallets = ref<Record<string, any>[]>([]);
  const myContractSalary = ref<Record<string, any>[]>([]);

  function setLoginModalState(state: boolean) {
    showLogin.value = state;
  }

  function setRegesterModalState(state: boolean) {
    showRegester.value = state;
  }

  /**
   * 登录
   * @param {LoginRequestData}
   * @returns
   */
  function login(loginData: LoginRequestData) {
    return new Promise<void>((resolve, reject) => {
      const { userName, password } = loginData || {};
      authenticationHttp
        .login({ userName: userName.trim(), password: password })
        .then((response) => {
          const { code, data } = response || {};
          if (code === "0") {
            const tempToken = data?.userToken || "";
            token.value = tempToken;
            kkAuth.setToken(tempToken);
            if (tempToken) {
              getUserInfo().then(() => {
                resolve();
              }).catch(() => {
                reject();
              });
            } else {
              reject();
            }
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 试玩登录
  async function guestLogin() {
    try {
      const response = await authenticationHttp.visitorLogin()
      const { loginPassword, userName } = response?.data || {};
      const res = await authenticationHttp.login({ userName, password: loginPassword })
      const { code, data } = res || {};
      if (code === "0") {
        const tempToken = data?.userToken || "";
        token.value = tempToken;
        kkAuth.setToken(tempToken);
        if (tempToken) {
          await getUserInfo();
        }
      } else {
        throw new Error('login failed')
      }
    } catch (error: any) {
      throw new Error(error?.message ?? "login failed")
    }
  }

  // 获取信息
  async function getUserInfo() {
    const res = await userHttp.getAccount();
    const { data, code } = res || {};
    if (code === "0") {
      userInfo.value = data;
      const { currentCurrencyCode, currentWalletType } = data || {};
      currentWalletInfo.value.walletType = currentWalletType;
      currentWalletInfo.value.currencyCode = currentCurrencyCode;
      kkAuth.setUserInfo(data);
      getUserBanlance()
    }
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve) => {
      authenticationHttp.logout().then(() => {
        resolve();
      });
    });
  }
  // remove token
  function resetToken() {
    token.value = "";
    userInfo.value = {};
    kkAuth.clearToken();
    kkAuth.clearUserInfo();
  }
  // 获取钱包和币种列表
  async function fetchWallets() {
    if (walletAndCurrency.value && walletAndCurrency.value.length > 0) {
      return walletAndCurrency.value;
    }
    const list = await getWalletAndCurrencyList().catch(() => null);
    walletAndCurrency.value = list || [];
    return list || [];
  }

  // 列表查询【平台钱包disable】信息
  async function getAvailableWallets() {
    if (avalableWallets.value && avalableWallets.value.length > 0) {
      return avalableWallets.value;
    }
    const list = await getAvailableWalletsWithCurrency().catch(() => null);
    avalableWallets.value = list || [];
    return list || [];
  }
  // 获取可用钱包列表
  async function getFlatAvailableWalletList() {
    const list = await getFlatAvailableWalletsInfo().catch(() => null);
    avalableFlatWallets.value = list || [];
    return list || [];
  }
  // 获取余额
  async function getUserBanlance(params?: {
    walletType: string;
    currencyCode: string;
  }) {
    const { walletType, currencyCode } = params || currentWalletInfo.value;
    if (!walletType || !currencyCode) {
      return;
    }
    const res = await userHttp
      .getBalance(walletType, currencyCode)
      .catch(() => null);
    const { code, data } = res || {};
    if (code === "0" && data) {
      balanceInfo.value = data;
    } else {
      balanceInfo.value = {};
    }
    return balanceInfo.value;
  }
  // 设置钱包和币种信息
  function setCurrentWalletInfo(data: {
    walletType: string;
    currencyCode: string;
    abbreviation: string;
    symbol: string;
  }) {
    currentWalletInfo.value = data;
  }
  // 更新用户的钱包、币种、用户信息
  async function updateUserInfo() {
    // 更新用户钱包-币种
    const { walletType, currencyCode } = currentWalletInfo.value || {};
    // 更新用户信息和余额
    getUserInfo();
    getUserBanlance({ walletType, currencyCode });
  }
  // 获取我的契约 - 列表 - 使用第一个数据
  async function getMyContractSalary() {
    if (myContractSalary.value.length > 0) {
      return myContractSalary.value;
    }
    const res = await contractHttp.getMySalary().catch(() => null);
    const { code, data } = res || {};
    if (code === "0") {
      myContractSalary.value = data || [];
    }
  }

  return {
    token,
    userInfo,
    showLogin,
    showRegester,
    currentWalletInfo,
    walletAndCurrency,
    avalableWallets,
    balanceInfo,
    myContractSalary,
    login,
    getUserInfo,
    logout,
    resetToken,
    setLoginModalState,
    setRegesterModalState,
    getAvailableWallets,
    fetchWallets,
    setCurrentWalletInfo,
    updateUserInfo,
    getUserBanlance,
    getMyContractSalary,
    guestLogin,
    getFlatAvailableWalletList,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
