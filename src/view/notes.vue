<script setup lang="ts">
import PicButton from '@/components/PicButton/index.vue'
import PicView from '@/components/PicView/index.vue'
import { type NoteType, useNotes } from '@/composables/useNotes'
import { onMounted } from 'vue'

const { notes, setupNotes, updateRouterOfNote } = useNotes()

async function openNote(note: NoteType) {
  updateRouterOfNote(note)
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
