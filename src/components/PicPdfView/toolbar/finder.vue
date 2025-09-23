<script setup lang="ts">

</script>

<template>
  <div class="toolbarHorizontalGroup">
    <!-- 查找按钮 -->
    <button id="viewFindButton" type="button" class="toolbarButton"/>

    <!-- 查找（1 || more） -->
    <div v-if="false" id="findbar" class="hidden doorHanger toolbarHorizontalGroup">
      <div id="findInputContainer" class="toolbarHorizontalGroup">
        <!-- 附带 loading 的输入表单控件 -->
        <span class="loadingInput end toolbarHorizontalGroup">
          <input id="findInput" class="toolbarField">
        </span>

        <!-- 跳到上一个匹配点 -->
        <div class="toolbarHorizontalGroup">
          <button id="findPreviousButton" class="toolbarButton">
            <span />
          </button>
          <!-- 跳到下一个匹配点 -->
          <div class="splitToolbarButtonSeparator" />
          <button id="findNextButton" class="toolbarButton">
            <span />
          </button>
        </div>
      </div>

      <!-- 查找条件 & 高亮查找内容的选项 -->
      <div id="findbarOptionsOneContainer" class="toolbarHorizontalGroup">
        <!-- 高亮查找内容 -->
        <div class="toggleButton toolbarLabel">
          <input id="findHighlightAll" type="checkbox">
          <label for="findHighlightAll" />
        </div>
        <!-- 匹配大小写-查找条件 -->
        <div class="toggleButton toolbarLabel">
          <input id="findMatchCase" type="checkbox">
          <label for="findMatchCase" />
        </div>
      </div>
      <div id="findbarOptionsTwoContainer" class="toolbarHorizontalGroup">
        <!-- 查找匹配的变量 -->
        <div class="toggleButton toolbarLabel">
          <input id="findMatchDiacritics" type="checkbox">
          <label for="findMatchDiacritics" />
        </div>

        <!-- whole worlds（精准查询） -->
        <div class="toggleButton toolbarLabel">
          <input id="findEntireWord" type="checkbox">
          <label for="findEntireWord" />
        </div>
      </div>

      <!-- 查找结果和信息提示 -->
      <div id="findbarMessageContainer" class="toolbarHorizontalGroup" a>
        <span id="findResultsCount" class="toolbarLabel" />
        <span id="findMsg" class="toolbarLabel" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
