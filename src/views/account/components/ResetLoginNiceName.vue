<script setup lang="ts">
import { userHttp } from "@/01-kk-system/allHttp/userHall/user";
import { IObject } from "@/components/CURD/types";
import { useUserStore } from "@/store";
import { translateTextBy } from "@/utils/i18n";
import { FormInstance, FormRules } from "element-plus";

defineOptions({
  name: "ResetLoginNicenameModal",
});
const modalVisible = defineModel({ required: true, default: false });

const emit = defineEmits<{
  onUpdateClick: [editData: IObject];
}>();

const userStore = useUserStore();
const { t } = useI18n();

const handleCloseModal = () => {
  nameFormRef?.value?.resetFields();
  modalVisible.value = false;
};

// 修改用户信息
interface NameForm {
  nickName: string;
}
const nameFormRef = ref<FormInstance>(); // 表单ref
const nameForm = reactive<NameForm>({
  nickName: "",
});
const loading = ref(false);

const rules = reactive<FormRules<NameForm>>({
  nickName: [
    {
      required: true,
      message: translateTextBy("system.i18nSystem.hint.rightName"),
      trigger: "blur",
    },
  ],
});

const onSubmit = async () => {
  const validate = await nameFormRef?.value?.validate().catch(() => null);
  console.log(validate);
  if (!validate) {
    return;
  }
  loading.value = true;
  const { nickName } = nameForm;
  const res = await userHttp.updateAccount({ nickName }).catch(() => null);
  const { code } = res || {};
  if (code === "0") {
    handleCloseModal();
    ElMessage.success(t("system.i18nSystem.hint.editSuccess"));
    userStore.getUserInfo();
  }
  loading.value = false;
};
</script>

<template>
  <el-dialog
    v-model="modalVisible"
    :align-center="true"
    :append-to-body="true"
    :title="$t('system.i18nSystem.label.nickName')"
    width="300px"
    style="padding-right: 0"
    @close="handleCloseModal"
  >
    <el-form
      ref="nameFormRef"
      label-width="auto"
      :model="nameForm"
      :rules="rules"
    >
      <el-form-item prop="nickName">
        <el-input
          v-model="nameForm.nickName"
          :placeholder="$t('system.i18nSystem.hint.rightName')"
          :maxlength="50"
          :minlength="3"
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
