<script setup lang="ts">

</script>

<template>
  <div class="pic-button">
    <button>
      <slot />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.pic-button{
  button{
    padding-inline: 8px;
    border-radius: 4px;
    color: #00000090;
    &:hover{
      color: #000;
    }
  }
}
</style>
