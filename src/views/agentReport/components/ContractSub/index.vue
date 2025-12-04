<script setup lang="ts">
import { contractCircle } from "@/01-kk-system/allDefine/enum/frontend/contract";
import { IObject } from "@/01-kk-system/allHttp/types/common";
import { contractHttp } from "@/01-kk-system/allHttp/userHall/user";
import { useUserStore } from "@/store";
import { translateTextBy } from "@/utils/i18n";
import cloneDeep from "lodash-es/cloneDeep";

defineOptions({
  name: "ContractSub",
});

const props = defineProps({
  subInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  onRefresh: [void];
}>();

const modalVisible = defineModel({ required: true, default: false });

watch(
  () => modalVisible.value,
  () => {
    if (modalVisible.value) {
      getMyContract();
    }
  }
);

const { t } = useI18n();
const userStore = useUserStore();
const activeNames = ref("");
const subordinateContract = ref<IObject>({}); // 我的下级契约二级数据
const subordinateContractAll = ref<IObject[]>([]); // 我的下级契约
const subordinateContractInfo = ref<IObject[]>([]); // 修改契约选中下级数据
const myContract = ref<IObject[]>([]); // 我的契约数据
const amendContractShow = ref(false); // 修改下级契约数据
const loading = ref(false);
const subLoding = ref(false);

const balance = computed(() => userStore.balanceInfo.balance);
const unit = computed(() => userStore.currentWalletInfo.abbreviation);
// 【向下签约】（0不可以 1可以）
const canSubSign = computed(
  () => Number(userStore.myContractSalary[0] || 0) === 1
);

function handleClose(done: () => void) {
  done();
}

//契约金额模式判断（1百分比 2固定金额）
function moneyChange(value: number, model: number) {
  if (model * 1 == 1) {
    return (value * 100).toFixed(2);
  } else if (model * 1 == 2) {
    return value;
  }
}

// 获取我的契约
async function getMyContract() {
  myContract.value = [];
  loading.value = true;
  const res = await contractHttp.getMyContractList().catch(() => null);
  if (res?.code === "0") {
    res.data.forEach((item, i) => {
      res.data[i].jsonConf = JSON.parse(item.jsonConf);
    });
    myContract.value = res?.data || [];
  }
  loading.value = false;
}
// 获取我的下级契约
async function getSubordinateContract() {
  subordinateContract.value = {};
  subordinateContractAll.value = [];
  const params = {
    partyBUserID: props.subInfo.userID,
  };
  subLoding.value = true;
  const res = await contractHttp.getSubContractList(params);
  const { code, data } = res || {};
  if (code === "0") {
    let list = data || [];
    list.forEach((item, i) => {
      list[i].jsonConf = JSON.parse(item.jsonConf);
    });
    subordinateContractAll.value = list.filter((val) => {
      return Number(val.contractType) == Number(activeNames.value);
    });
  }
  //如果 subordinateContractAll 没有数据就跳出
  if (!subordinateContractAll.value.length) return;
  //把数据和里面的jsonConf 分开，先暂存temp里面
  let temp: {
    jsonConf: IObject[];
    contractCalcMod: number;
    contractID: string
  } = {
    jsonConf: [],
    contractCalcMod: -1,
    contractID: ''
  };
  for (let i = 0; i < subordinateContractAll.value.length; i++) {
    const target = subordinateContractAll.value;
    temp.jsonConf.push(target[i].jsonConf);
    temp.contractCalcMod = target[i].contractCalcMod;
    temp.contractID = target[i].contractID;
  }
  //jsonConf 里面加入type判断contractCalcMod，
  for (let i = 0; i < temp.jsonConf[0].length; i++) {
    const formatV = moneyChange(
      temp.jsonConf[0][i].value,
      temp.contractCalcMod
    );
    temp.jsonConf[0][i].value = formatV
    temp.jsonConf[0][i].originValue = formatV
  }
  subordinateContract.value = temp;
  subLoding.value = false;
}
//切换契约
function handleChange() {
  if (activeNames.value) {
    subordinateContractInfo.value = [];
    getSubordinateContract();
  }
}
//删除契约
async function deleteContractShow(contractID: string, item: IObject) {
  const confirm = await ElMessageBox.confirm(h("div", [
      h("p", null, `${t('web.i18nFront.hint.subName')}: ${props.subInfo?.userName}`),
      h("p", null, `${t('web.i18nFront.label.contracttp')}: ${contractName(item.contractType)}`),
      h("p", null, `${t('web.i18nFront.label.contractcr')}: ${contractName(item.contractCircle)}`),
      h("p", null, `${t('web.i18nFront.label.createCtTime')}: ${item.createTime}`),
    ]), t('system.i18nSystem.hint.warning'), {
    type: "warning",
  }).catch(() => null)
  if (!confirm) {
    return
  }
  loading.value = true
  const res = await contractHttp.delSubContract(contractID).catch(() => null)
  if (res?.code === '0') {
    getSubordinateContract()
    ElMessage({
      type: 'success',
      message: t('system.i18nSystem.hint.deleteSuccess'),
    })
  }
  loading.value = false
}
//我的契约名字
function contractName(val: string) {
  //（1投注工资 2中单工资 3挂单工资 4中奖返水 5团队分红）
  switch (val) {
    case "1":
      return t("web.i18nFront.enum.betContract");
    case "2":
      return t("web.i18nFront.enum.winContract");
    case "3":
      return t("web.i18nFront.enum.chaseContract");
    case "4":
      return t("web.i18nFront.enum.rebateContract");
    case "5":
      return t("web.i18nFront.enum.teamRdContract");
    case "6":
      return t("web.i18nFront.enum.rAndWContract");
    default:
      return t("web.i18nFront.enum.noContract");
  }
}
function minMax(min: number, max: number) {
  if (max - min > 0) {
    return min + "-" + max;
  } else if ((min && !max) || min >= 0) {
    return "≥" + min;
  } else if ((!min || min == 0) && max) {
    return "≤" + max;
  } else {
    return "";
  }
}
function formatter(cellValue: number) {
  return cellValue * 1 == 0
    ? t("web.i18nFront.title.cannot")
    : t("web.i18nFront.title.can");
}
//修改契约金额
function changesubordinateValue(value: number, scope: IObject) {
  subordinateContract.value.jsonConf[0][scope.$index].value = value;
}
// create contract
async function creatContractSubmit(item: IObject) {
    const params = {
    parentContractID: item.contractID,
    partyBUserID: props.subInfo.userID,
  }
  loading.value = true
  const res = await contractHttp.createSubContract(params).catch(() => null)
  if (res?.code === '0') {
    ElMessage.success(t('web.i18nFront.hint.signOk'))
    getSubordinateContract()
  }
  loading.value = false
}
// confirm edit subcontract
async function amendContract() {
  const list = subordinateContract.value.jsonConf[0] || []
  const configList = cloneDeep(list)
  // validate number and convert percent to value number
  const parentContract = myContract.value.find(item => item.contractType+'' === activeNames.value+'')
  const parentConfig = parentContract?.jsonConf || []
  for (let i = 0; i < configList.length; i++) {
    const config = configList[i]
    const pConfig = parentConfig[i]
    // if the value is percent type need to change origin value
    let maxValue = pConfig.value
    if (subordinateContract.value.contractCalcMod * 1 === 1) {
      maxValue = Number(pConfig.value) * 100
    }
    if (config.value > maxValue || config.value < 0) {
      const msg = t('web.i18nFront.hint.contractEditTip', { min: 0, max: maxValue })
      ElMessage.warning(msg)
      return
    }
    if (subordinateContract.value.contractCalcMod * 1 === 1) {
      config.value = Number(config.value) / 100
    }
  }
  loading.value = true
  const res = await contractHttp.editSubContract(subordinateContract.value.contractID, { jsonConf: JSON.stringify(configList || '') }).catch(() => null)
  if (res?.code === '0') {
    ElMessage.success(t('system.i18nSystem.hint.editSuccess'))
    getSubordinateContract()
    amendContractShow.value = false
  }
  loading.value = false
}
//
function cancelAmendContract() {
  amendContractShow.value = false
  const list = subordinateContract.value.jsonConf[0] || []
  list.forEach((item: { value: any; originValue: any; }) => {
    item.value = item.originValue
  })
}
</script>

<template>
  <el-dialog
    :title="$t('web.i18nFront.label.sign')"
    v-model="modalVisible"
    width="980px"
    :before-close="handleClose"
  >
    <p class="text-sm color-#fff mb-4">
      {{ $t("web.i18nFront.label.subAccount") }}：{{ subInfo.userName }}
    </p>
    <el-empty
      v-if="myContract.length <= 0"
      :description="$t('web.i18nFront.hint.noContract')"
    />
    <el-collapse v-loading="loading" v-else v-model="activeNames" @change="handleChange" accordion>
      <el-collapse-item
        v-for="(item, key) in myContract"
        :key="key"
        :title="$t('web.i18nFront.hint.mine') + contractName(item.contractType)"
        :name="item.contractType"
        class="collapseTitle"
      >
        <div class="tables">
          <div class="table-card">
            <el-table
              :data="[item]"
              border
              style="width: 100%"
              size="small"
              class="cus-table"
            >
              <el-table-column
                prop="contractCircle"
                align="center"
                :label="$t('web.i18nFront.label.contractcr')"
              >
                <template #default="scope">
                  {{
                    translateTextBy(
                      contractCircle.getDes(scope.row.contractCircle || "")
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="canSubSign"
                align="center"
                :label="$t('web.i18nFront.label.downSign')"
                :formatter="formatter"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('web.i18nFront.label.supportGm')"
              >
                <template #default="scope">
                  {{
                    scope.row.acceptBetInner === "1" &&
                    scope.row.acceptBetOuter === "1"
                      ? $t("web.i18nFront.label.all")
                      : scope.row.acceptBetInner === "1"
                        ? $t("web.i18nFront.label.lottGm")
                        : scope.row.acceptBetOuter === "1"
                          ? $t("web.i18nFront.label.otherGm")
                          : "--"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                align="center"
                :label="$t('system.i18nSystem.label.createTime')"
              >
              </el-table-column>
            </el-table>
            <el-table
              :data="item.jsonConf"
              border
              style="width: 100%"
              size="small"
              class="cus-table"
            >
              <el-table-column
                type="index"
                align="center"
                :label="$t('web.i18nFront.label.stepStg')"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="max"
                :label="$t('web.i18nFront.label.mainCd')"
              >
                <el-table-column
                  prop="max"
                  align="center"
                  :label="$t('web.i18nFront.label.allProfitRange')"
                >
                  <template #default="scope"
                    >{{
                      minMax(scope.row.min, scope.row.max) + "&nbsp;" + unit
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                align="center"
                prop="conditionActiveUser"
                :label="$t('web.i18nFront.label.otherCd1')"
              >
                <el-table-column
                  prop="conditionActiveUser"
                  align="center"
                  :label="$t('web.i18nFront.label.activeCount')"
                >
                </el-table-column>
              </el-table-column>
              <el-table-column
                align="center"
                prop="conditioTotalSell"
                :label="$t('web.i18nFront.label.otherCd2')"
              >
                <el-table-column
                  prop="conditioTotalSell"
                  align="center"
                  :label="$t('web.i18nFront.label.allAmount')"
                >
                  <template #default="{ row }"
                    >{{ row.conditioTotalSell + "&nbsp;" + unit }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('web.i18nFront.label.otherCd3')"
              >
                <el-table-column
                  prop="conditionTotalDeposit"
                  align="center"
                  :label="$t('web.i18nFront.label.allRechage')"
                >
                  <template #default="scope"
                    >{{ scope.row.conditionTotalDeposit + "&nbsp;" + unit }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="conditionTotalProfit"
                align="center"
                :label="$t('web.i18nFront.label.otherCd4')"
              >
                <el-table-column
                  prop="conditionTotalProfit"
                  align="center"
                  :label="$t('web.i18nFront.label.allProfit')"
                >
                  <template #default="scope"
                    >{{ scope.row.conditionTotalProfit + "&nbsp;" + unit }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="value"
                align="center"
                :label="
                  item.contractCalcMod === '1'
                    ? $t('web.i18nFront.label.contractRate')
                    : $t('web.i18nFront.label.contractAmount')
                "
              >
                <template #default="scope">
                  {{ moneyChange(scope.row.value, item.contractCalcMod) }}
                  {{
                    subordinateContractAll[0]?.contractCalcMod * 1 == 2
                      ? unit
                      : "%"
                  }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="subordinate">
          <div class="title flex items-center justify-end my-4 gap-4">
            <span class="font-600">
              {{ $t("web.i18nFront.hint.sub")
              }}{{ contractName(item.contractType) }}
            </span>
            <el-button
              type="danger"
              @click="creatContractSubmit(item)"
              size="small"
              v-if="!subordinateContractAll?.length && item.cellValue * 1 != 0"
            >
              {{ $t("web.i18nFront.label.sign") }}
            </el-button>

            <template v-if="subordinateContractAll?.length">
              <el-button
                type="primary"
                size="small"
                @click="amendContractShow = true"
                >{{ $t('system.i18nSystem.opration.edit') }}</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="
                  deleteContractShow(
                    subordinateContractAll[0].contractID,
                    subordinateContractAll[0]
                  )
                "
                >{{ $t('system.i18nSystem.opration.delete') }}</el-button
              >
            </template>
          </div>

          <div class="tables" v-if="subordinateContractAll.length">
            <div class="table-card">
              <el-table
                :data="[subordinateContractAll[0]]"
                border
                style="width: 100%"
                size="small"
                class="cus-table"
              >
                <el-table-column
                  prop="contractCircle"
                  align="center"
                  :label="$t('web.i18nFront.label.contractcr')"
                >
                  <template #default="scope">
                    {{
                      translateTextBy(
                        contractCircle.getDes(scope.row.contractCircle || "")
                      )
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="canSubSign"
                  align="center"
                  :label="$t('web.i18nFront.label.downSign')"
                  :formatter="formatter"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$t('web.i18nFront.label.supportGm')"
                >
                  <template #default="scope">
                    {{
                      scope.row.acceptBetInner === "1" &&
                      scope.row.acceptBetOuter === "1"
                        ? $t("web.i18nFront.label.all")
                        : scope.row.acceptBetInner === "1"
                          ? $t("web.i18nFront.label.lottGm")
                          : scope.row.acceptBetOuter === "1"
                            ? $t("web.i18nFront.label.otherGm")
                            : "--"
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  align="center"
                  :label="$t('system.i18nSystem.label.createTime')"
                >
                </el-table-column>
              </el-table>
              <el-table
                :data="subordinateContract.jsonConf[0]"
                border
                style="width: 100%"
                size="small"
                class="cus-table"
              >
                <el-table-column
                  type="index"
                  align="center"
                  :label="$t('web.i18nFront.label.stepStg')"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="max"
                  :label="$t('web.i18nFront.label.mainCd')"
                >
                  <el-table-column
                    prop="max"
                    align="center"
                    :label="$t('web.i18nFront.label.allProfitRange')"
                  >
                    <template #default="scope">
                      {{
                        minMax(scope.row.min, scope.row.max) + "&nbsp;" + unit
                      }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="conditionActiveUser"
                  :label="$t('web.i18nFront.label.otherCd1')"
                >
                  <el-table-column
                    prop="conditionActiveUser"
                    align="center"
                    :label="$t('web.i18nFront.label.activeCount')"
                  >
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="conditioTotalSell"
                  :label="$t('web.i18nFront.label.otherCd2')"
                >
                  <el-table-column
                    prop="conditioTotalSell"
                    align="center"
                    :label="$t('web.i18nFront.label.allAmount')"
                  >
                    <template #default="{ row }"
                      >{{ row.conditioTotalSell + "&nbsp;" + unit }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$t('web.i18nFront.label.otherCd3')"
                >
                  <el-table-column
                    prop="conditionTotalDeposit"
                    align="center"
                    :label="$t('web.i18nFront.label.allRechage')"
                  >
                    <template #default="scope"
                      >{{ scope.row.conditionTotalDeposit + "&nbsp;" + unit }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="conditionTotalProfit"
                  align="center"
                  :label="$t('web.i18nFront.label.otherCd4')"
                >
                  <el-table-column
                    prop="conditionTotalProfit"
                    align="center"
                    :label="$t('web.i18nFront.label.allProfit')"
                  >
                    <template #default="scope"
                      >{{ scope.row.conditionTotalProfit + "&nbsp;" + unit }}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="value"
                  align="center"
                  :label="
                    item.contractCalcMod === '1'
                      ? $t('web.i18nFront.label.contractRate')
                      : $t('web.i18nFront.label.contractAmount')
                  "
                >
                  <template #default="scope">
                    <el-input
                      :placeholder="$t('system.i18nSystem.placeholder.input')"
                      :disabled="!amendContractShow"
                      style="--el-input-border-color: var(--cp-color68)"
                      v-model="scope.row.value"
                      @change="changesubordinateValue(scope.row.value, scope)"
                    ></el-input>
                    {{
                      subordinateContractAll[0]?.contractCalcMod * 1 == 2
                        ? unit
                        : "%"
                    }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <el-empty v-else :description="$t('web.i18nFront.hint.noContract')" />
          <div
            style="text-align: center; margin-top: 20px"
            v-if="amendContractShow"
          >
            <el-button type="primary" @click="amendContract">{{ $t('system.i18nSystem.opration.confirm') }}</el-button>
            <el-button @click="cancelAmendContract">{{ $t('system.i18nSystem.opration.cancel') }}</el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>

<style lang="scss" scoped>
.tables .cus-table {
  --el-table-header-bg-color: var(--kk-edit-card-bg);
  font-size: 14px;
}
.tables :deep(.el-table thead.is-group th.el-table__cell) {
  background: var(--kk-edit-card-bg);
}
.tables .table-card {
  background-color: var(--cp-color174);
  border: 4px solid var(--cp-color175);
  border-radius: 6px;
  padding: 12px 15px;
  margin-bottom: 18px;
}
.tables .title {
  display: block;
  color: var(--el-color-primary);
  margin-bottom: 15px;
  font-size: 16px;
}
</style>
