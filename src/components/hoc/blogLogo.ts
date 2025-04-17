import Logo from '@/assets/logo.png'
import { defineComponent, h } from 'vue'
import '@/styles/logo.css'

export default defineComponent({
  name: 'BlogLogo',
  setup() {
    return () => h('div', { class: 'blog-logo' }, [h('img', { src: Logo })])
  },
})
