import { reactive, ref } from 'vue'

export function useMoveBox() {
  const lb = ref<HTMLElement>()
  const rb = ref<HTMLElement>()
  const offsets = reactive({
    initMouseX: 0,
    initLw: 0,
    initRw: 0,
  })

  function onMousedown(e: MouseEvent) {
    e.stopPropagation()
    offsets.initMouseX = e.clientX // 记录初始的鼠标相对于可视窗口的位置

    // 记录dom的初始宽度（不包含外边距）
    offsets.initLw = lb.value!.offsetWidth ?? 0
    offsets.initRw = rb.value!.offsetWidth ?? 0

    document.onselectstart = () => false// 禁止用户选择网页中文字
    document.addEventListener('mousemove', onMouseMove, true)
    document.addEventListener('mouseup', onMouseUp, true)
  }

  function onMouseMove(e: MouseEvent) {
    e.stopPropagation()

    const moveSize = e.clientX - offsets.initMouseX // 计算鼠标的偏移量

    // 计算被影响dom的新宽度
    const updatedLw = offsets.initLw + moveSize
    const UpdatedRw = offsets.initRw - moveSize

    // 被移动变化后的dom的最小宽度
    if (updatedLw < 480 || UpdatedRw < 480) {
      return
    }

    // 更新左右两边dom的变化后的宽度
    lb.value!.style.width = `${updatedLw}px`
    rb.value!.style.width = `${UpdatedRw}px`
  }

  function onMouseUp(e: MouseEvent) {
    e.stopPropagation()
    document.removeEventListener('mousemove', onMouseMove, true)
    document.removeEventListener('mouseup', onMouseUp, true)
    document.onselectstart = () => true // 恢复用户对网页文字的默认操作
    // 重置移动信息的缓存
    Object.assign(offsets, {
      initMouseX: 0,
      initLw: 0,
      initRw: 0,
    })
  }

  return {
    onMousedown,
  }
}
