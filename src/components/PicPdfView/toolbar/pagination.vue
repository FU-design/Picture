<script setup lang="ts">

</script>

<template>
    <div class="toolbarHorizontalGroup">
      <button id="previous" class="toolbarButton" type="button"/>
      <button id="next" class="toolbarButton" type="button" />
      <span class="loadingInput start toolbarHorizontalGroup">
        <input id="pageNumber" type="number" class="toolbarField" value="1" min="1"  autocomplete="off">
      </span>
      <span id="numPages" class="toolbarLabel" />
    </div>
</template>

<style scoped>

</style>
