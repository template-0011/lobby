<script setup lang="ts">
defineOptions({
  name: "UserAccount",
});
import { userTypes } from "@/01-kk-system/allDefine/enum/frontend/user";
import { userHttp } from "@/01-kk-system/allHttp/userHall/user";
import useFullLoading from "@/hooks/useFullLoading";
import { useUserStore } from "@/store";
import { translateTextBy } from "@/utils/i18n";

const userStore = useUserStore();
const { t } = useI18n();
const { showLoading, closeLoading } = useFullLoading();

const showLoginPwd = ref(false);
const showFundPwd = ref(false);
const showNickNamePwd = ref(false);
const showConfirm = ref(false);
const hasFundPwd = ref(false);
const loading = ref(false);
const showRealName = ref(false);
const realName = ref("");
const showIpList = ref(false);

const userTypeTxt = computed(() => {
  const i18nTxt = userTypes.getDes(userStore.userInfo.userType || "");
  return i18nTxt ? t(i18nTxt) : "--";
});

// const onSetPwdQ = () => {
//   showConfirm.value = true;
// };

async function checkFundPwdExist() {
  const res = await userHttp.checkFundpassword().catch(() => null);
  const { code, data } = res || {};
  console.log(code, data);
  hasFundPwd.value = data as unknown as boolean;
  return hasFundPwd.value;
}
function init() {
  checkFundPwdExist();
  checkRealName();
}
onBeforeMount(() => {
  init();
});

async function onShowPwdModal() {
  showLoading();
  await checkFundPwdExist();
  closeLoading();
  showFundPwd.value = true;
}

async function onSetRealName() {
  showLoading();
  const hasPwd = await checkFundPwdExist();
  closeLoading();
  if (hasPwd) {
    showRealName.value = true;
  } else {
    ElMessage.warning(translateTextBy("web.i18nFront.hint.confirmFundPwd"));
  }
}

async function checkRealName() {
  const res = await userHttp.getRealinfo();
  const { code, data } = res || {};
  if (code === "0") {
    realName.value = data?.realName;
  }
}
</script>

<template>
  <div class="app-container h-full bg-[#f3f6fc]">
    <div class="h-full" v-loading="loading">
      <div class="bg-white rounded-12px p-5">
        <h4 class="title">{{ $t("web.i18nFront.label.baseInfo") }}</h4>
        <div class="basic-info-main border border-#f2f2f6 rounded-12px p-5">
          <div class="basic-info-item !pl-0">
            <span> {{ `${$t("web.i18nFront.label.account1", "为了确保您的账户安全，请您填写相关安全信息，以备不时之需")}` }}</span>
          </div>
          <el-divider style="margin: 10px 0;" />
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-2 color-[var(--kk-title-text-color)]">
              <div class="w-9 h-9 flex-center bg-[var(--kk-title-text-color)] rounded-full">
                <svg-icon color="#ffffff" size="20px" icon-class="fund-password" />
              </div>
              <span>{{ $t("web.i18nFront.title.setFundPwd") }}</span>
            </div>
            <div class="flex items-center gap-2 color-[var(--kk-title-text-color)]">
              <div class="w-9 h-9 bg-[var(--kk-title-text-color)] flex-center rounded-full">
                <svg-icon color="#ffffff" size="20px" icon-class="real-name" />
              </div>
              <span>{{ $t("web.i18nFront.title.setRealName") }}</span>
            </div>
            <div class="flex items-center gap-2 color-[var(--kk-title-text-color)]">
              <div class="w-9 h-9 bg-[var(--kk-title-text-color)] flex-center rounded-full">
                <svg-icon color="#ffffff" size="20px" icon-class="trading-center" />
              </div>
              <span>{{ $t("web.i18nFront.title.goToTrade") }}</span>
            </div>
            <div class="flex items-center gap-2 color-[var(--kk-title-text-color)]">
              <div class="w-9 h-9 bg-[var(--kk-title-text-color)] flex-center rounded-full">
                <svg-icon color="#ffffff" size="20px" icon-class="trading-method" />
              </div>
              <span>{{ $t("web.i18nFront.title.addTradeWay") }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-12px p-5 mt-4">
        <h4 class="title">{{ $t("web.i18nFront.label.baseInfo") }}</h4>
        <div class="basic-info-main">
          <div class="basic-info-item">
            <span> {{ `${$t("web.i18nFront.label.account")}：` }}</span>
            <span>{{ userStore.userInfo.userName }}</span>
          </div>
          <div class="basic-info-item">
            <span>{{ `${$t("web.i18nFront.label.nickname")}：` }}</span>
            <span>{{ userStore.userInfo.nickName }}</span>
            <button class="modify-btn" @click="showNickNamePwd = true">
              {{ $t("system.i18nSystem.opration.edit") }}
            </button>
          </div>
          <div class="basic-info-item text-overflow">
            <span>{{ `${$t("web.i18nFront.label.memberType")}：` }}</span>
            {{ userTypeTxt }}
          </div>
          <div class="basic-info-item text-overflow">
            <span>{{ `${$t("web.i18nFront.label.availableMemory")}：` }}</span>
            {{ userStore.balanceInfo?.balance || "0.00" }}
          </div>
          <div class="basic-info-item">
            <span>{{ `${$t("web.i18nFront.label.lastLoginTime")}：` }}</span
            ><span>{{ userStore.userInfo.lastLoginDate }}</span>
          </div>
          <div class="basic-info-item text-overflow">
            <span>{{ `${$t("web.i18nFront.label.lastLoginIp")}：` }}</span>
            <span>{{ userStore.userInfo.lastLoginIP }}</span>
            <button class="modify-btn" @click="() => (showIpList = true)">
              {{ $t("web.i18nFront.label.ipHistory") }}
            </button>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-12px p-5 mt-4">
        <h4 class="title">{{ $t("web.i18nFront.label.accountSafe") }}</h4>
        <div class="w-full">
          <ul class="account-safety-box">
            <li class="account-row border border-#f2f2f6 rounded-2 p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <!-- <svg-icon icon-class="realname" size="36" /> -->
                  <img src="@/assets/icons/realname.svg" class="rounded-full w-9 h-9" />
                  <span class="title">{{ $t("web.i18nFront.label.realname") }}</span>
                </div>
                <div v-if="!realName" class="text-gray-500 flex-1 pl-5">{{ $t("web.i18nFront.operation.unSet") }}</div>
                <el-button
                  class="bg-[var(--el-color-primary)] color-white"
                  @click="onSetRealName"
                  >
                  {{
                    realName
                      ? $t("system.i18nSystem.opration.edit")
                      : $t("system.i18nSystem.label.unSet")
                  }}
                </el-button>
              </div>
            </li>
            <li class="account-row border border-#f2f2f6 rounded-2 p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <!-- <svg-icon icon-class="realname" size="36" /> -->
                  <img src="@/assets/icons/login-pwd.svg" class="rounded-full w-9 h-9" />
                  <span class="title">{{ $t("web.i18nFront.label.loginPwd") }}</span>
                </div>
                <el-button
                  class="bg-[var(--el-color-primary)] color-white"
                  @click="showLoginPwd = true"
                  >
                  {{ $t("system.i18nSystem.opration.edit") }}
                </el-button>
              </div>
            </li>
            <li class="account-row border border-#f2f2f6 rounded-2 p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img src="@/assets/icons/fund-pwd.svg" class="rounded-full w-9 h-9" />
                  <span class="title">{{ $t("web.i18nFront.label.moneyPwd") }}</span>
                </div>
                <div v-if="!hasFundPwd" class="text-gray-500 flex-1 pl-5">{{ $t("web.i18nFront.operation.unSet") }}</div>
                <el-button
                  class="bg-[var(--el-color-primary)] color-white"
                  @click="onShowPwdModal"
                  >
                  {{
                    hasFundPwd
                      ? $t("system.i18nSystem.label.edit")
                      : $t("system.i18nSystem.label.unSet")
                  }}
                </el-button>
              </div>
            </li>
          </ul>
          <!-- <div class="w-full flex items-center justify-between">
        <h4 class="title">管理钱包</h4>
        <span class="subtitle">卡片数量 0/0</span>
      </div>
      <div class="bank-card-main">
        <div class="bank-card-item flex-center">
          <div class="add-bank-card">
            <i class="add-icon">+</i>
            <span>添加虚拟钱包</span>
          </div>
        </div>
      </div> -->
        </div>
      </div>
    </div>
    <ResetLoginPwd v-model="showLoginPwd" />
    <ResetLoginNiceName v-model="showNickNamePwd" />
    <ResetRealName
      v-model="showRealName"
      :real-name="realName"
      @refresh="checkRealName"
    />
    <ComfirmModal v-model="showConfirm" />
    <FundPwd
      v-model="showFundPwd"
      :has-fund-pwd="hasFundPwd"
      @onRefreshPwd="checkFundPwdExist"
    />
    <IpListModal v-model="showIpList" />
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding: 10px 0 8px;
  font-weight: 700;
  font-size: 16px;
  line-height: 26px;
}
.basic-info-main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  overflow: hidden;
}

.basic-info-main .basic-info-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 50%;
  height: 42px;
  line-height: 42px;
  padding-left: 20px;
}
.basic-info-main .basic-info-item span {
  font-size: 14px;
  min-width: 42px;
}
.basic-info-main .basic-info-item span:first-child {
  color: var(--kk-title-text-color);
}
.basic-info-main .basic-info-item .modify-btn {
  border-radius: 3px;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
  background: var(--el-color-primary);
  border: none;
  color: #fff;
  padding: 0 10px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: 0.25s linear;
  font-size: 12px;
}
.account-safety-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: -12px 0 0;
  padding: 0;
}
.account-safety-box li {
  list-style: none;
  position: relative;
  padding: 16px;
  margin-top: 12px;
  width: 100%;
  border-radius: 10px;
  line-height: 22px;
  background: var(--kk-edit-card-bg);
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.06);
}

.account-safety-box li .title {
  padding: 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  display: block;
}
.account-safety-box li .content {
  font-size: 12px;
}
// .account-safety-box li .btn {
//   position: absolute;
//   right: 12px;
//   top: 8px;
//   padding: 0 5px;
//   width: 46px;
//   height: 24px;
//   line-height: 23px;
//   border: none;
//   color: #fff;
//   font-size: 12px;
// }
.account-safety-box .unset-btn {
  --el-button-bg-color: var(--el-color-primary);
  --el-button-hover-bg-color: var(--el-color-primary);
}

// .bank-card-item {
//   position: relative;
//   width: 202px;
//   margin-right: 12px;
//   border-radius: 12px;
//   background: var(--cp-color16);
//   height: 106px;
//   margin-top: 12px;
// }
// .bank-card-item:hover {
//   background: var(--cp-color324);
// }
// .add-bank-card {
//   height: 24px;
//   color: #e8e5f1;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 14px;
//   outline: none;
// }
.add-icon {
  display: block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  text-align: center;
  line-height: 24px;
  border-radius: 50%;
  color: #fff;
  background: var(--el-color-primary);
  font-style: normal;
  font-size: 24px;
}
</style>
