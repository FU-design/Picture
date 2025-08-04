<script setup lang="ts">
import { type NoteData, useNotes } from '@/composables/useNotes'
import { onMounted } from 'vue'

const { notes, setupNotes, updateRouterOfNote } = useNotes()

// const notePosStates = ref<Map<string, { w: number, h: number }>>(new Map())

async function openNote(note: NoteData) {
  updateRouterOfNote(note)
}

// function setNoteCardPostion() {
//   const noteWrap = document.querySelector('.note-wrap') as HTMLElement

//   const resizeObserver = new ResizeObserver(() => {
//     const noteItems = document.querySelectorAll('.note-item') as NodeListOf<HTMLElement>

//     noteItems.forEach((item) => {
//       const { width: w, height: h } = item.getBoundingClientRect()
//       const tag = item.getAttribute('id')
//       notePosStates.value.set(tag!, { w, h })
//     })
//   })

//   resizeObserver.observe(noteWrap)
// }

onMounted(async () => {
  await setupNotes()
  // setNoteCardPostion()
})
</script>

<template>
  <PicView>
    <div class="note-wrap">
      <template v-for="[tag, items] of notes" :key="tag">
        <PicCard>
          <div :id="tag" class="note-item">
            <h1>{{ tag.toUpperCase() }}</h1>
            <section class="note-title">
              <template v-for="item in items" :key="item.Tag">
                <a class="note-sub-title" @click="openNote(item)">
                  <i> {{ item['File Name'] }}</i>
                  <i>{{ item['Created At'] }}</i>
                </a>
              </template>
            </section>
          </div>
        </PicCard>
      </template>
    </div>
  </PicView>
</template>

<style lang="scss" scoped>
.note-item{
  width: 100%;
  h1{
    margin-bottom: 8px;
  }
}

.note-title{
  display: grid;
  gap: 8px;
  color: #00000090;
}

.note-sub-title{
  display: flex;
  justify-content: space-between;
}

.pic-button:has(> .note-sub-title) {
 width: 100%;
 display: flex;
 justify-content: space-between;
}
</style>
