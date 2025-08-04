<script setup lang="ts">
import { type NoteData, useNotes } from '@/composables/useNotes'
import noteMeta from '@/records/note-meta.json'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import { onMounted } from 'vue'

dayjs.extend(advancedFormat)
dayjs.extend(updateLocale)

const { setupNotes, updateRouterOfNote } = useNotes()

const timelines = shallowRef<Map<string, NoteData[]>>(new Map())

async function openNote(note: NoteData) {
  updateRouterOfNote(note)
}

function generateTimeLine() {
  const map = new Map()
  Object.values(noteMeta).forEach(({ data }) => {
    const updateTime = dayjs(data['Updated At']).format('YYYY-MM-DD HH:mm:ss')
    const timeline = dayjs(updateTime).format('YYYY-MM-DD')

    if (!map.get(timeline)) {
      map.set(timeline, [data])
    }

    else if (dayjs(timeline).isSame(dayjs(updateTime), 'day')) {
      map.get(timeline).push(data)
    }
  })
  return map
}

onMounted(async () => {
  await setupNotes()
  timelines.value = generateTimeLine()
})
</script>

<template>
  <PicView>
    <div class="time-line">
      <template v-for="[timeline, val] of timelines" :key="timeline">
        <header>
          <h1>
            <span>
              {{ dayjs(timeline).format('MMMM') }}
            </span>
            <span>
              {{ dayjs(timeline).format('YYYY') }}
            </span>
          </h1>
          <span class="line" />
        </header>
        <div style="padding-left: 10px;">
          <template v-for="data of val" :key="data">
            <section class="note-item-wrp">
              <div class="note-item">
                <section class="note-title" @click="openNote(data)">
                  <span> {{ data['File Name'] }}</span>
                  <i>{{ dayjs(data['Updated At']).format('HH:mm:ss') }}</i>
                </section>
              </div>
            </section>
          </template>
        </div>
      </template>
    </div>
  </PicView>
</template>

<style lang="scss" scoped>
.note-item-wrp{
  padding-left: 16px;
  border-left: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  border-style: solid;
}

.time-line{
  display: flex;
  flex-direction: column;
  gap: 14px;
  h1{
    display: flex;
    gap: 8px;
    :last-child{
      color: rgba(0, 0, 0, 0.3);
    }
  }
  header{
    display: flex;
    align-items: center;
    gap: 16px;
    .line{
      height: 1px;
      background-color: rgba(0, 0, 0, 0.1);
      flex: 1;
    }
  }
}

.note-item{
  width: 100%;
  padding: 6px;
  color: rgba(0, 0, 0, 0.6);
  &:hover{
    cursor: pointer;
    transition: all 0.5s;
    color: var(--color-primary-500);
  }
}

.note-title{
  display: flex;
  justify-content: space-between;
  cursor: inherit;
  i{
    color: rgba(0, 0, 0, 0.3);
  }
}
</style>
