<template>
  <el-card shadow="never">
    <!-- 表格工具栏 -->
    <div class="flex-x-between mb-[10px]">
      <!-- 左侧工具栏 -->
      <div>
        <template v-for="item in toolbar" :key="item">
          <template v-if="typeof item === 'string'">
            <!-- 新增 -->
            <template v-if="item === 'add'">
              <el-button
                type="success"
                icon="plus"
                @click="handleToolbar(item)"
              >
                新增
              </el-button>
            </template>
            <!-- 删除 -->
            <template v-else-if="item === 'delete'">
              <el-button
                type="danger"
                icon="delete"
                :disabled="removeIds.length === 0"
                @click="handleToolbar(item)"
              >
                删除
              </el-button>
            </template>
            <!-- 导入 -->
            <template v-else-if="item === 'import'">
              <el-button
                type="default"
                icon="upload"
                @click="handleToolbar(item)"
              >
                导入
              </el-button>
            </template>
            <!-- 导出 -->
            <template v-else-if="item === 'export'">
              <el-button
                type="default"
                icon="download"
                @click="handleToolbar(item)"
              >
                导出
              </el-button>
            </template>
          </template>
          <!-- 其他 -->
          <template v-else-if="typeof item === 'object'">
            <el-button
              :icon="item.icon"
              :type="item.type ?? 'default'"
              @click="handleToolbar(item.name)"
            >
              {{ item.text ? $t(item.text) : "" }}
            </el-button>
          </template>
        </template>
      </div>
      <!-- 右侧工具栏 -->
      <div>
        <template v-for="item in defaultToolbar" :key="item">
          <template v-if="typeof item === 'string'">
            <!-- 刷新 -->
            <template v-if="item === 'refresh'">
              <el-button
                icon="refresh"
                circle
                title="刷新"
                @click="handleToolbar(item)"
              />
            </template>
          </template>
          <!-- 其他 -->
          <template v-else-if="typeof item === 'object'">
            <template v-if="item.auth">
              <el-button
                :icon="item.icon"
                circle
                :title="item.title"
                @click="handleToolbar(item.name)"
              />
            </template>
            <template v-else>
              <el-button
                :icon="item.icon"
                circle
                :title="item.title"
                @click="handleToolbar(item.name)"
              />
            </template>
          </template>
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
      @filter-change="handleFilterChange"
    >
      <template v-for="col in cols" :key="col">
        <el-table-column
          v-if="col.show"
          v-bind="col"
          :label="$t(col.label ?? '')"
        >
          <template #default="scope">
            <!-- 显示图片 -->
            <template v-if="col.templet === 'image'">
              <template v-if="col.prop">
                <template v-if="Array.isArray(scope.row[col.prop])">
                  <template
                    v-for="(item, index) in scope.row[col.prop]"
                    :key="item"
                  >
                    <el-image
                      :src="item"
                      :preview-src-list="scope.row[col.prop]"
                      :initial-index="index"
                      :preview-teleported="true"
                      :style="`width: ${col.imageWidth ?? 40}px; height: ${col.imageHeight ?? 40}px`"
                    />
                  </template>
                </template>
                <template v-else>
                  <el-image
                    :src="scope.row[col.prop]"
                    :preview-src-list="[scope.row[col.prop]]"
                    :preview-teleported="true"
                    :style="`width: ${col.imageWidth ?? 40}px; height: ${col.imageHeight ?? 40}px`"
                  />
                </template>
              </template>
            </template>
            <!-- 根据行的selectList属性返回对应列表值 -->
            <template v-else-if="col.templet === 'list'">
              <template v-if="col.prop">
                {{ (col.selectList ?? {})[scope.row[col.prop]] }}
              </template>
            </template>
            <!-- 格式化显示链接 -->
            <template v-else-if="col.templet === 'url'">
              <template v-if="col.prop">
                <el-link
                  type="primary"
                  :href="scope.row[col.prop]"
                  target="_blank"
                >
                  {{ scope.row[col.prop] }}
                </el-link>
              </template>
            </template>
            <!-- 生成开关组件 -->
            <template v-else-if="col.templet === 'switch'">
              <template v-if="col.prop">
                <!-- pageData.length>0: 解决el-switch组件会在表格初始化的时候触发一次change事件 -->
                <el-switch
                  v-model="scope.row[col.prop]"
                  :active-value="col.activeValue ?? 1"
                  :inactive-value="col.inactiveValue ?? 0"
                  :inline-prompt="true"
                  :active-text="col.activeText ?? ''"
                  :inactive-text="col.inactiveText ?? ''"
                  :validate-event="false"
                  :before-change="beforeSwitchChange"
                  :disabled="!hasAuth(`${contentConfig.pageName}:modify`)"
                  @change="
                    pageData.length > 0 &&
                      handleModify(
                        col.prop,
                        scope.row[col.prop],
                        scope.row,
                        col.actionOptions
                      )
                  "
                />
              </template>
            </template>
            <!-- 生成输入框组件 -->
            <template v-else-if="col.templet === 'input'">
              <template v-if="col.prop">
                <el-input
                  v-model="scope.row[col.prop]"
                  :type="col.inputType ?? 'text'"
                  :disabled="!hasAuth(`${contentConfig.pageName}:modify`)"
                  @blur="handleModify(col.prop, scope.row[col.prop], scope.row)"
                />
              </template>
            </template>
            <!-- 格式化为价格 -->
            <template v-else-if="col.templet === 'price'">
              <template v-if="col.prop">
                {{ `${col.priceFormat ?? "￥"}${scope.row[col.prop]}` }}
              </template>
            </template>
            <!-- 格式化为百分比 -->
            <template v-else-if="col.templet === 'percent'">
              <template v-if="col.prop"> {{ scope.row[col.prop] }}% </template>
            </template>
            <!-- 显示图标 -->
            <template v-else-if="col.templet === 'icon'">
              <template v-if="col.prop">
                <template v-if="scope.row[col.prop].startsWith('el-icon-')">
                  <el-icon>
                    <component
                      :is="scope.row[col.prop].replace('el-icon-', '')"
                    />
                  </el-icon>
                </template>
                <template v-else>
                  <svg-icon :icon-class="scope.row[col.prop]" />
                </template>
              </template>
            </template>
            <!-- 格式化时间 -->
            <template v-else-if="col.templet === 'date'">
              <template v-if="col.prop">
                {{
                  useDateFormat(
                    scope.row[col.prop],
                    col.dateFormat ?? "YYYY-MM-DD HH:mm:ss"
                  ).value
                }}
              </template>
            </template>
            <!-- 列操作栏 -->
            <template v-else-if="col.templet === 'tool'">
              <template
                v-for="item in col.operat ?? ['edit', 'delete']"
                :key="item"
              >
                <template v-if="typeof item === 'string'">
                  <!-- 编辑/删除 -->
                  <template v-if="item === 'edit' || item === 'delete'">
                    <el-button
                      :type="item === 'edit' ? 'primary' : 'danger'"
                      :icon="item"
                      size="small"
                      link
                      @click="
                        handleOperat({
                          name: item,
                          row: scope.row,
                          column: scope.column,
                          $index: scope.$index,
                        })
                      "
                    >
                      {{
                        item === "edit"
                          ? $t("system.i18nSystem.label.edit")
                          : $t("system.i18nSystem.label.delete")
                      }}
                    </el-button>
                  </template>
                </template>
                <!-- 其他 -->
                <template v-else-if="typeof item === 'object'">
                  <el-button
                    v-if="item.render === undefined || item.render(scope.row)"
                    :icon="item.icon"
                    :type="item.type ?? 'primary'"
                    size="small"
                    link
                    @click="
                      handleOperat({
                        name: item.name,
                        row: scope.row,
                        column: scope.column,
                        $index: scope.$index,
                      })
                    "
                  >
                    {{ item.text }}
                  </el-button>
                </template>
              </template>
            </template>
            <!-- 自定义 -->
            <template v-else-if="col.templet === 'custom'">
              <slot
                :name="col.slotName ?? col.prop"
                :prop="col.prop"
                v-bind="scope"
              ></slot>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <template v-if="showPagination">
      <el-scrollbar>
        <div class="mt-[12px] flex justify-center">
          <el-pagination
            v-bind="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-scrollbar>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import SvgIcon from "@/04-kk-component-admin/components/SvgIcon/index.vue";
import { hasAuth } from "@/plugins/permission";
import { useDateFormat, useThrottleFn } from "@vueuse/core";
import { reactive, ref } from "vue";
import type { IContentConfig, IObject, IOperatData } from "./types";

const { t } = useI18n();

// 定义接收的属性
const props = defineProps<{
  contentConfig: IContentConfig;
}>();
// 定义自定义事件
const emit = defineEmits<{
  addClick: [];
  exportClick: [];
  searchClick: [];
  toolbarClick: [name: string];
  editClick: [row: IObject];
  operatClick: [data: IOperatData];
  filterChange: [data: IObject];
}>();

// 主键
const pk = props.contentConfig.pk ?? "id";
// 表格左侧工具栏
const toolbar = props.contentConfig.toolbar ?? ["add", "delete"];
// 表格右侧工具栏
const defaultToolbar = props.contentConfig.defaultToolbar ?? [
  "refresh",
  "filter",
];
// 表格列
const cols = ref(
  props.contentConfig.cols.map((col) => {
    col.initFn && col.initFn(col);
    if (col.show === undefined) {
      col.show = true;
    }
    if (
      col.prop !== undefined &&
      col.columnKey === undefined &&
      col["column-key"] === undefined
    ) {
      col.columnKey = col.prop;
    }
    if (
      col.type === "selection" &&
      col.reserveSelection === undefined &&
      col["reserve-selection"] === undefined
    ) {
      // 配合表格row-key实现跨页多选
      col.reserveSelection = true;
    }
    return col;
  })
);
// 加载状态
const loading = ref(false);
// 列表数据
const pageData = ref<IObject[]>([]);
// 显示分页
const showPagination = props.contentConfig.pagination !== false;
// 分页配置
const defalutPagination = {
  background: true,
  layout: "total, prev, pager, next",
  pageSize: 10,
  total: 0,
  currentPage: 1,
};
const pagination = reactive(
  typeof props.contentConfig.pagination === "object"
    ? { ...defalutPagination, ...props.contentConfig.pagination }
    : defalutPagination
);
// 分页相关的请求参数
const request = props.contentConfig.request ?? {
  pageName: "current",
  limitName: "size",
};

// 行选中
const selectionData = ref<IObject[]>([]);
// 删除ID集合 用于批量删除
const removeIds = ref<(number | string)[]>([]);
function handleSelectionChange(selection: any[]) {
  selectionData.value = selection;
  removeIds.value = selection.map((item) => item[pk]);
}

// 刷新
function handleRefresh(isRestart = false) {
  fetchPageData(lastFormData, isRestart);
}

// 删除
function handleDelete(id?: number | string) {
  const ids = [id || removeIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    if (props.contentConfig.deleteAction) {
      loading.value = true;
      props.contentConfig
        .deleteAction(ids)
        .then((res) => {
          const { code } = res || {};
          if (code === "0") {
            ElMessage.success(t("system.i18nSystem.hint.deleteSuccess"));
            handleRefresh(true);
          } else {
            loading.value = false;
          }
        })
        .catch(() => (loading.value = false));
    } else {
      ElMessage.error("未配置deleteAction");
    }
  });
}

// 操作栏
function handleToolbar(name: string) {
  switch (name) {
    case "refresh":
      handleRefresh();
      break;
    case "search":
      emit("searchClick");
      break;
    case "add":
      emit("addClick");
      break;
    case "delete":
      handleDelete();
      break;
    case "export":
      emit("exportClick");
      break;
    default:
      emit("toolbarClick", name);
      break;
  }
}

// 操作列
function handleOperat(data: IOperatData) {
  switch (data.name) {
    case "edit":
      emit("editClick", data.row);
      break;
    case "delete":
      handleDelete(data.row[pk]);
      break;
    default:
      emit("operatClick", data);
      break;
  }
}

// switch
const beforeSwitchChange = async () => {
  const confirm = await ElMessageBox.confirm(
    t("system.i18nSystem.hint.confirmAct"),
    t("system.i18nSystem.hint.warning"),
    { type: "warning" }
  ).catch(() => null);
  return !!confirm;
};

// 属性修改
async function handleModify(
  field: string,
  value: boolean | string | number,
  row: Record<string, any>,
  actionOptions?: { needConfirm?: boolean }
) {
  if (actionOptions?.needConfirm) {
    const confirm = await ElMessageBox.confirm(
      t("system.i18nSystem.hint.confirmAct"),
      t("system.i18nSystem.hint.warning"),
      {
        confirmButtonText: t("system.i18nSystem.opration.confirm"),
        cancelButtonText: t("system.i18nSystem.opration.cancel"),
        type: "warning",
      }
    ).catch(() => null);
    if (confirm) {
      handleContentmodifyAction(field, value, row);
    } else {
      handleRefresh();
    }
  } else {
    handleContentmodifyAction(field, value, row);
  }
}

const handleContentmodifyAction = async (
  field: string,
  value: boolean | string | number,
  row: Record<string, any>
) => {
  if (props.contentConfig.modifyAction) {
    loading.value = true;
    await props.contentConfig
      .modifyAction({
        [pk]: row[pk],
        field: field,
        value: value,
      })
      .catch(() => null);
    loading.value = false;
    handleRefresh();
  } else {
    ElMessage.error("未配置modifyAction");
  }
};

// 分页切换
function handleSizeChange(value: number) {
  pagination.pageSize = value;
  handleRefresh();
}
function handleCurrentChange(value: number) {
  pagination.currentPage = value;
  handleRefresh();
}

// 远程数据筛选
let filterParams: IObject = {};
function handleFilterChange(newFilters: any) {
  const filters: IObject = {};
  for (const key in newFilters) {
    const col = cols.value.find((col) => {
      return col.columnKey === key || col["column-key"] === key;
    });
    if (col && col.filterJoin !== undefined) {
      filters[key] = newFilters[key].join(col.filterJoin);
    } else {
      filters[key] = newFilters[key];
    }
  }
  filterParams = { ...filterParams, ...filters };
  emit("filterChange", filterParams);
}

// 获取涮选条件
function getFilterParams() {
  return filterParams;
}

// 获取分页数据
let lastFormData = {};
function fetchPageData(formData: IObject = {}, isRestart = false) {
  loading.value = true;
  // 上一次搜索条件
  lastFormData = formData;
  // 重置页码
  if (isRestart) {
    pagination.currentPage = 1;
  }
  // formData
  // 处理时间数组
  if ("createTimeRange" in formData) {
    const [start, end] = formData.createTimeRange as string[];
    formData.createTimeFrom = start;
    formData.createTimeTo = end ? end.replace("00:00:00", "23:59:59") : end;
    delete formData.createTimeRange;
  }
  props.contentConfig
    .indexAction(
      showPagination
        ? {
            [request.pageName]: pagination.currentPage,
            [request.limitName]: pagination.pageSize,
            ...formData,
          }
        : formData
    )
    .then((res) => {
      let data = res.data || {};
      if (showPagination) {
        if (props.contentConfig.parseData) {
          data = props.contentConfig.parseData(res);
        }
        const { recordList, total } = data || {};
        pagination.total = total ? Number(total) : 0;
        pageData.value = recordList || [];
      } else {
        const { recordList } = data || {};
        pageData.value = recordList || [];
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
fetchPageData();

// 暴露的属性和方法
defineExpose({
  fetchPageData,
  getFilterParams,
  handleRefresh,
  loading,
});
</script>

<style lang="scss" scoped></style>
