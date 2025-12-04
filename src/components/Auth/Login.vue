<template>
  <el-dialog
    :append-to-body="true"
    :title="$t('system.i18nSystem.opration.login')"
    v-model="visible"
    center
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="loginFormRef"
      :model="loginData"
      :rules="loginRules"
      class="login-form"
    >
      <el-form-item prop="userName">
        <div class="flex-y-center w-full">
          <el-input
            v-model="loginData.userName"
            prefix-icon="User"
            :placeholder="$t('system.i18nSystem.label.userName')"
            name="userName"
            size="large"
            class="h-[48px]"
          />
        </div>
      </el-form-item>

      <el-form-item prop="password">
        <div class="flex-y-center w-full">
          <el-input
            v-model="loginData.password"
            :placeholder="$t('system.i18nSystem.label.password')"
            type="password"
            name="password"
            prefix-icon="Lock"
            @keyup="checkCapslock"
            @keyup.enter="handleLogin"
            size="large"
            class="h-[48px]"
            show-password
          >
          </el-input>
        </div>
      </el-form-item>

      <div class="pb-5 flex items-center justify-between">
        <el-checkbox v-model="isRemember" :label="$t('web.i18nFront.label.keepPwd')" size="large" />
        <template v-if="showInviteBtn && regesterLink" >
          <el-link target="_blank" :href="regesterLink">{{ $t("web.i18nFront.label.registLink") }}</el-link>
        </template>
        <el-button
          v-if="showTryGames"
          round
          class="text-[--kk-hightlight-text-color]"
          style="--el-link-hover-text-color: #597ef7"
          :loading="loading"
          @click="guestLogins"
        >
          {{ $t("web.i18nFront.label.tryPlay") }}
        </el-button>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        size="large"
        style="--start-color: #597ef7; --end-color: #597ef7"
        class="w-full login-btn"
        @click.prevent="handleLogin"
        >{{ $t("system.i18nSystem.opration.login") }}
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { translateTextBy } from "@/utils/i18n";
import { FormInstance, FormRules } from "element-plus";
import { LoginRequestData } from "@/01-kk-system/allHttp/types/common";
import { useAppStore, useUserStore } from "@/store";
import { getUserLocalInfo, saveUserLocalInfo } from "@/04-kk-component-admin/components/hooks/commonUtil";
import { platformHttp } from "@/01-kk-system/allHttp/userHall/platform";
import { getDomainName } from "@/01-kk-system/allUtils/utils";

const { t } = useI18n();
const userStore = useUserStore();
const appStore = useAppStore();

const visible = defineModel<boolean>({ required: true });
const regesterLink = ref('')
const loading = ref(false); // 按钮loading
const isCapslock = ref(false); // 是否大写锁定
const loginFormRef = ref<FormInstance>(); // 登录表单ref
const loginData = ref<LoginRequestData>({
  userName: "",
  password: "",
});
const isRemember = ref(false)
const showTryGames = ref(false)
const showInviteBtn = ref(false)
const inviteUrlList = ref<string[]>([])

const loginRules = computed(() => {
  return {
    userName: [
      {
        required: true,
        trigger: "blur",
        message: t("system.i18nSystem.message.username_require"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("system.i18nSystem.message.password_required"),
      },
      {
        min: 6,
        message: t("system.i18nSystem.message.password_min"),
        trigger: "blur",
      },
    ],
  };
});

const handleClose = () => {
  userStore.setLoginModalState(false);
  loginFormRef.value?.resetFields();
};

const fetchInviteUrl = async () => {
  const res = await platformHttp.inviteUrl()
  if (res?.code === "0") {
    const list = res?.data ?? []
    const currentDomainName = getDomainName()
    const target = list.find((item: { invitationURL: string | string[]; }) => item.invitationURL?.includes(currentDomainName))
    if (target) {
      regesterLink.value = target.invitationURL
    } else {
      regesterLink.value = list[0]?.invitationURL ?? ''
    }
  }
}

watchEffect(async () => {
  if (visible.value) {
    const localInfo = getUserLocalInfo()
    loginData.value.userName = localInfo?.userName ?? ''
    loginData.value.password = localInfo?.password ?? ''
    isRemember.value = !!localInfo?.userName
    try {
      loading.value = true
      await Promise.allSettled([
        handleDiffConfig(), // // 配置查询
        fetchInviteUrl(), // 查询注册链接
      ])
      loading.value = false
    } catch (error) {
      loading.value = false
    }
  }
})

async function handleDiffConfig() {
  const diffConfig = await appStore.getDiffConfig()
  if (diffConfig?.SHOW_BUTTON_SHIWAN) {
    showTryGames.value = diffConfig?.SHOW_BUTTON_SHIWAN.value === '1'
  } else {
    showTryGames.value = true
  }
  if (diffConfig?.SHOW_BUTTON_ZHUCE) {
    showInviteBtn.value = diffConfig?.SHOW_BUTTON_ZHUCE.value === '1'
  } else {
    showInviteBtn.value = false
  }
}

// 登录
function handleLogin() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          // 若记住密码，则本地存储, 否则删除本地信息
          if (isRemember.value) {
            saveUserLocalInfo(loginData.value)
          }
          else {
            saveUserLocalInfo(null)
          }
          handleClose();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

// 试玩
async function guestLogins() {
  try {
    loading.value = true;
    await userStore.guestLogin()
    handleClose();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

/** 检查输入大小写 */
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

// 忘记密码
interface PwdForm {
  newPassword: string;
  oldPassword: string;
  confirmPassword: string;
}
const pwdFormRef = ref<FormInstance>(); // 登录表单ref
const pwdForm = reactive<PwdForm>({
  newPassword: "",
  oldPassword: "",
  confirmPassword: "",
});

const validatePwd2 = (rule: any, value: any, callback: any) => {
  if (pwdForm.newPassword !== value) {
    callback(new Error(translateTextBy("system.i18nSystem.hint.pwdDiff")));
  }
  callback();
};

const rules = reactive<FormRules<PwdForm>>({
  oldPassword: [
    {
      required: true,
      message: translateTextBy("system.i18nSystem.placeholder.input"),
      trigger: "blur",
    },
  ],
  newPassword: [
    {
      required: true,
      message: translateTextBy("system.i18nSystem.placeholder.input"),
      trigger: "blur",
    },
    {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![_\W]+$)\w{3,50}$/,
      message: translateTextBy("system.i18nSystem.hint.rightpwd"),
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: translateTextBy("system.i18nSystem.placeholder.input"),
      trigger: "blur",
    },
    {
      validator: validatePwd2,
      trigger: "blur",
    },
  ],
});
</script>

<style lang="scss" scoped></style>
