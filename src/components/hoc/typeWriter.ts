import { useTypeWriter } from '@/composables/useTypeWriter'
import { defineComponent, h, onMounted } from 'vue'
import '@/styles/type-writer.css'

export default defineComponent({
  name: 'TypeWriter',
  props: {
    fullText: {
      type: String,
      default: '',
    },
  },
  setup(this, props) {
    const { textRef, startWriter } = useTypeWriter(props.fullText)
    onMounted(() => {
      startWriter()
    })
    return () => h('div', { class: 'typewriter-container' }, [h('span', { ref: textRef, class: 'text' }), h('span', { class: 'cursor' })])
  },
})
