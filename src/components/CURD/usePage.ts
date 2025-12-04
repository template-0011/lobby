import { ref } from "vue";
import type {
  IObject,
  PageContentInstance,
  PageModalInstance,
  PageSearchInstance,
} from "./types";
import omitBy from "lodash-es/omitBy";

function usePage() {
  const searchRef = ref<PageSearchInstance>();
  const contentRef = ref<PageContentInstance>();
  const addModalRef = ref<PageModalInstance>();
  const editModalRef = ref<PageModalInstance>();
  const disableModalRef = ref<PageModalInstance>();

  // 去掉对象中的空值键值对
  function removeEmptyKey(queryParams?: IObject) {
    if (!queryParams) {
      return queryParams;
    }
    const newQueryParams = omitBy(
      queryParams,
      (value) => value === "" || value === undefined || value === null
    );
    return newQueryParams;
  }

  // 搜索
  function handleQueryClick(queryParams: IObject) {
    const filterParams = contentRef.value?.getFilterParams();
    contentRef.value?.fetchPageData(
      removeEmptyKey({ ...queryParams, ...filterParams }),
      true
    );
  }
  // 重置
  function handleResetClick(queryParams: IObject) {
    const filterParams = contentRef.value?.getFilterParams();
    contentRef.value?.fetchPageData(
      removeEmptyKey({ ...queryParams, ...filterParams }),
      true
    );
  }
  // 新增
  function handleAddClick() {
    //显示添加表单
    addModalRef.value?.setModalVisible();
  }
  // 编辑
  function handleEditClick(row: IObject) {
    //显示编辑表单 根据数据进行填充
    editModalRef.value?.setModalVisible(row);
  }
  // 表单提交
  function handleSubmitClick() {
    //根据检索条件刷新列表数据
    const queryParams = searchRef.value?.getQueryParams();
    contentRef.value?.fetchPageData(removeEmptyKey(queryParams), true);
  }
  // 搜索显隐
  function handleSearchClick() {
    searchRef.value?.toggleVisible();
  }
  // 涮选数据
  function handleFilterChange(filterParams: IObject) {
    const queryParams = searchRef.value?.getQueryParams();
    contentRef.value?.fetchPageData({ ...queryParams, ...filterParams }, true);
  }
  // 刷新数据
  function refreshPageData(isRestart = false) {
    contentRef.value?.handleRefresh(isRestart);
  }
  // 表格的loading
  const showTableLoading = (isLoading: boolean) => {
    if (contentRef.value) {
      contentRef.value.loading = isLoading;
    }
  };

  return {
    searchRef,
    contentRef,
    addModalRef,
    editModalRef,
    disableModalRef,
    handleQueryClick,
    handleResetClick,
    handleAddClick,
    handleEditClick,
    handleSubmitClick,
    handleSearchClick,
    handleFilterChange,
    refreshPageData,
    showTableLoading,
    removeEmptyKey,
  };
}

export default usePage;
