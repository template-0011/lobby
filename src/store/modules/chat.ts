import { store } from "@/store";
import { getLanguage } from "@/i18n";
import { kkAuth } from "@/01-kk-system/allUtils/kkAuth";
import { platformHttp } from "@/01-kk-system/allHttp/userHall/platform";

type ContactInfo = {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  userID?: string;
};

// setup
export const useChatStore = defineStore("chat", () => {
  // const chatUrl = "//code.jivosite.com/widget/hqVvZCsJiG";
  const chatBaseUrl = "https://code.jivosite.com/widget/";
  const scriptID = "JIVOChat-Script";
  let chatLoaded = false;
  let chatConfig: Record<string, any> = {};

  /**
   * 加载chat
   * @param chatCustomUrl
   */
  async function loadChat(chatCustomUrl?: string) {
    const res = await platformHttp.getChatConfig();
    const { data } = res || {};
    if (data) {
      chatConfig = data;
    }
    removeScript();
    if (!chatConfig.jivochatID) {
      return;
    }
    console.log(chatConfig);
    let url = chatCustomUrl || `${chatBaseUrl}${chatConfig.jivochatID}`;
    // const chatUrl = chatConfig.jivochatUrl ? `${chatConfig.jivochatUrl}/widget/` : chatBaseUrl;
    // let url = chatCustomUrl || `${chatUrl}${chatConfig.jivochatID}`;
    url = url.includes("//") ? url : "//" + url;
    let head = document.getElementsByTagName("head")[0];
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.defer = true;
    script.id = scriptID;
    const lang = getLanguage();
    script.src = url + "?locale=" + lang;
    script.onload = () => {
      chatLoaded = true;
    };
    head.appendChild(script);
  }
  /**
   * 移除chat脚本
   */
  function removeScript() {
    let script = document.getElementById(scriptID);
    let ukefu = document.getElementById("jivo-iframe-container");
    script && document.head.removeChild(script);
    ukefu && document.body.removeChild(ukefu);
  }
  /**
   * 配置信息
   * @param name
   * @param email
   * @param phone
   * @param description
   */
  function setContactInfo({
    name = "",
    email = "",
    phone = "",
    description = "",
    userID = "",
  }: ContactInfo) {
    // @ts-ignore
    if (window.jivo_api) {
      // @ts-ignore
      window.jivo_api.setContactInfo({
        name,
        email,
        phone,
        description,
        userID,
      });
    }
  }
  /**
   * 设置客户信息
   * @param data
   */
  function setCustomData(data: any[]) {
    // @ts-ignore
    window.jivo_api && window.jivo_api.setCustomData(data);
  }
  /**
   * 打开客服
   */
  function openChat() {
    const userInfo = kkAuth.getUserInfo();
    const {
      userName = "",
      nickName = "",
      platformID = "",
      userID = "",
    } = userInfo || {};
    setContactInfo({ name: nickName });
    setCustomData([
      {
        title: "用户名：",
        content: userName,
      },
      {
        title: "用户ID",
        content: userID,
      },
      {
        title: "平台ID",
        content: platformID,
      },
    ]);
    // @ts-ignore
    console.log(window?.jivo_api);
    if (window?.jivo_api?.open) {
      console.log("opened");
      // @ts-ignore
      window.jivo_api.open();
    }
  }

  return {
    loadChat,
    setContactInfo,
    openChat,
    setCustomData,
  };
});

// 手动提供给 useStore() 函数 pinia 实例
export function useChatStoreHook() {
  return useChatStore(store);
}
