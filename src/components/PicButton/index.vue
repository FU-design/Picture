<script setup lang="ts">
interface PicBtnProps {
  border?: boolean
}
withDefaults(defineProps<PicBtnProps>(), {
  border: false,
})
</script>

<template>
  <div class="pic-button">
    <button :class="{ 'is-border': $props.border }">
      <slot />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.pic-button{
  display: inline;
  button{
    padding-inline: 8px;
    border-radius: 4px;
    color: #00000090;
    &:hover{
      color: #000;
    }
  }
}

.is-border{
  border: 1px solid #00000090;
  &:hover{
    border-color: #000;
  }
}
</style>
