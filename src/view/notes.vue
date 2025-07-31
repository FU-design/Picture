<script setup lang="ts">
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
  <div class="note-wrap">
    <template v-for="[tag, items] of notes" :key="tag">
      <PicCard>
        <h2>{{ tag.toUpperCase() }}</h2>
        <section class="note-sub__title">
          <PicButton v-for="item in items" :key="item.tag" @click="openNote(item)">
            {{ item.title }}
          </PicButton>
        </section>
      </PicCard>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.note-wrap{
  display: grid;
}

.note-sub__title{
  display: grid;
}
</style>
