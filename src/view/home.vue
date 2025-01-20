<script setup lang="ts">
import PicView from '@/components/pic-view/pic-view.vue'
</script>

<template>
  <div class="flex">
    <PicView>
      <ul>
        <li v-for="idx in 60" :key="idx">
          {{ idx }}
        </li>
      </ul>
    </PicView>
  </div>
</template>

<style scoped>
</style>
