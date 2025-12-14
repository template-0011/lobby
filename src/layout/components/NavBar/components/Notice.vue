<template>
  <div class="button-body flex-center rounded-2 w-8 h-8 mr-2 cursor-pointer" @click="handleClick">
    <el-icon color="#fff" size="20px"><BellFilled /></el-icon>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  (e: 'onClick'): void
}>();

const handleClick = () => {
  emit('onClick');
}
</script>
<style scoped>
.button-body {
  background-color: #276aa5;
  cursor: pointer;
  transition: all .1s;
}
</style>
