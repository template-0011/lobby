<script setup lang="ts">
defineOptions({
  name: "CustomBreadcrumb",
});

const breadcrumbUsers = defineModel<BreadcrumbUser[]>({
  required: true,
  default: [],
});

const emit = defineEmits<{
  onClick: [current: BreadcrumbUser];
}>();

function onClickCrumb(index: number) {
  if (index + 1 === breadcrumbUsers.value.length) {
    return;
  }
  const item = breadcrumbUsers.value[index];
  breadcrumbUsers.value = breadcrumbUsers.value.slice(0, index + 1);
  emit("onClick", item);
}
</script>

<template>
  <span>{{ $t("web.i18nFront.label.currentPlace") }}:</span>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      class="cursor-pointer"
      v-for="(item, i) in breadcrumbUsers"
      :key="i"
      @click="onClickCrumb(i)"
    >
      {{ item.userName }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped></style>
