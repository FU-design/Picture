import { useTypeWriter } from '@/composables/useTypeWriter'
import { defineComponent, h, onMounted } from 'vue'
import '@/styles/type-writer.css'

const typeWriterProps = {
  fullText: {
    type: String,
    default: '',
  },
} as const

export default defineComponent({
  name: 'TypeWriter',
  props: typeWriterProps,
  setup(this, props) {
    const { textRef, startWriter } = useTypeWriter(props.fullText)
    onMounted(() => {
      startWriter()
    })
    return () => h('div', { class: 'typewriter-container' }, [h('span', { ref: textRef, class: 'text' })])
  },
})
