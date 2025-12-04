<script setup lang="ts">
import { PlatformImageCode } from "@/01-kk-system/allHttp/models/common";
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { localImg } from "@/01-kk-system/allUtils/utils";
import { useAppStore, useChatStore } from "@/store";

defineOptions({
  name: "Footer",
});

const chatStore = useChatStore();
const appStore = useAppStore();
const router = useRouter();

const logo = ref("");
const { t } = useI18n();

function openService() {
  chatStore.openChat();
}

function goTo(path: string) {
  router.push({ path: `/about/${path}` });
}

async function fetchLogo() {
  if (window.location.origin.includes('kk-template')) {
    logo.value = localImg('custom-images/app/logo.png')
    return
  }
  logo.value = await appStore.getAppLogoByCode(PlatformImageCode.PC_LOGO)
}

const menus = computed(() => {
  return [
    {
      title: t('web.i18nFront.title.egame'),
      id: 7,
      route: '/games',
      routeName: 'EGame',
      type: 'egame',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.fish'),
      id: 6,
      route: '/games',
      routeName: 'Fish',
      type: 'fish',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.lottery'),
      id: 2,
      route: '/games',
      routeName: 'GamesLobby',
      type: 'lottery',
      isHot: true,
    },
    {
      title: t('web.i18nFront.title.sports'),
      id: 3,
      route: '/sports',
      routeName: 'Sports',
      isHot: false,
      type: 'sports',
      children: null,
    },
    {
      title: t('web.i18nFront.title.realbet'),
      id: 4,
      route: '/games',
      routeName: 'Realbet',
      type: 'realbet',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.chess'),
      id: 5,
      route: '/games',
      routeName: 'chess',
      type: 'chess',
      isHot: false,
      children: null,
    },
  ]
})


const onClickMenu = (menu: IObject) => {
  if (menu.type !== 'group' && menu.type !== 'home') {
    router.push({
      path: menu.route,
      query: {
        t: menu.type,
      }
    })
  } else {
    router.push(menu.route)
  }
}

onBeforeMount(() => {
  fetchLogo();
});
</script>

<template>
  <footer class="min-h-200px mx-auto w-1200px color-[var(--kk-footer-text-color)] p-30px">
    <div class="flex items-center mb-12">
      <div class="min-w-12 h-5">
        <img v-if="logo" :src="logo" alt="logo" class="w-full h-full object-contain">
      </div>
      <div class="kk-divider-line"></div>
    </div>
    <div class="flex w-full">
      <div class="max-w-150px grow-1">
        <div class="text-12px font-600 leading-14px color-white">24/7 支持</div>
        <div class="mt-2 text-10px color-[#8692aca6]">如果您仍有疑问，请与我们联系</div>
      </div>
      <div class="max-w-830px flex-1 flex ml-35px">
        <div class="text-12px leading-14px mr-35px grow-[0.2]">
          <h5 class="text-10px color-[#5a647a] mb-10">我们</h5>
          <ul class="flex flex-col gap-2 color-white">
            <li class="footer-menu-item" @click="goTo('aboutUs')">
              <a>{{ $t("web.i18nFront.label.aboutUs") }}</a>
            </li>
            <li class="footer-menu-item" @click="goTo('response')">
              <a>{{ $t("web.i18nFront.label.gameBiling2") }}</a>
            </li>
            <li class="footer-menu-item" @click="openService">
              <a>{{ $t("web.i18nFront.label.contact") }}</a>
            </li>
          </ul>
        </div>
        <div class="text-12px leading-14px mr-35px grow-[0.2]">
          <h5 class="text-10px color-[#5a647a] mb-10">类别</h5>
          <ul class="flex flex-col gap-2 color-white">
            <li class="footer-menu-item" v-for="menu in menus" :key="menu.id" @click="onClickMenu(menu)">
              <a>{{ menu.title }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="w-310px ml-30px ml-auto">
        <div class="h-42px w-full flex items-center justify-between border border-[#ffffff26] px-4 rounded-3 hover:border-[#ffffff4d] transition-all cursor-pointer">
          <div class="flex items-center gap-2 color-white">
            <svg-icon icon-class="icon-ios" size="20px" />
            <div>
              <p class="text-8px color-[#ffffff80] leading-10px">应用</p>
              <p class="text-10px color-[#ffffff] leading-12px">iOS版本</p>
            </div>
          </div>
          <el-icon color="#ffffff" size="12px"><QuestionFilled /></el-icon>
        </div>
        <div class="mt-3 h-42px w-full flex items-center justify-between border border-[#ffffff26] px-4 rounded-3 hover:border-[#ffffff4d] transition-all cursor-pointer">
          <div class="flex items-center gap-2 color-white">
            <img src="@/assets/images/icons/icon-android2.svg" alt="android" class="w-20px h-20px">
            <div>
              <p class="text-8px color-[#ffffff80] leading-10px">应用</p>
              <p class="text-10px color-[#ffffff] leading-12px">Android版本</p>
            </div>
          </div>
          <el-icon color="#ffffff" size="12px"><QuestionFilled /></el-icon>
        </div>
        <div class="story-container mt-3">
          <div class=" color-white">
            <p class="text-14px font-600 w-[50%] color-[#f0f2f5] leading-5 mb-1">创始人的博客</p>
            <p class="text-12px w-[55%] color-[#9aa1b1] leading-4 mb-1">关于公司、业务及更多信息</p>
          </div>
        </div>
      </div>
    </div>
    <div class="kk-divider-line mt-10 mb-6"></div>

    <div class="">
       <div class="logo-container relative w-full flex justify-center items-center pb-5">
        <div class="w-4 h-4 i-carbon:facebook" />
          <div class="w-93px h-50px cursor-pointer transition-all group">
            <img class="h-full block group-hover:hidden" src="@/assets/images/home/icon-ag.png" alt="">
          <img class="h-full hidden group-hover:block" src="@/assets/images/home/icon-ag-a.png" alt="">
        </div>
        <div class="w-65px h-50px cursor-pointer transition-all group">
          <img class="h-full block group-hover:hidden" src="@/assets/images/home/icon-yoo.png" alt="">
          <img class="h-full hidden group-hover:block" src="@/assets/images/home/icon-yoo-a.png" alt="">
        </div>
        <div class="w-93px h-50px cursor-pointer transition-all group">
          <img class="h-full block group-hover:hidden" src="@/assets/images/home/icon-im.png" alt="">
          <img class="h-full hidden group-hover:block" src="@/assets/images/home/icon-im-a.png" alt="">
        </div>
        <div class="w-100px h-50px cursor-pointer transition-all group">
          <img class="h-full block group-hover:hidden" src="@/assets/images/home/icon-xm.png" alt="">
          <img class="h-full hidden group-hover:block" src="@/assets/images/home/icon-xm-a.png" alt="">
        </div>
        <div class="w-108px h-50px cursor-pointer transition-all group">
          <img class="h-full block group-hover:hidden" src="@/assets/images/home/icon-win.png" alt="">
          <img class="h-full hidden group-hover:block" src="@/assets/images/home/icon-win-a.png" alt="">
        </div>
        <div class="w-74px h-50px cursor-pointer transition-all group">
          <img class="h-full block group-hover:hidden" src="@/assets/images/home/icon-fb.png" alt="">
          <img class="h-full hidden group-hover:block" src="@/assets/images/home/icon-fb-a.png" alt="">
        </div>
        <div class="w-112px h-50px cursor-pointer transition-all group">
          <img class="h-full block group-hover:hidden" src="@/assets/images/home/icon-bg.png" alt="">
          <img class="h-full hidden group-hover:block" src="@/assets/images/home/icon-bg-a.png" alt="">
        </div>
       </div>
      <ul class="footer-menu flex-center py-4">
        <li class="footer-menu-item" @click="goTo('aboutUs')">
          <a>{{ $t("web.i18nFront.label.aboutUs") }}</a>
        </li>
        <li class="footer-menu-item" @click="goTo('response')">
          <a>{{ $t("web.i18nFront.label.gameBiling2") }}</a>
        </li>
        <li class="footer-menu-item" @click="openService">
          <a>{{ $t("web.i18nFront.label.contact") }}</a>
        </li>
      </ul>
      <p class="text-center">版权所有 ©2012-2024 kkgame保留所有权</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  width: 100%;
  background-color: var(--kk-body-bg-color);
  font-size: 13px;
}
.kk-divider-line {
  flex: 1;
  margin-left: 20px;
  margin-right: 18px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, .2) 9.92%, rgba(0, 0, 0, 0) 100%);
}
.story-container {
  background: #1C263C;
  background-image: url(@/assets/images/footer/angel.png);
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: 243px auto;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
  min-height: 148px;
  padding: 16px;
  width: 100%;
}

// .logo-container::before {
//   content: "";
//   position: absolute;
//   left: 0;
//   bottom: 2px;
//   width: 100%;
//   height: 1px;
//   background: #252733;
// }
// .logo-container::after {
//   content: "";
//   position: absolute;
//   left: 0;
//   bottom: 1px;
//   width: 100%;
//   height: 1px;
//   opacity: .2;
//   background: #5b607b;
// }
// .footer-content {
//   display: flex;
//   align-items: center;
//   padding: 42px 0 32px;
//   margin: 0 auto;
// }
// .footer-extra {
//   margin-right: 24px;
//   width: 300px;
// }
// .footer-menu {
//   display: flex;
//   flex-wrap: wrap;
// }
// .footer-menu-item {
//   position: relative;
//   font-size: 12px;
//   color: #ffffff;
//   margin-bottom: 10px;
// }
// .footer-menu-item a {
//   transition: all 0.3s ease;
//   cursor: pointer;
//   display: block;
//   color: inherit;
//   text-decoration: none;
//   font-weight: 400;
// }
// .footer-menu-item a:hover {
//   opacity: 0.8;
// }
// .footer-line {
//   height: 2px;
//   width: 1163px;
//   opacity: 0.5;
//   margin: 20px auto;
//   background: rgba(144, 162, 220, 0.2);
// }
</style>
