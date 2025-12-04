<script setup lang="ts">
import { IObject } from "@/components/CURD/types";
import { translateTextBy } from "@/utils/i18n";
import type { FormRules, FormInstance } from "element-plus";

defineOptions({
  name: "OperationEditModal",
});
const modalVisible = defineModel({ required: true });

const props = defineProps<{ editData: IObject }>();

const emit = defineEmits<{
  onUpdateClick: [formData: IObject];
}>();

const formData = ref(props.editData || {});

const editFormRef = ref<FormInstance>();
const rules = reactive<FormRules<IObject>>({
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: translateTextBy("system.i18nSystem.hint.emailWarm"),
      trigger: "blur",
    },
  ],
  phoneNumber: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: translateTextBy("system.i18nSystem.hint.needPhone"),
      trigger: "blur",
    },
  ],
});

watch(
  () => props.editData,
  (newValue) => {
    newValue && (formData.value = newValue);
  }
);

const handleCloseModal = () => {
  modalVisible.value = false;
};

const handleSubmit = useThrottleFn(() => {
  if (!editFormRef.value) {
    return;
  }
  editFormRef.value.validate((valid: boolean) => {
    if (valid) {
      emit("onUpdateClick", formData.value);
    }
  });
}, 3000);
</script>

<template>
  <el-dialog
    v-model="modalVisible"
    :align-center="true"
    :append-to-body="true"
    width="800px"
    style="padding-right: 0"
    @close="handleCloseModal"
  >
    <!-- 滚动 -->
    <div max-height="60vh" class="px-5">
      <h2 class="text-base text-black">
        {{ $t("admin.i18nManage.dealer.basicsInfo") }}
      </h2>
      <el-descriptions border :column="2">
        <el-descriptions-item :label="$t('system.i18nSystem.label.opsName')">{{
          formData.opsName
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.opsID')">{{
          formData.opsID
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.createBy')">{{
          formData.createBy
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.createTime')"
          >{{ formData.createTime }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('system.i18nSystem.label.lastModifyBy')"
          >{{ formData.lastModifyBy }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('system.i18nSystem.label.lastModifyTime')"
          >{{ formData.lastModifyTime }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('system.i18nSystem.label.lastLoginIP')"
        >
          {{ formData.lastLoginIP }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- 表单 -->
      <el-form
        :inline="true"
        :rules="rules"
        :model="formData"
        ref="editFormRef"
      >
        <h2 class="text-base text-black">
          {{ $t("admin.i18nManage.dealer.otherInfo") }}
        </h2>
        <el-form-item :label="$t('system.i18nSystem.label.nickName')">
          <el-input
            v-model="formData.nickName"
            :placeholder="$t('system.i18nSystem.label.nickName')"
          />
        </el-form-item>
        <el-form-item
          prop="phoneNumber"
          :label="$t('system.i18nSystem.label.phone')"
        >
          <el-input
            v-model="formData.phoneNumber"
            :placeholder="$t('system.i18nSystem.label.phone')"
          />
        </el-form-item>
        <el-form-item prop="email" :label="$t('system.i18nSystem.label.email')">
          <el-input
            v-model="formData.email"
            :placeholder="$t('system.i18nSystem.label.email')"
          />
        </el-form-item>
        <h2 class="text-base text-black">
          {{ $t("admin.i18nManage.dealer.remark") }}
        </h2>
        <el-form-item
          :label="$t('system.i18nSystem.label.remarkInfo')"
          inline
          class="w-[400px]"
        >
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            :placeholder="$t('system.i18nSystem.label.remarkInfo')"
          />
        </el-form-item>
      </el-form>
    </div>
    <!-- 弹窗底部操作按钮 -->
    <template #footer>
      <div style="padding-right: var(--el-dialog-padding-primary)">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleCloseModal">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
