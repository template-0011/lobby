<template>
  <div class="setting-container">
    <!-- 网站类型 -->
    <div class="setting-section">
      <div class="section-title">网站类型</div>
      <el-radio-group v-model="formData.siteType">
        <el-radio value="europe">欧洲视图</el-radio>
        <el-radio value="asia">亚洲视图</el-radio>
      </el-radio-group>
    </div>

    <!-- 赔率格式 -->
    <div class="setting-section">
      <div class="section-title">赔率格式</div>
      <el-select v-model="formData.oddsFormat" class="odds-select">
        <el-option label="小数赔率 (2.2)" value="decimal" />
        <el-option label="分数赔率 (6/5)" value="fractional" />
        <el-option label="美式赔率 (+120)" value="american" />
        <el-option label="香港赔率 (1.20)" value="hongkong" />
        <el-option label="印尼赔率 (1.20)" value="indonesian" />
        <el-option label="马来赔率 (0.83)" value="malay" />
      </el-select>
    </div>

    <!-- 盘口显示 -->
    <div class="setting-section">
      <div class="section-title">盘口显示</div>
      <el-radio-group v-model="formData.handicapDisplay">
        <el-radio value="full">完整</el-radio>
        <el-radio value="simple">简要</el-radio>
      </el-radio-group>
    </div>

    <!-- 其他 -->
    <div class="setting-section">
      <div class="section-title">其他</div>
      <div class="checkbox-group">
        <el-checkbox v-model="formData.dailyRollingParlay">当日滚球多重彩</el-checkbox>
        <el-checkbox v-model="formData.dailyParlay">当日多重彩</el-checkbox>
        <el-checkbox v-model="formData.openInNewWindow">在新窗口中显示数据</el-checkbox>
        <el-checkbox v-model="formData.moveVideoOnScroll">滚动时移动视频</el-checkbox>
        <el-checkbox v-model="formData.showGameId">显示游戏ID</el-checkbox>
        <el-checkbox v-model="formData.disable1xZone">禁用1xZone</el-checkbox>
        <el-checkbox v-model="formData.accessibilityHandicap">视障人士的盘口显示</el-checkbox>
      </div>
    </div>

    <!-- 保存按钮 -->
    <el-button type="success" class="save-btn" @click="handleSave">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface SettingForm {
  siteType: string
  oddsFormat: string
  handicapDisplay: string
  dailyRollingParlay: boolean
  dailyParlay: boolean
  openInNewWindow: boolean
  moveVideoOnScroll: boolean
  showGameId: boolean
  disable1xZone: boolean
  accessibilityHandicap: boolean
}

const formData = reactive<SettingForm>({
  siteType: 'asia',
  oddsFormat: 'decimal',
  handicapDisplay: 'simple',
  dailyRollingParlay: true,
  dailyParlay: true,
  openInNewWindow: true,
  moveVideoOnScroll: true,
  showGameId: false,
  disable1xZone: false,
  accessibilityHandicap: false,
})

const handleSave = () => {
  console.log('保存设置:', formData)
  // TODO: 实现保存逻辑
}
</script>

<style scoped lang="scss">
.setting-container {
  padding: 20px;
  background-color: #fff;
  min-width: 320px;

  .setting-section {
    margin-bottom: 20px;

    .section-title {
      color: #1d4268;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 12px;
    }
  }

  :deep(.el-radio-group) {
    display: flex;
    gap: 24px;

    .el-radio {
      --el-radio-text-color: #1d4268;
      --el-radio-input-border-color: #1d4268;

      .el-radio__input.is-checked .el-radio__inner {
        background-color: #1d4268;
        border-color: #1d4268;
      }

      .el-radio__input.is-checked + .el-radio__label {
        color: #1d4268;
      }
    }
  }

  .odds-select {
    width: 100%;

    :deep(.el-select__wrapper) {
      border: 1px solid #1d4268;
      border-radius: 8px;
      height: 44px;
      background-color: #fff;

      .el-select__placeholder {
        color: #1d4268;
      }

      .el-select__selected-item {
        color: #1d4268;
      }

      .el-select__caret {
        color: #1d4268;
      }
    }
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;

    :deep(.el-checkbox) {
      --el-checkbox-text-color: #1d4268;
      --el-checkbox-input-border-color: #1d4268;
      height: auto;
      margin-right: 0;

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #1d4268;
        border-color: #1d4268;
      }

      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #1d4268;
      }

      .el-checkbox__inner {
        border-radius: 4px;
        width: 18px;
        height: 18px;

        &::after {
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
        }
      }

      .el-checkbox__label {
        font-size: 14px;
        padding-left: 10px;
      }
    }
  }

  .save-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    margin-top: 10px;
    --el-button-bg-color: #6b8e23;
    --el-button-border-color: #6b8e23;
    --el-button-hover-bg-color: #7aa329;
    --el-button-hover-border-color: #7aa329;
    --el-button-active-bg-color: #5a7a1e;
    --el-button-active-border-color: #5a7a1e;
  }
}
</style>
