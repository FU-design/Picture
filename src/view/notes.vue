<script setup lang="ts">
import { type NoteData, useDynamicRoutes } from '@/stores/dynamic-routes'
import dayjs from 'dayjs'
import { onMounted } from 'vue'

const router = useRouter()
const timelines = shallowRef<Map<string, NoteData[]>>(new Map())
const dynamicRoutesStore = useDynamicRoutes()

function updateRouterOfNote(note: NoteData) {
  router.push({ path: `/notes/${note.Tag}/${note['File Name']}` })
}

function openNote(note: NoteData) {
  updateRouterOfNote(note)
}

onMounted(() => {
  timelines.value = dynamicRoutesStore.getTimeLine()
})
</script>

<template>
  <PicView>
    <div class="time-line">
      <template v-for="[timeline, val] of timelines" :key="timeline">
        <header>
          <h1>
            <i>
              {{ dayjs(timeline).format('MMMM') }}
            </i>
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
                  <i>{{ dayjs(data['Updated At']).format('DD-HH:mm') }}</i>
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
