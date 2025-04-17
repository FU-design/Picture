import { reactive, ref } from 'vue'

export function useTypeWriter(fullText: string, charsPerSecond = 10) {
  const textContent = ref(fullText)
  const textRef = ref<HTMLElement>()
  const writerState = reactive({
    textPos: 0,
    charsPerSecond,
    lastTime: 0,
  })

  const typeWriter = (timestamp = 0) => {
    // stop animation by cancelAnimationFrame api or condition
    if (!textRef.value) {
      return
    }
    const delta = timestamp - writerState.lastTime
    if (delta >= 1000 / writerState.charsPerSecond) {
      textRef.value!.textContent = textContent.value.substring(0, writerState.textPos + 1)
      writerState.textPos++
      writerState.lastTime = timestamp
      if (writerState.textPos >= textContent.value.length)
        return
    }
    requestAnimationFrame(typeWriter)
  }

  const startWriter = () => {
    requestAnimationFrame(typeWriter)
  }

  return {
    textRef,
    startWriter,
  }
}
