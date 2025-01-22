import { ref } from 'vue'

export interface NoteType { title: string, tag: string, md: () => Promise<string> }

// get all notes data
export function useNotes() {
  const notes = ref<NoteType[]>([])

  const setupNotes = () => {
    const modules = import.meta.glob('../notes/**/*.md', { query: '?raw' })
    notes.value = Object.keys(modules).reduce((acc, path) => {
      const parts = path.split('/')
      const fileName = parts.pop()!.replace('.md', '')
      const dirName = parts[parts.length - 1]
      acc.push({
        title: fileName,
        tag: dirName,
        md: modules[path] as () => Promise<string>,
      })
      return acc
    }, [] as NoteType[])
  }

  return {
    notes,
    setupNotes,
  }
}
