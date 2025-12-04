import type { App } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia();
store.use(createPersistedState({
  key: id => `__kk_ps_pc__${id}`,
}))

// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store);
}

export * from "./modules/app";
export * from "./modules/permission";
export * from "./modules/user";
export * from "./modules/chat";
export * from "./modules/game";
export * from "./modules/gameCollection";
export { store };
