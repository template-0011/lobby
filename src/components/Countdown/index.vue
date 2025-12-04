<script setup lang="ts">
defineOptions({
  name: "KKCountdown",
});

const props = defineProps({
  time: {
    type: Number,
    required: true,
    default: 0
  }
})

const countdown = ref(0);
</script>

<template>
  <div>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style lang="scss" scoped>
</style>
