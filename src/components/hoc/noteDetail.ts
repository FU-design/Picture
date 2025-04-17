import PicMd from '@/components/PicMd/index.vue'
import PicView from '@/components/PicView/index.vue'
import { useNotes } from '@/composables/useNotes'
import { defineComponent, h, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
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
},

)
