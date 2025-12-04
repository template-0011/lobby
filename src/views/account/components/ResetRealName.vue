<script setup lang="ts">
import { userHttp } from "@/01-kk-system/allHttp/userHall/user";
import { IObject } from "@/components/CURD/types";
import { translateTextBy } from "@/utils/i18n";
import { FormInstance, FormRules } from "element-plus";

defineOptions({
  name: "ResetRealName",
});
const props = defineProps({
  realName: {
    type: String,
    required: true,
  }
})
const modalVisible = defineModel({ required: true, default: false });

const emit = defineEmits<{
  refresh: [void];
}>();

const { t } = useI18n();

const handleCloseModal = () => {
  realNameFormRef?.value?.resetFields();
  modalVisible.value = false;
};

// 忘记密码
interface PwdForm {
  realName: string;
  fundPwd: string;
}
const realNameFormRef = ref<FormInstance>(); // 登录表单ref
const realNameForm = reactive<PwdForm>({ realName: "", fundPwd: "" });
const loading = ref(false);

watch(() => modalVisible.value, () => {
  if (modalVisible.value) {
    realNameForm.realName = props.realName ? props.realName?.replace(/^(.).*/, '$1**') : ''
  }
})

let validateCN = (rule: any, value: any, callback: any) => {
      const reg = /^[\u4e00-\u9fa5]+$/;
      if (value === '') {
        callback(new Error(translateTextBy("system.i18nSystem.placeholder.input")))
      } else {
        if (!reg.test(value)) {
          callback(new Error(translateTextBy("web.i18nFront.tips.needRealName")))
        }
        callback()
      }
    }

const rules = reactive<FormRules<PwdForm>>({
  realName: [
    {
      required: true,
      message: translateTextBy("system.i18nSystem.placeholder.input"),
      trigger: "blur",
    },
    {
      validator: validateCN,
      trigger: "blur",
      required: true,
    },
  ],
  fundPwd: [
    {
      required: true,
      message: translateTextBy("web.i18nFront.hint.confirmFundPwd2"),
      trigger: ["blur", "change"],
    },
  ],
});

const onSubmit = async () => {
  try {
    const validate = await realNameFormRef?.value?.validate().catch(() => null);
    if (!validate) {
      return;
    }
    loading.value = true;
    const pwdRes = await userHttp.validateFundpassword(realNameForm.fundPwd).catch(() => null);
    const { code: pwdCode, data: pwdData } = pwdRes || {};
    if (pwdCode !== "0" || !pwdData) {
      realNameForm.fundPwd = "";
      realNameFormRef.value?.validateField("fundPwd");
      return;
    }
    const { realName } = realNameForm;
    const res = await userHttp
      .updateRealfo({ realName })
      .catch(() => null);
    const { code } = res || {};
    if (code === "0") {
      handleCloseModal();
      emit('refresh')
      ElMessage.success(props.realName ? t("system.i18nSystem.hint.editSuccess") : t("system.i18nSystem.hint.createSuccess"));
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const title = computed(() => {
  return props.realName ? `${t('system.i18nSystem.label.edit')}${t('web.i18nFront.label.realname')}` : `${t('web.i18nFront.label.setting')}${t('web.i18nFront.label.realname')}`;
})
</script>

<template>
  <el-dialog
    v-model="modalVisible"
    :align-center="true"
    :append-to-body="true"
    :title="title"
    width="540px"
    style="padding-right: 0"
    @close="handleCloseModal"
  >
    <el-form
      ref="realNameFormRef"
      label-width="auto"
      :model="realNameForm"
      :rules="rules"
    >
      <el-form-item
        :label="$t('web.i18nFront.label.realname')"
        prop="realName"
      >
        <el-input v-model="realNameForm.realName" />
      </el-form-item>
      <el-form-item
        :label="$t('web.i18nFront.label.mpwd')"
        prop="fundPwd"
      >
        <el-input v-model="realNameForm.fundPwd" type="password" show-password />
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
