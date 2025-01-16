<script setup lang="ts">

</script>

<template>
  <div class="pic-card">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>

<style scoped>
.pic-card{

}
</style>
