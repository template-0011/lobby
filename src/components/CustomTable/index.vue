<template>
  <el-card shadow="never">
    <!-- 表格工具栏 -->
    <div class="flex-x-between mb-[10px]">
      <!-- 左侧工具栏 -->
      <div>
        <slot name="toolbar"></slot>
      </div>
      <!-- 右侧工具栏 -->
      <div>
        <template v-if="props.showRefresh">
          <el-button
            icon="refresh"
            circle
            title="刷新"
            @click="onClickRefresh"
          />
        </template>
      </div>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="loading"
      v-bind="contentConfig.table"
      :data="pageData"
      :row-key="pk"
      @selection-change="handleSelectionChange"
    >
      <slot name="columns"></slot>
    </el-table>
    <!-- 分页 -->
    <template v-if="pagination">
      <el-scrollbar>
        <div class="mt-[12px] flex justify-center">
          <el-pagination
            v-bind="pagination"
            :background="true"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-scrollbar>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type {
  ITableConfig,
  IObject,
  IPagination,
} from "@/components/CURD/types";

// 定义接收的属性
const props = withDefaults(
  defineProps<{
    contentConfig: ITableConfig;
    showRefresh?: boolean;
    pageData: IObject[];
    loading?: boolean;
    pagination?: IPagination;
  }>(),
  {
    loading: false,
    showRefresh: true,
    pageData: () => [],
  }
);
// 定义自定义事件
const emit = defineEmits<{
  onRefresh: [];
  onPageChange: [pagination: IPagination];
}>();

// 主键
const pk = props.contentConfig.pk ?? "id";

// 加载状态
// const loading = ref(false);
// 列表数据
// const pageData = ref<IObject[]>([]);

// 行选中
const selectionData = ref<IObject[]>([]);
// 删除ID集合 用于批量删除
const removeIds = ref<(number | string)[]>([]);
function handleSelectionChange(selection: any[]) {
  selectionData.value = selection;
  removeIds.value = selection.map((item) => item[pk]);
}

function handleCurrentChange(value: number) {
  emit("onPageChange", { ...props.pagination, currentPage: value });
}

const onClickRefresh = useThrottleFn(() => {
  emit("onRefresh");
}, 3000);

// 暴露的属性和方法
// defineExpose({});
</script>

<style lang="scss" scoped></style>
