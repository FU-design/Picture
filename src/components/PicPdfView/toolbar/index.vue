<script setup lang="ts">
import type { PDFDocumentProxy } from 'pdfjs-dist'
import Finder from './finder.vue'
import Pagination from './pagination.vue'

const pdfDoc = inject('pdfDoc') as Ref<PDFDocumentProxy>

function download() {
  console.warn('download')
}

onMounted(() => {
  console.warn('pdfDoc', pdfDoc.value)
})
</script>

<template>
  <div class="toolbar">
    <div class="toolbarContainer">
      <div id="toolbarViewer" class="toolbarHorizontalGroup">
        <div id="toolbarViewerLeft" class="toolbarHorizontalGroup">
          <Finder />
          <Pagination />
        </div>

        <div class="toolbarViewerRight toolbarHorizontalGroup">
          <button id="printButton" type="button" class="toolbarButton" @click="download" />
          <button id="downloadButton" type="button" class="toolbarButton" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
