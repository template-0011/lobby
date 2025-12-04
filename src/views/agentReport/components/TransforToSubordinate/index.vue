<script setup lang="ts">
import { subordinateHttp } from "@/01-kk-system/allHttp/userHall/team";
import { transformBy } from "@/01-kk-system/allUtils/utils";
import { useUserStore } from "@/store";
import type { FormInstance, FormRules } from "element-plus";

defineOptions({
  name: "TransforToSubordinate",
});

const props = defineProps({
  subInfo: {
    type: Object,
    default: () => ({}),
  },
});

type TForm = {
  money: number;
  password: string;
  remark: string;
};

const emit = defineEmits<{
  onRefresh: [void];
}>();

const modalVisible = defineModel({ required: true, default: false });

const { t } = useI18n();
const userStore = useUserStore();
const transforFormRef = ref<FormInstance>();
const transforForm = ref<TForm>({
  money: 0,
  password: "",
  remark: "",
});
const loading = ref(false);

const balance = computed(() => userStore.balanceInfo.balance);

watch(() => modalVisible.value, () =>{
  if(modalVisible.value){
    transforForm.value = {
      money: 0,
      password: "",
      remark: "",
    }
  }
})

const rules = reactive<FormRules<TForm>>({
  password: [
    {
      required: true,
      message: t("system.i18nSystem.placeholder.input"),
      trigger: "blur",
    },
  ],
  money: [
    {
      type: "number",
      required: true,
      min: 0,
      validator: (_: any, value: any, callback: any) => {
        if (!value) {
          return callback(new Error(t("system.i18nSystem.placeholder.input")));
        }
        const num = Number(value);
        if (num <= 0) {
          return callback(new Error(t("web.i18nFront.hint.inputNum")));
        } else {
          if (value > Number(balance.value)) {
            return callback(new Error(t("web.i18nFront.hint.moreThBalance")));
          }
        }
        return callback();
      },
      trigger: ["blur", "change"],
    },
  ],
});
async function onSubmit() {
  const validate = await transforFormRef.value?.validate().catch(() => null);
  if (!validate) {
    return;
  }
  const confirm = await ElMessageBox.confirm(
    `${t("web.i18nFront.hint.confirmTransInfo", { name: props.subInfo.userName, money: transforForm.value.money })}`,
    `${t("web.i18nFront.hint.confirmTrans")}`,
    { type: "warning", dangerouslyUseHTMLString: true }
  ).catch(() => null);

  if (!confirm) {
    return;
  }
  const { walletType, currencyCode } = userStore.currentWalletInfo;
  const params = {
    currencyCode,
    walletType,
    money: transforForm.value.money,
    subUserId: props.subInfo.userID,
  };
  loading.value = true;
  const res = await subordinateHttp.transfor2Sub(params).catch(() => null);
  if (res?.code === "0") {
    ElMessage.success(t("web.i18nFront.hint.transOk"));
    modalVisible.value = false;
    userStore.getUserBanlance();
    emit("onRefresh");
  }
  loading.value = false;
}

function handleClose(done: () => void) {
  if (transforFormRef.value) {
    transforFormRef.value.resetFields();
  }
  done();
}

function onInput(value: string) {
  transforForm.value.money = Number(transformBy(value));
}
</script>

<template>
  <el-dialog
    :title="$t('web.i18nFront.title.transforSub')"
    v-model="modalVisible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      :model="transforForm"
      :rules="rules"
      ref="transforFormRef"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item :label="$t('web.i18nFront.label.subAccount')">
        <span class="color-[var(--kk-form-text-color)]">{{ subInfo.userName }}</span>
      </el-form-item>
      <el-form-item :label="$t('web.i18nFront.label.yourBalance')">
        <span class="color-[var(--kk-form-text-color)]">{{ balance }}</span>
      </el-form-item>
      <el-form-item prop="money" :label="$t('web.i18nFront.label.rechargeM')">
        <el-input type="number" v-model="transforForm.money" @input="onInput" />
      </el-form-item>
      <el-form-item prop="password" :label="$t('web.i18nFront.label.mpwd')">
        <el-input
          type="password"
          v-model="transforForm.password"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('system.i18nSystem.label.remark')" prop="remark">
        <el-input type="textarea" :rows="2" v-model="transforForm.remark" />
      </el-form-item>
      <el-form-item>
        <div class="flex-center w-full">
          <el-button @click="modalVisible = false">
            {{ $t("system.i18nSystem.opration.cancel") }}
          </el-button>
          <el-button type="primary" :loading="loading" @click="onSubmit">
            {{ $t("system.i18nSystem.opration.submit") }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
