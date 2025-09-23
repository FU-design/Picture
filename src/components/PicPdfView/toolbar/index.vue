<script setup lang="ts">
import Finder from './finder.vue'
import Pagination from './pagination.vue'
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
          <button id="printButton" type="button" class="toolbarButton" />
          <button id="downloadButton" type="button" class="toolbarButton" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
