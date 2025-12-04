<script setup lang="ts">
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { subordinateHttp } from "@/01-kk-system/allHttp/userHall/team";
import { useQRCode } from '@vueuse/integrations/useQRCode'

defineOptions({
  name: "LinkManage",
});

const { t } = useI18n();

const loading = ref(false);
const listData = ref<IObject[]>([]);

async function getLinksList() {
  loading.value = true;
  const res = await subordinateHttp.getLinks().catch(() => null);
  const { data, code } = res || {};
  if (code === "0") {
    listData.value = data || [];
  }
  loading.value = false;
}

async function onDelete(row: IObject) {
  const confirm = await ElMessageBox.confirm(
    t("system.i18nSystem.hint.confirmDele"),
    t("system.i18nSystem.hint.warning")
  ).catch(() => null);
  if (!confirm) {
    return;
  }
  loading.value = true;
  const res = await subordinateHttp.deleteLinks(row.recordID).catch(() => null);
  const { code } = res || {};
  if (code === "0") {
    ElMessage.success(t("system.i18nSystem.hint.deleteSuccess"));
    getLinksList();
  } else {
    loading.value = false;
  }
}

function onCopy(row: IObject) {
  let oInput = document.createElement("input");
  oInput.value = row.invitationURL;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  ElMessage.success(t("web.i18nFront.hint.copyOk"));
  oInput.remove();
}

const refresh = useThrottleFn(getLinksList, 3000);

// 二维码
const qrcodeTxt = shallowRef('')
// @ts-ignore
const qrcode = useQRCode(qrcodeTxt)
const showQR = ref(false)

const showQrCode = (row: IObject)  => {
  qrcodeTxt.value = row.invitationURL
  showQR.value = true
}

onBeforeMount(() => {
  getLinksList();
});
</script>

<template>
  <div class="my-4 flex justify-end">
    <el-button type="primary" round size="small" @click="refresh">
      {{ $t("system.i18nSystem.opration.refresh") }}
    </el-button>
  </div>
  <el-table :data="listData" border style="width: 100%" v-loading="loading">
    <el-table-column
      prop="invitationURL"
      :label="$t('web.i18nFront.label.registLink')"
      align="center"
    />
    <el-table-column
      prop="bonusGroupOffi"
      align="center"
      :label="$t('web.i18nFront.label.classicLott')"
    />
    <el-table-column
      prop="bonusGroupSelf"
      align="center"
      :label="$t('web.i18nFront.label.hotLott')"
    />
    <el-table-column
      prop="bonusGroupThird"
      align="center"
      :label="$t('web.i18nFront.label.aboradLott')"
    />
    <el-table-column
      prop="createTime"
      align="center"
      :label="$t('system.i18nSystem.label.createTime')"
    >
    </el-table-column>
    <el-table-column
      prop="expiryTime"
      align="center"
      :label="$t('web.i18nFront.label.expiryTime')"
    />
    <el-table-column
      prop="remark"
      align="center"
      :label="$t('system.i18nSystem.label.remark')"
    />
    <el-table-column
      align="center"
      prop="theoryBuyMoney"
      :label="$t('system.i18nSystem.opration.operation')"
      width="180"
    >
      <template #default="{ row }">
        <div class="flex flex-col items-center gap-2">
          <el-button class="ml-3" type="info" round size="small" @click="onDelete(row)">
            {{ $t("system.i18nSystem.label.delete") }}
          </el-button>
          <el-button type="primary" round size="small" @click="onCopy(row)">
            {{ $t("system.i18nSystem.opration.copy") }}
          </el-button>
          <el-button type="success" round size="small" @click="showQrCode(row)">
            {{ $t("system.i18nSystem.opration.qrcode") }}
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="showQR" width="300px">
    <div class="w-200px h-200px mx-auto p-4 bg-[#eef2fe] rounded-2 border-1 border-white flex-center">
      <img class="w-160px h-160px" :src="qrcode" alt="APP QR Code" />
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
