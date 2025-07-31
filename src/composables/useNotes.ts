import NoteDetail from '@/components/hoc/noteDetail'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export interface NoteType { title: string, tag: string, md?: () => Promise<{ default: string }> }

// get all notes data
export function useNotes() {
  const router = useRouter()
  const notes = ref<Map<string, NoteType[]>>(new Map())
  const notesModules = computed(() => import.meta.glob('../notes/**/*.md', { query: '?raw' }))
  const notePaths = computed(() => Object.keys(notesModules.value))

  const generateNoteConfig = (path: string): NoteType => {
    const parts = path.split('/')
    const fileName = parts.pop()!.replace('.md', '')
    const dirName = parts[parts.length - 1]

    return {
      title: fileName,
      tag: dirName,
    }
  }

  const setupNotes = async () => {
    for (const path of notePaths.value) {
      const { tag, title } = generateNoteConfig(path)

      const { default: mdRaw } = await (notesModules.value[path] as () => Promise<{ default: string }>)()

      notes.value.has(tag) ? (notes.value.get(tag)?.push({ tag, title })) : (notes.value.set(tag, [{ tag, title }]))

      // update md content real time
      if (router.hasRoute(title)) {
        router.removeRoute(title)
      }

      // add dynamic Routes about notes
      router.addRoute('Notes', { path: `/notes/${tag}/${title}`, name: title, component: h(NoteDetail, { mdRaw }) })
    }
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
