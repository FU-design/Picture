<script lang="ts" setup>

</script>

<template>
  <div class="pic-view">
    <slot />
  </div>
</template>

<style scoped>
.pic-view {
  width: 60%;
  padding: 24px 16px;
  border-radius: 4px;
  box-sizing: border-box;
  margin: 16px auto 100px;
  /* background-color: #fff; */
  box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px, rgba(0, 0, 0, 0.3) 0 1px 3px -1px;
}
</style>
