<script setup lang="ts">
import { IObject } from "@/components/CURD/types";
import { adminAccountStatus } from "@/01-kk-system/allDefine/enum/admin/account";

defineOptions({
  name: "OperationDeatilModal",
});
const modalVisible = defineModel<boolean>({ required: true });

const props = defineProps<{ editData: IObject }>();

const emit = defineEmits<{
  onUpdateClick: [editData: IObject];
}>();

const handleCloseModal = () => {
  modalVisible.value = false;
};
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
          editData.opsName
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.opsID')">{{
          editData.opsID
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.createBy')">{{
          editData.createBy
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.createTime')"
          >{{ editData.createTime }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('system.i18nSystem.label.lastModifyBy')"
          >{{ editData.lastModifyBy }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('system.i18nSystem.label.lastModifyTime')"
          >{{ editData.lastModifyTime }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('system.i18nSystem.label.lastLoginIP')"
        >
          {{ editData.lastLoginIP }}
        </el-descriptions-item>
      </el-descriptions>
      <h2 class="text-base text-black">
        {{ $t("admin.i18nManage.dealer.otherInfo") }}
      </h2>
      <el-descriptions border :column="2">
        <el-descriptions-item :label="$t('system.i18nSystem.label.nickName')">{{
          editData.nickName ?? "--"
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.state')">{{
          editData.status
            ? $t(adminAccountStatus.getDes(editData.status))
            : "--"
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.phone')">{{
          editData.phoneNumber ?? "--"
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('system.i18nSystem.label.email')"
          >{{ editData.email ?? "--" }}
        </el-descriptions-item>
      </el-descriptions>
      <h2 class="text-base text-black">
        {{ $t("admin.i18nManage.dealer.remark") }}
      </h2>
      <el-descriptions border :column="2">
        <el-descriptions-item
          :label="$t('system.i18nSystem.label.remarkInfo')"
          >{{ editData.remark ?? "--" }}</el-descriptions-item
        >
      </el-descriptions>
    </div>
    <!-- 弹窗底部操作按钮 -->
    <template #footer>
      <div style="padding-right: var(--el-dialog-padding-primary)">
        <el-button @click="handleCloseModal">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
