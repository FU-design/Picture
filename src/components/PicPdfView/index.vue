<script setup lang="ts">
import SideBar from '@/components/PicPdfView/sidebar/index.vue'
import ToolBar from '@/components/PicPdfView/toolbar/index.vue'

import { usePdfViewer } from '@/components/PicPdfView/usePdfViewer'

const { containerRef, pdfViewerRef } = usePdfViewer('./Mo─O─FeP.pdf')
</script>

<template>
  <div id="outerContainer">
    <SideBar />
    <div id="mainContainer">
      <ToolBar />
      <div id="loadingBar">
        <div class="progress">
          <div class="glimmer" />
        </div>
      </div>
      <div id="viewerContainer" ref="containerRef" :tabindex="0" class="viewerContainer">
        <div id="viewer" ref="pdfViewerRef" class="pdfViewer" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
