import type { PageViewport, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'
import 'pdfjs-dist/web/pdf_viewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

export function usePdfViewer(url: string) {
  const pdfDoc = shallowRef<PDFDocumentProxy>()
  const containerRef = ref<HTMLDivElement | null>(null)
  const pdfViewerRef = ref<HTMLDivElement | null>(null)
  const scale = ref<number>(1.5)

  const createPageItem = async (viewport: PageViewport) => {
    // 获取设备像素比
    const outputScale = window.devicePixelRatio || 1
    const canvas = document.createElement('canvas')

    canvas.width = viewport.width * outputScale
    canvas.height = viewport.height * outputScale

    canvas.style.width = `${viewport.width}px`
    canvas.style.height = `${viewport.height}px`

    const canvasWrapper = document.createElement('div')
    canvasWrapper.classList.add('canvasWrapper')

    const pageDiv = document.createElement('div')
    pageDiv.classList.add('page')

    canvasWrapper.appendChild(canvas)
    pageDiv.appendChild(canvasWrapper)

    return {
      pageDiv,
      canvas,
      canvasWrapper,
      outputScale,
    }
  }

  const renderTextLayer = async (page: PDFPageProxy, viewport: PageViewport) => {
    const textLayerDiv = document.createElement('div')
    textLayerDiv.classList.add('textLayer')

    const textContent = await page.getTextContent()
    const textLayer = new pdfjsLib.TextLayer({
      textContentSource: textContent,
      viewport,
      container: textLayerDiv,
    })

    await textLayer.render()

    return textLayerDiv
  }

  /**
   * 渲染单页
   * @param pageNumber
   */
  const renderPage = async (pageNumber: number) => {
    const page = await pdfDoc.value!.getPage(pageNumber)
    const viewport = page.getViewport({ scale: scale.value })

    const { pageDiv, canvas, outputScale } = await createPageItem(viewport)
    const canvasContext = canvas.getContext('2d')!
    const transform = [outputScale, 0, 0, outputScale, 0, 0]
    await page.render({ canvas, canvasContext, viewport, transform }).promise

    const textLayerDiv = await renderTextLayer(page, viewport)

    pageDiv.appendChild(textLayerDiv)
    pdfViewerRef.value?.appendChild(pageDiv)

    // 这里需要重新设置 --scale-factor 的值，确保文本层的位置是对的（此css变量存在于引入的 pdf_viewer.css文件中）
    pdfViewerRef.value?.style.setProperty('--scale-factor', scale.value.toString())
  }

  /**
   * 渲染全部页
   */
  const renderPDF = async () => {
    for (let i = 1; i <= (pdfDoc.value?.numPages ?? 0); i++) {
      await renderPage(i)
    }
  }

  const setupTestPagination = async () => {
    pdfDoc.value = await pdfjsLib.getDocument(url).promise
    if (pdfDoc.value) {
      await renderPDF()
    }
  }

  onMounted(async () => {
    await setupTestPagination()
  })

  return { containerRef, pdfViewerRef }
}
