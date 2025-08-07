import type { Router } from 'vue-router'
import NoteDetail from '@/components/hoc/noteDetail'
import { notesData } from '@/utils/note-map'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(advancedFormat)
dayjs.extend(updateLocale)

export interface NoteData { 'Path': string, 'Tag': string, 'File Name': string, 'Created At': string, 'Updated At': string }
export type NoteInfo = Record<string, { content: string, data: NoteData }>

export const useDynamicRoutes = defineStore('dynamic-routes', () => {
  const hasLoadedDynamicRoutes = ref(false)
  const noteMap = ref<Record<string, NoteData[]>>({})
  const noteMeta = shallowRef(notesData)

  const getTimeLine = () => {
    const map = new Map()
    Object.values(noteMeta.value).forEach(({ data }) => {
      const updateTime = dayjs(data['Updated At']).format('YYYY-MM-DD HH:mm:ss')
      const timeline = dayjs(updateTime).format('YYYY-MM')

      if (!map.get(timeline)) {
        map.set(timeline, [data])
      }
      else {
        map.get(timeline).push(data)
        // sort by time
        map.set(timeline, map.get(timeline).sort((a: NoteData, b: NoteData) => {
          return dayjs(b['Updated At']).valueOf() - dayjs(a['Updated At']).valueOf()
        }))
      }
    })

    return map
  }

  const setLoadedState = (state: boolean) => {
    hasLoadedDynamicRoutes.value = state
  }

  const setNoteMap = (val: NoteData) => {
    noteMap.value[val.Tag] ? noteMap.value[val.Tag]?.push(val) : noteMap.value[val.Tag] = [val]
  }

  const createNoteDetailComponent = (mdRaw: string) => {
    return defineComponent({
      render() {
        return h(NoteDetail, { mdRaw })
      },
    })
  }

  const setupNotes = async (router: Router) => {
    for (const [title, val] of Object.entries((noteMeta.value))) {
      setNoteMap(val.data)

      if (router.hasRoute(title)) {
        router.removeRoute(title)
      }

      // add dynamic Routes about notes
      router.addRoute('Notes', {
        path: `/notes/${val.data.Tag}/${title}`,
        name: title,
        component: createNoteDetailComponent(val.content),
        props: {
          mdRaw: val.content,
        },
      })
    }
    setLoadedState(true)
  }

  return {
    hasLoadedDynamicRoutes,
    noteMap,
    getTimeLine,
    setLoadedState,
    setNoteMap,
    setupNotes,
  }
})
