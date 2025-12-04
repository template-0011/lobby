<template>
  <div class="button-body flex-center rounded-2 w-10 h-10 cursor-pointer" @click="handleClick">
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
  background-image: linear-gradient(0deg, transparent 0%, transparent 100%);
  background-color: #1f2841;
  cursor: pointer;
  transition: all .1s;
}
</style>
