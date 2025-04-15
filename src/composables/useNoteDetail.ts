import PicMd from '@/components/pic-md/pic-md.vue'
import PicView from '@/components/pic-view/pic-view.vue'
import { useNotes } from '@/composables/useNotes'
import { h, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'NoteDetail',
  setup() {
    const route = useRoute()
    const { notes, setupNotes } = useNotes()
    const { title } = route.params
    const mdContent = ref('')

    onMounted(async () => {
      setupNotes()
      const res = await notes.value[title as string].md()
      mdContent.value = res.default
    })
    return () =>
      h(PicView, {}, () =>
        h(PicMd, { markRaw: mdContent.value }))
  },
}
