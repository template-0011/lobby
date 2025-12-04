<script setup lang="ts">
import { userHttp } from "@/01-kk-system/allHttp/userHall/user";
import { IObject } from "@/components/CURD/types";
import { translateTextBy } from "@/utils/i18n";
import { FormInstance, FormRules } from "element-plus";

defineOptions({
  name: "ResetLoginPwdModal",
});
defineProps({
  title: String,
  text: String,
});
const modalVisible = defineModel({ required: true, default: false });

const emit = defineEmits<{
  onConfirm: [void];
  onClose: [void];
}>();

function handleCloseModal() {
  modalVisible.value = false;
  emit("onClose");
}
function onSubmit() {
  emit("onClose");
}
</script>

<template>
  <el-dialog
    v-model="modalVisible"
    :align-center="true"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="true"
    :title="title || $t('system.i18nSystem.label.tipTitle')"
    width="540px"
    style="padding-right: 0"
    @close="handleCloseModal"
  >
    <slot>
      <h2 class="py-5 text-center color-[var(--kk-modal-title)] text-14px">
        {{ text }}
      </h2>
    </slot>
    <div class="mt-12 mb-5 flex-center">
      <el-button
        @click="onSubmit"
        size="large"
        style="
          --el-button-hover-text-color: #ffffff;
          color: var(--kk-modal-button-title-color);
        "
        class="w-300px border-none linear-bg "
        >{{ $t("system.i18nSystem.opration.confirm") }}</el-button
      >
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
