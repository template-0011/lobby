<template>
  <div class="login-container">
    <!-- 顶部 -->
    <div class="absolute-lt flex-x-end py-3 px-12 w-full">
      <switch-language />
    </div>
    <el-card class="!border-none !bg-transparent !rounded-4% w-100 <sm:w-85">
      <div class="text-center relative">
        <h2>{{ defaultSettings.title }}</h2>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="userName">
          <div class="flex-y-center w-full">
            <svg-icon icon-class="user" class="mx-2" />
            <el-input
              v-model="loginData.userName"
              :placeholder="$t('system.i18nSystem.label.userName')"
              name="userName"
              size="large"
              class="h-[48px]"
            />
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="flex-y-center w-full">
            <svg-icon icon-class="lock" class="mx-2" />
            <el-input
              v-model="loginData.password"
              :placeholder="$t('system.i18nSystem.label.password')"
              type="password"
              name="password"
              @keyup="checkCapslock"
              @keyup.enter="handleLogin"
              size="large"
              class="h-[48px] pr-2"
              show-password
            />
          </div>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          size="large"
          class="w-full"
          @click.prevent="handleLogin"
          >{{ $t("system.i18nSystem.opration.login") }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store";
import { LoginRequestData } from "@/01-kk-system/allHttp/types/common";
import type { FormInstance } from "element-plus";
import { LocationQuery, useRoute } from "vue-router";
import router from "@/router";
import defaultSettings from "@/settings";

const userStore = useUserStore();
const route = useRoute();

// Internationalization
const { t } = useI18n();

// Reactive states
const loading = ref(false); // 按钮loading
const isCapslock = ref(false); // 是否大写锁定
const loginFormRef = ref<FormInstance>(); // 登录表单ref

const loginData = ref<LoginRequestData>({
  userName: "admin",
  password: "12345678",
});

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

// 登录
function handleLogin() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          const { path, queryParams } = parseRedirect();
          router.push({ path: path, query: queryParams });
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

// 解析 redirect 字符串 为 path 和  queryParams
function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query: LocationQuery = route.query;
  const redirect = (query.redirect as string) ?? "/";

  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return { path, queryParams };
}

/** 检查输入大小写 */
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  overflow-y: auto;

  @apply wh-full flex-center;

  .login-form {
    padding: 30px 10px;
  }
}

.el-form-item {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景颜色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}
</style>
