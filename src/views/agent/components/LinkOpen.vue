<script setup lang="ts">
import { subordinateHttp } from "@/01-kk-system/allHttp/userHall/team";
import { useUserStore } from "@/store";
import { translateTextBy } from "@/utils/i18n";
import {
  dayjs,
  type ComponentSize,
  type FormInstance,
  type FormRules,
} from "element-plus";

defineOptions({
  name: "LinkOpen",
});

interface RuleForm {
  bonusGroupOffi: number;
  bonusGroupSelf: number;
  bonusGroupThird: number;
  loginPassword: string;
  expiryTime: string;
  remark: string;
}

const { t } = useI18n();

const userStore = useUserStore();
const openFormRef = ref<FormInstance>();

const bonusGroupOffi = computed(() => userStore.userInfo.bonusGroupOffi);
const bonusGroupSelf = computed(() => userStore.userInfo.bonusGroupSelf);
const bonusGroupThird = computed(() => userStore.userInfo.bonusGroupThird);

const shortcuts = [
  {
    text: translateTextBy('web.i18nFront.label.threeMonths'),
    value: () => {
      return dayjs().add(3, 'month').format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    text: translateTextBy('web.i18nFront.label.halfYear'),
    value: () => {
      return dayjs().add(6, 'month').format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    text: translateTextBy('web.i18nFront.label.oneYear'),
    value: () => {
      return dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss')
    },
  },
]

const openForm = ref<RuleForm>({
  bonusGroupOffi: 0,
  bonusGroupSelf: 0,
  bonusGroupThird: 0,
  loginPassword: "",
  remark: "",
  expiryTime: "",
});
const loading = ref(false);

const rules = reactive<FormRules<RuleForm>>({
  expiryTime: [
    {
      required: true,
      validator: (_: any, value: any, callback: any) => {
        if (typeof value === "undefined" || !value) {
          return callback(t("system.i18nSystem.placeholder.select"));
        }
        const diff = dayjs(value).valueOf() - dayjs(new Date()).valueOf();
        if (diff <= 3 * 24 * 3600 * 1000) {
          return callback(t("web.i18nFront.hint.expireDateEr"));
        }
        return callback();
      },
      trigger: "blur",
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
  const res = await subordinateHttp
    .createLink(openForm.value)
    .catch(() => null);
  const { code } = res || {};
  if (code === "0") {
    ElMessage.success(t("system.i18nSystem.hint.createSuccess"));
    resetForm();
  }

  loading.value = false;
}

const create = useThrottleFn(submitForm, 3000);

onBeforeMount(() => {
  openForm.value.expiryTime = dayjs().add(3, 'month').format('YYYY-MM-DD HH:mm:ss')
})
</script>

<template>
  <div class="my-4">
    <h3 class="mb-2 text-sm">{{ $t("web.i18nFront.tips.linkOpen") }}</h3>
    <p class="text-sm">1. {{ $t("web.i18nFront.tips.linkOpen1") }}</p>
    <p class="text-sm">2. {{ $t("web.i18nFront.tips.linkOpen2") }}</p>
  </div>
  <el-form :model="openForm" :rules="rules" ref="openFormRef" class="openForm">
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
          :max="bonusGroupThird"
          v-model="openForm.bonusGroupThird"
          :placeholder="$t('system.i18nSystem.placeholder.input')"
        />
        <span>{{
          $t("web.i18nFront.hint.rangeError", { max: bonusGroupThird })
        }}</span>
      </el-form-item>
      <el-form-item
        prop="expiryTime"
        :label="`${$t('web.i18nFront.label.expiryTime')}:`"
        label-width="120px"
        class="max-w-500px"
      >
        <el-date-picker
          v-model="openForm.expiryTime"
          type="date"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('web.i18nFront.hint.expireDateEr')"
        />
      </el-form-item>
      <el-form-item
        prop="remark"
        :label="`${$t('system.i18nSystem.label.remark')}:`"
        label-width="120px"
        class="max-w-500px"
      >
        <el-input
          v-model="openForm.remark"
          type="textarea"
          :rows="2"
          :placeholder="$t('system.i18nSystem.label.remark')"
        />
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
