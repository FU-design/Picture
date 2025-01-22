import { ref } from 'vue'

interface UrlConfig {
  url: string
  title: string
  icon: string
}

export function useSources() {
  const sources = ref<UrlConfig[]>([])

  return {
    sources,
  }
}
