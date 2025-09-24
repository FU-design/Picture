import type { PDFDocumentProxy } from 'pdfjs-dist'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'
import {
  EventBus,
  PDFFindController,
  PDFLinkService,
  PDFSinglePageViewer, // 单页
  PDFViewer,
} from 'pdfjs-dist/web/pdf_viewer.mjs'
import 'pdfjs-dist/web/pdf_viewer.css'
import '@/styles/viewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

export function usePdfViewer(url: string) {
  const pdfDoc = shallowRef<PDFDocumentProxy>()
  const containerRef = ref<HTMLDivElement | null>(null)
  const pdfViewerRef = ref<HTMLDivElement | null>(null)
  const SEARCH_FOR = ref<string>('Liu')

  /**
   * 初始化PDF查看器
   */
  const setupPDFViewer = async () => {
    pdfDoc.value = await pdfjsLib.getDocument(url).promise

    const eventBus = new EventBus()
    const pdfLinkService = new PDFLinkService({ eventBus })
    const pdfFindController = new PDFFindController({ eventBus, linkService: pdfLinkService })

    const pdfViewer = new PDFViewer({
      container: containerRef.value!,
      viewer: pdfViewerRef.value!,
      eventBus,
      textLayerMode: 1,
      linkService: pdfLinkService,
      findController: pdfFindController,
      enableAutoLinking: true,
    })

    pdfLinkService.setViewer(pdfViewer)
    pdfViewer.setDocument(pdfDoc.value!)
    pdfLinkService.setDocument(pdfDoc.value!, null)

    eventBus.on('pagesinit', () => {
      // `0` | NONE：不使用对开布局，单页排列
      // `1` | ODD：对开模式，从第一页开始显示单页，后续双页排列（第一页在右侧）
      // `2` | EVEN：对开模式，从第一页开始显示双页，第一页在左侧
      // pdfViewer.spreadMode = SpreadMode.ODD
      // pdfViewer.update()

      // 设置缩放模式
      pdfViewer.currentScaleValue = 'page-width'
      if (SEARCH_FOR.value) {
        eventBus.dispatch('find', { type: '', query: SEARCH_FOR.value })
      }
    })
  }

  onMounted(async () => {
    await setupPDFViewer()
  })

  return { containerRef, pdfViewerRef, pdfDoc }
}
