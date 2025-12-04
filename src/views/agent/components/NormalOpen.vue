<script setup lang="ts">
import { subordinateHttp } from "@/01-kk-system/allHttp/userHall/team";
import { transformBy } from "@/01-kk-system/allUtils/utils";
import { useUserStore } from "@/store";
import type { FormInstance, FormRules } from "element-plus";

defineOptions({
  name: "NormalOpen",
});

interface RuleForm {
  bonusGroupOffi: number;
  bonusGroupSelf: number;
  bonusGroupThird: number;
  loginPassword: string;
  nickName: string;
  userName: string;
}

const { t } = useI18n();

const userStore = useUserStore();
const openFormRef = ref<FormInstance>();

const bonusGroupOffi = computed(() => userStore.userInfo.bonusGroupOffi);
const bonusGroupSelf = computed(() => userStore.userInfo.bonusGroupSelf);
const bonusGroupThird = computed(() => userStore.userInfo.bonusGroupThird);

const openForm = ref<RuleForm>({
  bonusGroupOffi: 0,
  bonusGroupSelf: 0,
  bonusGroupThird: 0,
  loginPassword: "",
  nickName: "",
  userName: "",
});
const loading = ref(false);

const rules = reactive<FormRules<RuleForm>>({
  userName: [
    {
      required: true,
      pattern: /^[a-zA-Z][a-zA-Z0-9]{5,15}$/,
      message: t("web.i18nFront.hint.userNameR"),
      trigger: "blur",
    },
  ],
  loginPassword: [
    {
      required: true,
      pattern: /^[a-zA-Z0-9_]{4,16}$/,
      message: t("web.i18nFront.hint.pwdR"),
      trigger: ["blur", "change"],
    },
  ],
  bonusGroupThird: [
    {
      type: "number",
      required: true,
      min: 0,
      validator: (_: any, value: any, callback: any) => {
        if (typeof value === "undefined") {
          return callback(t("system.i18nSystem.placeholder.input"));
        }
        const num = Number(value);
        if (num < 0 || num > Number(bonusGroupThird.value || 0)) {
          return callback(
            t("web.i18nFront.hint.rangeError", { max: bonusGroupThird.value })
          );
        }
        return callback();
      },
      trigger: ["blur", "change"],
    },
  ],
  bonusGroupSelf: [
    {
      type: "number",
      required: true,
      min: 0,
      validator: (_: any, value: any, callback: any) => {
        if (typeof value === "undefined") {
          return callback(t("system.i18nSystem.placeholder.input"));
        }
        const num = Number(value);
        if (num < 0 || num > Number(bonusGroupSelf.value || 0)) {
          return callback(
            t("web.i18nFront.hint.rangeError", { max: bonusGroupSelf.value })
          );
        }
        return callback();
      },
      trigger: ["blur", "change"],
    },
  ],
  bonusGroupOffi: [
    {
      type: "number",
      required: true,
      min: 0,
      validator: (_: any, value: any, callback: any) => {
        if (typeof value === "undefined") {
          return callback(t("system.i18nSystem.placeholder.input"));
        }
        const num = Number(value);
        if (num < 0 || num > Number(bonusGroupOffi.value || 0)) {
          return callback(
            t("web.i18nFront.hint.rangeError", { max: bonusGroupOffi.value })
          );
        }
        return callback();
      },
      trigger: ["blur", "change"],
    },
  ],
});

function resetForm() {
  if (openFormRef.value) {
    openFormRef.value.resetFields();
  }
}

async function submitForm() {
  const validate = await openFormRef?.value?.validate().catch(() => null);
  if (!validate) {
    return;
  }
  loading.value = true;
  const res = await subordinateHttp.create(openForm.value).catch(() => null);
  const { code } = res || {};
  if (code === "0") {
    ElMessage.success(t("system.i18nSystem.hint.createSuccess"));
    resetForm();
  }

  loading.value = false;
}

const create = useThrottleFn(submitForm, 3000);

function onInput(value: string, type: "offi" | "hot" | "other") {
  const tnum = Number(transformBy(value));
  if (type === "other") {
    openForm.value.bonusGroupThird = tnum;
  } else if (type === "offi") {
    openForm.value.bonusGroupOffi = tnum;
  } else if (type === "hot") {
    openForm.value.bonusGroupSelf = tnum;
  }
}
</script>

<template>
  <div class="my-4">
    <h3 class="mb-2 text-sm">{{ $t("web.i18nFront.tips.normalOpen") }}</h3>
    <p class="text-sm">1. {{ $t("web.i18nFront.tips.normalOpen1") }}</p>
    <p class="text-sm">2. {{ $t("web.i18nFront.tips.normalOpen2") }}</p>
    <p class="text-sm color-#f07354">
      3. {{ $t("web.i18nFront.tips.normalOpen3") }}
    </p>
  </div>
  <el-form :model="openForm" :rules="rules" ref="openFormRef" class="openForm">
    <el-card shadow="never">
      <template #header>
        <span>{{ $t("web.i18nFront.label.baseSet") }}</span>
      </template>
      <el-form-item
        prop="userName"
        :label="`${$t('system.i18nSystem.label.userName')}:`"
        label-width="80px"
        class="max-w-500px"
      >
        <el-input
          v-model="openForm.userName"
          :placeholder="$t('web.i18nFront.hint.userNameR')"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="nickName"
        :label="`${$t('system.i18nSystem.label.nickName')}:`"
        label-width="80px"
        class="max-w-500px"
      >
        <el-input
          v-model="openForm.nickName"
          :placeholder="$t('system.i18nSystem.label.nickName')"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="loginPassword"
        :label="`${$t('system.i18nSystem.label.password')}:`"
        label-width="80px"
        class="max-w-500px"
      >
        <el-input
          v-model="openForm.loginPassword"
          :placeholder="$t('web.i18nFront.hint.pwdR')"
        />
      </el-form-item>
    </el-card>
    <el-card shadow="never" class="mt-5">
      <template #header>
        <span>{{ $t("web.i18nFront.label.rebateSet") }}</span>
      </template>
      <el-form-item
        prop="bonusGroupOffi"
        :label="`${$t('web.i18nFront.label.classicLott')}:`"
        label-width="120px"
        class="max-w-500px"
      >
        <el-input
          type="number"
          v-model="openForm.bonusGroupOffi"
          @input="onInput($event, 'offi')"
          :min="0"
          :max="bonusGroupOffi"
          :placeholder="$t('system.i18nSystem.placeholder.input')"
        />
        <span>{{
          $t("web.i18nFront.hint.rangeError", { max: bonusGroupOffi })
        }}</span>
      </el-form-item>
      <el-form-item
        prop="bonusGroupSelf"
        :label="`${$t('web.i18nFront.label.hotLott')}:`"
        label-width="120px"
        class="max-w-500px"
      >
        <el-input
          type="number"
          :min="0"
          :max="bonusGroupSelf"
          @input="onInput($event, 'hot')"
          v-model="openForm.bonusGroupSelf"
          :placeholder="$t('system.i18nSystem.placeholder.input')"
        />
        <span>{{
          $t("web.i18nFront.hint.rangeError", { max: bonusGroupSelf })
        }}</span>
      </el-form-item>
      <el-form-item
        prop="bonusGroupThird"
        :label="`${$t('web.i18nFront.label.aboradLott')}:`"
        label-width="120px"
        class="max-w-500px"
      >
        <el-input
          type="number"
          :min="0"
          @input="onInput($event, 'other')"
          :max="bonusGroupThird"
          v-model="openForm.bonusGroupThird"
          :placeholder="$t('system.i18nSystem.placeholder.input')"
        />
        <span>{{
          $t("web.i18nFront.hint.rangeError", { max: bonusGroupThird })
        }}</span>
      </el-form-item>
      <div class="flex-center mt-10">
        <el-button @click="resetForm">
          {{ $t("system.i18nSystem.opration.reset") }}
        </el-button>
        <el-button type="primary" :loading="loading" @click="create">
          {{ $t("system.i18nSystem.opration.confirm") }}
        </el-button>
      </div>
    </el-card>
  </el-form>
</template>

<style lang="scss" scoped>
.openForm {
  --el-form-label-font-size: 14px;
  --el-font-size-base: 14px;
}
</style>
