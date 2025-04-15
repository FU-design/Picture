import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export interface NoteType { title: string, tag: string, md: () => Promise<{ default: string }> }

// get all notes data
export function useNotes() {
  const router = useRouter()
  const notes = ref<Record<string, NoteType>>({})
  const notesModules = computed(() => import.meta.glob('../notes/**/*.md', { query: '?raw' }))

  const createNoteItemByNotesModules = (path: string) => {
    const parts = path.split('/')
    const fileName = parts.pop()!.replace('.md', '')
    const dirName = parts[parts.length - 1]
    return {
      title: fileName,
      tag: dirName,
      md: notesModules.value[path] as () => Promise<{ default: string }>,
    }
  }

  const setupNotes = () => {
    notes.value = Object.keys(notesModules.value).reduce((acc, path) => {
      const newNoteItem = createNoteItemByNotesModules(path)
      Object.assign(acc, { [`${newNoteItem.title}`]: newNoteItem })
      return acc
    }, {} as Record<string, NoteType>)
  }

  const updateRouterOfNote = async (note: NoteType) => {
    router.push({ path: `/notes/${note.tag}/${note.title}` })
  }

  return {
    notes,
    setupNotes,
    updateRouterOfNote,
  }
}
