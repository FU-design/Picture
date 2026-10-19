import { defineComponent, h } from 'vue'
import PicMd from '@/components/PicMd/index.vue'
import PicView from '@/components/PicView/index.vue'

export default defineComponent({
  name: 'NoteDetail',
  props: ['mdRaw'],
  setup(props: { mdRaw: string }) {
    return () =>
      h(PicView, {}, () =>
        h(PicMd, { markRaw: props.mdRaw }))
  },
},
)
