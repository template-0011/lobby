<template>
  <div>
    <div class="container">
      <el-row>
        <el-col :span="12">
          <!-- 从钱包 -->
          <div class="card">
            <el-row>
              <el-col :span="12">
                <p class="top">
                  {{ $t('web.i18nFront.label.from') }}
                </p>
                <div class="center">
                  <el-select v-model="formWallet" :placeholder="$t('system.i18nSystem.placeholder.select')">
                    <el-option
                      v-for="item in walletList"
                      :key="item.value"
                      :label="`${$t(item.name)} - ${item.abbreviation}`"
                      :value="item.abbreviation"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="12" class="right">
                <p class="top flex items-center justify-end">
                  {{ $t('web.i18nFront.label.availableBalance') }}：
                  <span @click="getLobbyAccountBalanceHandler" class="canClick">
                    {{ curFromWallet.balance }} {{ curFromWallet.unit }}
                  </span>
                  <el-button
                    text
                    icon="Refresh"
                    :loading="refreshBalance"
                    @click="getLobbyAccountBalanceHandler"
                  >
                    <template #icon>
                      <el-icon v-show="!refreshBalance" class="cursor-pointer" size="20">
                        <Refresh />
                      </el-icon>
                    </template>
                  </el-button>
                </p>
                <div class="center">
                  <input type="number" class="fromMoney" id="moneyInput" :placeholder="$t('system.i18nSystem.placeholder.input')" v-model="fromMoney" />
                </div>
                <span class="bottom font-600" @click="allMoney">
                  {{ $t('web.i18nFront.label.all') }}
                </span>
              </el-col>
            </el-row>
          </div>
          <el-button icon="sort" circle type="primary" class="exChangeDiv" @click="exchange"></el-button>
          <!-- 至钱包 -->
          <div class="card">
            <el-row>
              <el-col :span="12">
                <p class="top">
                  {{ $t('web.i18nFront.label.to') }}
                </p>
                <div class="center">
                  <el-select v-model="toWallet" :placeholder="$t('system.i18nSystem.placeholder.select')">
                    <el-option
                      v-for="item in walletList"
                      :key="item.value"
                      :label="`${$t(item.name)} - ${item.abbreviation}`"
                      :value="item.abbreviation"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="12" class="right">
                <div class="center" style="margin-top: 28px">
                  <input type="number" class="fromMoney" placeholder="" v-model="toMoney" disabled />
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="btnDiv">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button type="info" round @click="reset">
                  {{ $t('web.i18nFront.title.reset') }}
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" :loading="loading" round @click="sureChange">
                  {{ $t('web.i18nFront.title.sureChange') }}
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12" class="hrefText">
          <p class="title">{{ $t('web.i18nFront.tips.exchangeDesc') }}</p>
          <p class="text">{{ $t('web.i18nFront.tips.exchangeDesc1') }}</p>
          <p class="text">{{ $t('web.i18nFront.tips.exchangeDesc2') }}</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { platformHttp } from '@/01-kk-system/allHttp/userHall/platform'
import { userHttp } from '@/01-kk-system/allHttp/userHall/user'
import { useUserStore } from '@/store'

// 响应式状态
const formWallet = ref('')
const toWallet = ref('')
const curFromWallet = ref<Record<string, any>>({})
const curToWallet = ref<Record<string, any>>({})
const refreshBalance = ref(false)
const fromMoney = ref('')
const toMoney = ref('')
const walletexchange = ref<Record<string, any>[]>([])
const loading = ref(false)

const { t } = useI18n();

const walletList = ref<Record<string, any>[]>([])
const canUseWalletList = ref<Record<string, any>[]>([])

const userStore = useUserStore()

// 获取可用钱包列表
const getOkWalletList = async () => {
  try {
    const list = await userStore.getFlatAvailableWalletList()
    // 移除点数钱包
    const finalList = list.filter((data: any) => data.abbreviation !== 'POINT')
    canUseWalletList.value = finalList ?? []
    walletList.value = finalList ?? []
  } catch (error) {
    console.error('获取钱包列表失败')
  }
}

const initWallet = () => {
  const curToTarget= canUseWalletList.value.find((data: any) => data.abbreviation !== userStore.currentWalletInfo.abbreviation)
  const curFromTarget = canUseWalletList.value.find((data: any) => data.abbreviation === userStore.currentWalletInfo.abbreviation)
  curFromWallet.value = curFromTarget ?? {}
  formWallet.value = curFromWallet.value.abbreviation ?? ''
  curToWallet.value = curToTarget ?? {}
  toWallet.value = curToWallet.value.abbreviation ?? ''
}

const getLobbyAccountBalanceHandler = async () => {
  const { walletType, currencyCode } = curFromWallet.value
  if (!walletType || !currencyCode) return
  try {
    refreshBalance.value = true
    const res = await userHttp.getBalance(walletType, currencyCode)
    if (res.code === "0") {
      curFromWallet.value.balance = res.data.balance
    }
  } finally {
    refreshBalance.value = false
  }
}

const getWalletexchangeHandler = async () => {
  try {
    const res = await platformHttp.getWalletexchange()
    if (res.code === "0") walletexchange.value = res.data
  } catch (error) {
    console.error(t('web.i18nFront.tips.exchangeFail'))
  }
}

const allMoney = () => {
  fromMoney.value = curFromWallet.value.balance
}

const exchange = () => {
  const from = formWallet.value
  const to = toWallet.value
  formWallet.value = to
  toWallet.value = from
  fromMoney.value = ''
  toMoney.value = ''
}

const fromChange = () => {
  const fromMoneyNum = Number(fromMoney.value ?? 0)
  if (!fromMoneyNum) {
    toMoney.value = ''
    return
  }
  if (!walletexchange.value.length) {
    ElMessage.error(t('web.i18nFront.tips.exchangeFail'))
    return
  }

  let from = 0, to = 0
  for (const element of walletexchange.value) {
    if (element.walletType === curFromWallet.value.walletType &&
        element.currencyCode === curFromWallet.value.currencyCode) {
      from = Number(element.exchangeRate)
    }
    if (element.walletType === curToWallet.value.walletType &&
        element.currencyCode === curToWallet.value.currencyCode) {
      to = Number(element.exchangeRate)
    }
  }

  toMoney.value = ((fromMoneyNum / from) * to).toFixed(2)
}

const sureChange = async () => {
  if (!walletexchange.value.length) {
    ElMessage.error(t('web.i18nFront.tips.exchangeFail'))
    return
  }
  if (!fromMoney.value || !toMoney.value) {
    ElMessage.error(t('web.i18nFront.tips.exchangeError'))
    return
  }

  if (curFromWallet.value.abbreviation !== curToWallet.value.abbreviation) {
    const params = {
      fromCurrencyCode: curFromWallet.value.currencyCode,
      fromWalletType: curFromWallet.value.walletType,
      money: fromMoney.value,
      toCurrencyCode: curToWallet.value.currencyCode,
      toWalletType: curToWallet.value.walletType
    }

    loading.value = true
    try {
      const res = await userHttp.exchange(params)
      if (res?.code === "0") {
        ElMessage.success(t('web.i18nFront.tips.exchangeSuccess'))
        fromMoney.value = ''
        toMoney.value = ''
        getLobbyAccountBalanceHandler()
      }
    } finally {
      loading.value = false
    }
  } else {
    ElMessage.error(t('web.i18nFront.tips.exchangeSame'))
  }
}

const reset = () => {
  fromMoney.value = ''
  initWallet()
}

// 监听器
watch(fromMoney, () => {
  fromChange()
})

watch(formWallet, () => {
  const target = canUseWalletList.value.find((data: any) => data.abbreviation === formWallet.value)
  curFromWallet.value = target ?? {}
  fromMoney.value = ''
  getLobbyAccountBalanceHandler()
})

watch(toWallet, () => {
  const target = canUseWalletList.value.find((data: any) => data.abbreviation === toWallet.value)
  curToWallet.value = target ?? {}
  if (fromMoney.value) fromChange()
})

// watch(canUseWalletList, () => {
//   initWallet()
// })


const init = async () => {
  await Promise.allSettled([
    getOkWalletList(),
    getWalletexchangeHandler()
  ])
  if (!formWallet.value && canUseWalletList.value.length) initWallet()
  setTimeout(() => {
    document.getElementById('moneyInput')?.focus()
  }, 60)
}

// 生命周期钩子
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 50px;
  overflow-y: auto;
  position: relative;
  margin: 0 auto;
  background: #fff;
  .card {
    background: #f1f4f5;
    border-radius: 10px;
    margin: 10px auto;
    padding: 15px;
    max-width: 650px;
    .right {
      text-align: right;
    }
    .top {
      font-size: 14px;
      color: #969799;
      .refresh {
        font-weight: bold;
      }
      .canClick {
        cursor: pointer;
      }
    }
    .center {
      font-size: 14px;
      margin-top: 20px;
      .fromMoney {
        border: none;
        outline: none;
        font-size: 14px;
        width: 150px;
        text-align: right;
        height: 30px;
        background: #f1f4f5;
      }
    }
    .bottom {
      display: inline-block;
      margin-top: 15px;
      color: orange;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .exChangeDiv {
    margin-left: 48%;
    border: 1px solid #f1f4f5;
  }
  .btnDiv {
    font-size: 16px;
    margin: 30px auto 15px;
    max-width: 650px;
  }
}
.hrefText {
  font-size: 14px;
  padding: 10px 15px 10px 40px;
  margin-bottom: 20px;
  .title {
    padding-bottom: 20px;
    border-bottom: 1px solid #dbdfe0;
  }
  .text {
    margin-top: 15px;
  }
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
:deep(.el-input__inner) {
  background: #f1f4f5;
  padding-left: 0;
  border: none;
}
:deep(.el-button.is-round) {
  border-radius: 20px;
  width: 100%;
}
:deep(.el-button.is-circle) {
  border-radius: 50%;
}
</style>
