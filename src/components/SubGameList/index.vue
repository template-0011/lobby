<script setup lang="ts">
import { IObject } from '@/01-kk-system/allHttp/types/common'
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: "SubGameList",
});

const props = withDefaults(defineProps<{
  loading: boolean;
  tagList?: IObject[];
  currentTag?: IObject;
  tagKey?: string;
  gameList: IObject[];
  pagination?: PageQuery
  showSearch?: boolean
  type: 'outer' | 'lottery'
}>(), {
  loading: false,
  tagList: () => [],
  currentTag: () => ({}),
  tagKey: 'outerGamerID',
  gameList: () => [],
  type: 'outer',
  showSearch: true,
})

const searchText = ref('')

const emit = defineEmits<{
  onTagChange: [data: IObject]
  onPageChange: [data: IObject]
  onSearch: [data: string]
}>()

</script>

<template>
  <div class="list-content w-1200px mx-auto" v-loading="loading">
      <div class="flex gap-y-2 flex-wrap" v-if="tagList?.length">
        <SelectTag
          :is-select="currentTag[tagKey] === game[tagKey]"
          @onSelect="emit('onTagChange', game)"
          v-for="(game, i) in tagList"
          :game="game"
          :key="i + 'fish'" />
      </div>
      <div class="flex justify-end" v-if="showSearch">
        <el-input
          v-model="searchText"
          style="max-width: 400px"
          theme="dark"
          clearable
          :placeholder="$t('system.i18nSystem.placeholder.inputGame')"
          class="input-with-select"
          @keyup.enter="emit('onSearch', searchText)"
        >
          <template #append>
            <el-button :icon="Search" @click="emit('onSearch', searchText)" />
          </template>
        </el-input>
      </div>
      <el-divider style="--el-border-color: rgba(255,255,255,0.2)"></el-divider>
      <div class="game-list-box">
        <template v-if="gameList.length > 0">
          <ul class="list-container">
            <li v-for="(item, i) in gameList" :key="i + 'g-card'">
              <OuterGameCard :item="item" :type="type" />
            </li>
          </ul>
          <div class="flex-center" v-if="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              v-model:current-page="pagination.pageNum"
              v-model:page-size="pagination.pageSize"
              @change="emit('onPageChange', pagination)"
              :total="pagination.totalPages" />
          </div>
        </template>
        <el-empty v-else />
      </div>
    </div>
</template>

<style lang="scss" scoped>

.list-content {
  border-radius: 10px;
  background: var(--kk-body-bg-color);
  box-shadow: 0 0 15px 0 rgba(232, 231, 231, 0.05);
  position: relative;
  box-sizing: border-box;
  z-index: 19;
  padding: 30px 39px 20px;
}

.game-list-box {
  margin-top: 20px;
  min-height: 600px;
  -webkit-flex-flow: column nowrap;
  flex-flow: column nowrap;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-align-items: center;
  align-items: center;
  position: relative;
}

.list-container {
  width: 100%;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  gap: 0 16px;
}

.el-input {
  --el-input-border-color: rgba(255,255,255,0.2);
}
:deep(.el-input-group__append) {
  background-color: rgba(255,255,255,0);
}
</style>
