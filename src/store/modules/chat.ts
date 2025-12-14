import { ContactInfo, useKKTalk } from "@/04-kk-component-admin/components/hooks/useKKTalk";
import { store } from "@/store";

// setup
export const useChatStore = defineStore("chat", () => {
  const { loadChat: loadKKTalkChat, openChat: openKKTalkChat, setCustomData: setKKTalkCustomData } = useKKTalk()


  /**
   * 加载chat
   * @param chatCustomUrl
   */
  async function loadChat(hideWidget?: boolean, chatCustomUrl?: string) {
    loadKKTalkChat(hideWidget, chatCustomUrl)
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
    setKKTalkCustomData({
      name,
      email,
      phone,
      description,
      userID,
    })
  }
  /**
   * 设置客户信息
   * @param data
   */
  function setCustomData(data: ContactInfo) {
    setKKTalkCustomData(data)
  }
  /**
   * 打开客服
   */
  function openChat() {
    openKKTalkChat()
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
