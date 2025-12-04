<script setup lang="ts">
import { userHttp } from "@/01-kk-system/allHttp/userHall/user";
import { IObject } from "@/components/CURD/types";
import { translateTextBy } from "@/utils/i18n";
import { FormInstance, FormRules } from "element-plus";

defineOptions({
  name: "ResetLoginPwdModal",
});
const modalVisible = defineModel({ required: true, default: false });

const emit = defineEmits<{
  onUpdateClick: [editData: IObject];
}>();

const { t } = useI18n();

const handleCloseModal = () => {
  pwdFormRef?.value?.resetFields();
  modalVisible.value = false;
};

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
const loading = ref(false);

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
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
      message: translateTextBy("system.i18nSystem.hint.rightUserpwd"),
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

const onSubmit = async () => {
  const validate = await pwdFormRef?.value?.validate().catch(() => null);
  console.log(validate);
  if (!validate) {
    return;
  }
  loading.value = true;
  const { newPassword, oldPassword } = pwdForm;
  const res = await userHttp
    .updateLoginpassword({ newPassword, oldPassword })
    .catch(() => null);
  const { code } = res || {};
  if (code === "0") {
    handleCloseModal();
    ElMessage.success(t("system.i18nSystem.hint.resetSuccess"));
  }
  loading.value = false;
};
</script>

<template>
  <el-dialog
    v-model="modalVisible"
    :align-center="true"
    :append-to-body="true"
    :title="$t('system.i18nSystem.opration.resetPasswordLogin')"
    width="540px"
    style="padding-right: 0"
    @close="handleCloseModal"
  >
    <h2 class="py-5 text-center color-#e5b781 text-14px">
      {{ $t("system.i18nSystem.hint.rightUserpwd") }}
    </h2>
    <el-form
      ref="pwdFormRef"
      label-width="auto"
      :model="pwdForm"
      :rules="rules"
    >
      <el-form-item
        :label="$t('system.i18nSystem.label.oldPassword')"
        prop="oldPassword"
      >
        <el-input v-model="pwdForm.oldPassword" />
      </el-form-item>
      <el-form-item
        :label="$t('system.i18nSystem.label.newPassword')"
        prop="newPassword"
      >
        <el-input v-model="pwdForm.newPassword" type="password" show-password />
      </el-form-item>
      <el-form-item
        :label="$t('system.i18nSystem.label.cfPassword')"
        prop="confirmPassword"
      >
        <el-input
          v-model="pwdForm.confirmPassword"
          type="password"
          show-password
        />
      </el-form-item>
    </el-form>
    <div class="mt-12 mb-5 flex-center">
      <el-button
        :loading="loading"
        @click="onSubmit"
        size="large"
        style="
          --el-button-hover-text-color: #ffffff;
          --el-text-color-regular: #ffffff;
          background: linear-gradient(
            90deg,
            var(--el-color-primary),
            var(--el-color-primary)
          );
        "
        class="w-300px border-none"
        >{{ $t("system.i18nSystem.opration.confirm") }}</el-button
      >
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
