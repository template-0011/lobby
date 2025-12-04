<script setup lang="ts">
import { userHttp } from "@/01-kk-system/allHttp/userHall/user";
import { IObject } from "@/components/CURD/types";
import { translateTextBy } from "@/utils/i18n";
import { FormInstance, FormRules } from "element-plus";

defineOptions({
  name: "IpListModal",
});

const modalVisible = defineModel({ required: true, default: false });

const { t } = useI18n();
const list = ref<IObject[]>([])
const loading = ref(false)

async function fetchData() {
  loading.value = true
  const res = await userHttp.ipList({ limit: 10 })
  const { data } = res ?? {}
  list.value = data ?? []
  loading.value = false
}

watch(() => modalVisible.value, () => {
  if (modalVisible.value && list.value?.length <= 0) {
    fetchData();
  }
})

const handleCloseModal = () => {
  modalVisible.value = false;
};
</script>

<template>
  <el-dialog
    v-model="modalVisible"
    :align-center="true"
    :append-to-body="true"
    :title="$t('web.i18nFront.label.ipList')"
    width="540px"
    style="padding-right: 0"
    @close="handleCloseModal"
  >
    <el-table
      :data="list"
      v-loading="loading"
      style="width: 100%; margin-bottom: 10px"
      size="small"
      highlight-current-row
    >
      <el-table-column type="index" width="50" />
      <el-table-column
        prop="lastLoginIP"
        align="center"
        :label="$t('web.i18nFront.label.ipList')"
      ></el-table-column>
      <el-table-column
        prop="lastLoginDate"
        align="center"
        :label="$t('system.i18nSystem.label.lastLoginDate')"
      ></el-table-column>
    </el-table>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
