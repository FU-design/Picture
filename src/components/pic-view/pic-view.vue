<script setup lang="ts">

</script>

<template>
  <div class="view rounded-md relative w-full px-6 py-6 shadow-xl shadow-slate-700/10 ring-1 ring-gray-800/100 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28">
    <slot />
  </div>
</template>

<style scoped>
.view{
  background-image: url('@/assets/grid.svg');
}
</style>
