<script setup lang="ts">
import PicButton from '@/components/pic-button/pic-button.vue'
import PicView from '@/components/pic-view/pic-view.vue'
import { type NoteType, useNotes } from '@/composables/useNotes'
import { onMounted } from 'vue'

const { notes, setupNotes } = useNotes()

async function openNote(note: NoteType) {
  console.warn('note :>> ', note)
}

onMounted(() => {
  setupNotes()
})
</script>

<template>
  <PicView>
    <div class="note-wrap">
      <PicButton v-for="(note, idx) in notes" :key="idx" @click.prevent="openNote(note)">
        <span>
          {{ note.title }}
        </span>
      </PicButton>
    </div>
  </PicView>
</template>

<style lang="scss" scoped>
.note-wrap{
  display: grid;
  gap: 16px;
}
</style>
