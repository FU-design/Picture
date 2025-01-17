<script setup lang="ts">
import PicCard from '@/components/pic-card/pic-card.vue'
</script>

<template>
  <div class="flex">
    <PicCard>
      <ul>
        <li v-for="idx in 10" :key="idx">
          {{ idx }}
        </li>
      </ul>
    </PicCard>
  </div>
</template>

<style scoped>
</style>
