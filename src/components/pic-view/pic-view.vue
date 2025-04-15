<script setup lang="ts">

</script>

<template>
  <div class="pic-view">
    <slot />
  </div>
</template>

<style scoped>
.pic-view{
  width: 60%;
  margin: 0 auto;
  margin-top: 16px;
  padding: 24px 16px;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}
</style>
