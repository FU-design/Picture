<script setup lang="ts">
import PicCard from '@/components/pic-card/pic-card.vue'
import picView from '@/components/pic-view/pic-view.vue'
import { type NoteType, useNotes } from '@/composables/useNotes'
import { onMounted } from 'vue'

const { notes, setupNotes } = useNotes()

function openNote(note: NoteType) {
  console.warn('note :>> ', note)
}
onMounted(() => {
  setupNotes()
  console.warn(notes)
})
</script>

<template>
  <picView>
    <PicCard v-for="(note, idx) in notes" :key="idx">
      <a class="text-zinc-600 hover:text-black" href="#" @click="openNote(note)">
        {{ note.title }}
      </a>
    </PicCard>
  </picView>
</template>

<style scoped>
</style>
