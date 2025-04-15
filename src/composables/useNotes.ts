import PicMd from '@/components/pic-md/pic-md.vue'
import PicView from '@/components/pic-view/pic-view.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export interface NoteType { title: string, tag: string, md: () => Promise<{ default: string }> }

// get all notes data
export function useNotes() {
  const router = useRouter()
  const notes = ref<NoteType[]>([])
  const notesModules = computed(() => import.meta.glob('../notes/**/*.md', { query: '?raw' }))

  const createNoteItem = (payload: NoteType) => {
    return {
      title: payload.title,
      tag: payload.tag,
      md: payload.md,
    }
  }

  const setupNotes = () => {
    notes.value = Object.keys(notesModules.value).reduce((acc, path) => {
      const parts = path.split('/')
      const fileName = parts.pop()!.replace('.md', '')
      const dirName = parts[parts.length - 1]
      const newNote = createNoteItem({ title: fileName, tag: dirName, md: notesModules.value[path] as () => Promise<{ default: string }> })
      acc.push(newNote)
      return acc
    }, [] as NoteType[])
  }

  const updateRouterOfNote = async (note: NoteType) => {
    const markedContent = await note.md()
    console.error('markedContent :>> ', markedContent)
    if (!router.hasRoute(`/notes/${note.tag}/${note.title}`)) {
      router.addRoute({ path: `/notes/${note.tag}/${note.title}`, component: PicView })
    }
    router.push({ path: `/notes/${note.tag}/${note.title}` })
  }

  return {
    notes,
    setupNotes,
    updateRouterOfNote,
  }
}
