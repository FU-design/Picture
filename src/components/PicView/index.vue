<script lang="ts" setup>

</script>

<template>
  <div class="pic-view">
    <slot />
  </div>
</template>

<style scoped>
.pic-view {
  margin: 0 auto;
  width: 100%;
  max-width: 72ch;
}

/* 手机端：窄屏留白 */
@media (max-width: 640px) {
  .pic-view {
    max-width: 95%;
  }
}

/* 平板端 */
@media (min-width: 641px) and (max-width: 768px) {
  .pic-view {
    max-width: 90%;
  }
}

/* 小型桌面端 */
@media (min-width: 769px) and (max-width: 1024px) {
  .pic-view {
    max-width: 700px;
  }
}

/* 大型桌面端 */
@media (min-width: 1025px) and (max-width: 1280px) {
  .pic-view {
    max-width: 720px;
  }
}

/* 超大屏幕 */
@media (min-width: 1280px) {
  .pic-view {
    max-width: 90ch; /* 使用字符宽度确保舒适阅读 */
  }
}

/* 更大屏幕：2K */
@media (min-width: 1536px) {
 .pic-view {
    max-width: 120ch;
  }
}

/* 2.5K - 宽屏段落 */
@media (min-width: 1920px) {
 .pic-view {
    max-width: 130ch;
  }
}

/* 超宽屏段落：4K */
@media (min-width: 2560px) {
 .pic-view {
    max-width: 140ch;
  }
}

/* 真·超宽段落：3840px+ 可考虑多列或锁定宽度 */
@media (min-width: 3840px) {
 .pic-view {
    max-width: 150ch;
  }
}
</style>
