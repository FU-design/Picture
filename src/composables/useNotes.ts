import NoteDetail from '@/components/hoc/noteDetail'
import noteMeta from '@/records/note-meta.json'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export interface NoteData { 'Path': string, 'Tag': string, 'File Name': string, 'Created At': string, 'Updated At': string }

export type NoteInfo = Record<string, { content: string, data: NoteData }>

export function useNotes() {
  const router = useRouter()
  const notes = ref<Map<string, NoteData[]>>(new Map())
  const noteMetaJson = computed((): NoteInfo => noteMeta)

  const setupNotes = async () => {
    for (const [title, val] of Object.entries((noteMetaJson.value))) {
      const { Tag: tag } = (val.data)

      notes.value.has(tag) ? notes.value.get(tag)?.push(val.data) : (notes.value.set(tag, [val.data]))

      if (router.hasRoute(title)) {
        router.removeRoute(title)
      }

      // add dynamic Routes about notes
      router.addRoute('Notes', { path: `/notes/${tag}/${title}`, name: title, component: h(NoteDetail, { mdRaw: val.content }) })
    }
  }

  const updateRouterOfNote = async (note: NoteData) => {
    router.push({ path: `/notes/${note.Tag}/${note['File Name']}` })
  }

  return {
    notes,
    setupNotes,
    updateRouterOfNote,
  }
}
