<script setup lang="ts">
import { type NoteType, useNotes } from '@/composables/useNotes'
import { onMounted } from 'vue'

const { notes, setupNotes, updateRouterOfNote } = useNotes()

const notePosStates = ref<Map<string, { w: number, h: number }>>(new Map())

async function openNote(note: NoteType) {
  updateRouterOfNote(note)
}

function setNoteCardPostion() {
  const noteWrap = document.querySelector('.note-wrap') as HTMLElement

  const resizeObserver = new ResizeObserver(() => {
    const noteItems = document.querySelectorAll('.note-item') as NodeListOf<HTMLElement>

    noteItems.forEach((item) => {
      const { width: w, height: h } = item.getBoundingClientRect()
      const tag = item.getAttribute('id')
      notePosStates.value.set(tag!, { w, h })
    })
  })

  resizeObserver.observe(noteWrap)
}

onMounted(async () => {
  await setupNotes()
  setNoteCardPostion()
})
</script>

<template>
  <div class="note-wrap">
    <template v-for="[tag, items] of notes" :key="tag">
      <div :id="tag" class="note-item">
        <PicCard>
          <h2>{{ tag.toUpperCase() }}</h2>
          <section class="note-sub__title">
            <PicButton v-for="item in items" :key="item.tag" @click="openNote(item)">
              {{ item.title }}
            </PicButton>
          </section>
        </PicCard>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.note-wrap{
  position: relative;
  height: 100%;
  display: grid;
  background-color: rgba(48, 78, 113, 0.31);
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding-inline: 16px;
}

.note-item{
  // position: absolute;
}

.note-sub__title{
  display: grid;
}
</style>
