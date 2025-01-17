<script setup lang="ts">
import PicCard from '@/components/pic-card/pic-card.vue'
</script>

<template>
  <div class="home">
    <h1 class="text-zinc-400">
      HELLO
    </h1>
    <PicCard>
      <ul>
        <li v-for="idx in 100" :key="idx">
          {{ idx }}
        </li>
      </ul>
    </PicCard>
  </div>
</template>

<style scoped>
</style>
