import type { App } from "vue";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";

export const Layout = () => import("@/layout/index.vue");
export const Layout2 = () => import("@/layout2/index.vue");
export const LayoutGame = () => import("@/layout3/index.vue");

const ROUTER_PREFIX = "admin.i18nWebCluster.route";

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: '/download',
    component: () => import('@/views/download/index.vue'),
    name: 'Download',
    meta: {
      title: "下载",
      keepAlive: false,
      alwaysShow: false,
    },
  },
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
        name: "Home", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
        meta: {
          title: "system.i18nSystem.label.dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: "activity",
        component: () => import("@/views/activity/index.vue"),
        name: "Activity",
        meta: {
          title: "system.i18nSystem.label.dashboard",
          icon: "homepage",
          affix: true,
          needLogin: true,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: "games-lobby",
        component: () => import("@/views/games-lobby/index.vue"),
        name: "GamesLobby",
        meta: {
          title: "游戏大厅",
          icon: "homepage",
          affix: true,
          needLogin: true,
          keepAlive: false,
          alwaysShow: false,
        },
      },
      {
        path: "games",
        component: () => import("@/views/games-lobby/index.vue"),
        name: "GamesListPage",
        meta: {
          title: "游戏大厅",
          icon: "homepage",
          affix: true,
          needLogin: true,
          keepAlive: false,
          alwaysShow: false,
        },
      },
      {
        path: "sports",
        component: () => import("@/views/sports/index.vue"),
        name: "Sports",
        meta: {
          title: "体育",
          icon: "homepage",
          affix: true,
          needLogin: true,
          keepAlive: false,
          alwaysShow: false,
        },
      },
      {
        path: "game-room",
        component: () => import("@/views/gameRoom/index.vue"),
        name: "GameRoom",
        meta: {
          title: "游戏房间",
        },
      },
      // {
      //   path: "realbet",
      //   component: () => import("@/views/realbet/index.vue"),
      //   name: "Realbet",
      //   meta: {
      //     title: "真人",
      //     icon: "homepage",
      //     affix: true,
      //     needLogin: true,
      //     keepAlive: false,
      //     alwaysShow: false,
      //   },
      // },
      // {
      //   path: "chess",
      //   component: () => import("@/views/chess/index.vue"),
      //   name: "Chess",
      //   meta: {
      //     title: "真人",
      //     icon: "homepage",
      //     affix: true,
      //     needLogin: true,
      //     keepAlive: false,
      //     alwaysShow: false,
      //   },
      // },
      // {
      //   path: "fish",
      //   component: () => import("@/views/fish/index.vue"),
      //   name: "Fish",
      //   meta: {
      //     title: "真人",
      //     icon: "homepage",
      //     affix: true,
      //     needLogin: true,
      //     keepAlive: false,
      //     alwaysShow: false,
      //   },
      // },
      // {
      //   path: "egame",
      //   component: () => import("@/views/egame/index.vue"),
      //   name: "EGame",
      //   meta: {
      //     title: "真人",
      //     icon: "homepage",
      //     affix: true,
      //     needLogin: true,
      //     keepAlive: false,
      //     alwaysShow: false,
      //   },
      // },
      {
        path: "group/:groupId",
        name: "GameGroup",
        component: () => import("@/views/gameGroups/index.vue"),
        meta: {
          title: `游戏组`,
          icon: "el-icon-UserFilled",
          hidden: false,
          needLogin: true,
          keepAlive: false,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "about/:type",
        component: () => import("@/views/about/index.vue"),
        name: "AboutPage",
        meta: {
          title: "关于我们",
          icon: "homepage",
          keepAlive: false,
          alwaysShow: false,
        },
      },
      {
        path: "help",
        name: "HelpCenter",
        component: () => import("@/views/help/index.vue"),
        meta: {
          title: `帮助中心`,
          icon: "el-icon-UserFilled",
          hidden: false,
          keepAlive: false,
          needLogin: true,
          alwaysShow: false,
          params: null,
        },
      },
    ],
  },
  {
    path: "/personal",
    component: Layout2,
    redirect: "/personal/account",
    meta: {
      title: `个人`,
    },
    children: [
      {
        path: "account",
        name: "UserAccount",
        component: () => import("@/views/account/index.vue"),
        meta: {
          title: `我的资料`,
          icon: "el-icon-UserFilled",
          hidden: false,
          keepAlive: false,
          needLogin: true,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "finance/:menu",
        name: "UserFinance",
        component: () => import("@/views/wallet/index.vue"),
        meta: {
          title: `我的资料`,
          icon: "el-icon-UserFilled",
          hidden: false,
          keepAlive: false,
          needLogin: true,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "proportion/:menu",
        name: "UserProportion",
        component: () => import("@/views/rewards/index.vue"),
        meta: {
          title: `待遇总览`,
          icon: "el-icon-UserFilled",
          hidden: false,
          needLogin: true,
          keepAlive: false,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "report/:menu",
        name: "UserRreport",
        component: () => import("@/views/report/index.vue"),
        meta: {
          title: `个人报表`,
          icon: "el-icon-UserFilled",
          hidden: false,
          needLogin: true,
          keepAlive: false,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "bill",
        name: "UserBill",
        component: () => import("@/views/bill/index.vue"),
        meta: {
          title: `账户明细`,
          icon: "el-icon-UserFilled",
          hidden: false,
          needLogin: true,
          keepAlive: false,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "announcement",
        name: "Announcement",
        component: () => import("@/views/announcement/index.vue"),
        meta: {
          title: `平台公告`,
          icon: "el-icon-UserFilled",
          hidden: false,
          keepAlive: false,
          needLogin: true,
          alwaysShow: false,
          params: null,
        },
      },
    ],
  },
  {
    path: "/agent",
    component: Layout2,
    redirect: "/agent/account/open",
    meta: {
      title: `代理`,
    },
    children: [
      {
        path: "account/:menu",
        name: "AgentAccount",
        component: () => import("@/views/agent/index.vue"),
        meta: {
          title: `代理推广`,
          icon: "el-icon-UserFilled",
          hidden: false,
          keepAlive: false,
          needLogin: true,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "report/:menu",
        name: "AgentReport",
        component: () => import("@/views/agentReport/index.vue"),
        meta: {
          title: `代理报表`,
          icon: "el-icon-UserFilled",
          hidden: false,
          keepAlive: false,
          needLogin: true,
          alwaysShow: false,
          params: null,
        },
      },
    ],
  },

  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: { hidden: true },
  },
  { path: "/:catchAll(.*)", redirect: "/404", meta: { hidden: true } },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  // scrollBehavior: () => ({ left: 0, top: 0 }),
  scrollBehavior: (to, from, savedPosition) => {
    // 对所有路由变化强制滚动到顶部
    return { top: 0, left: 0, behavior: 'smooth' }
  },
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

router.afterEach((to, from) => {
  window.document?.body?.scrollTo(0, 0)
})

export default router;
