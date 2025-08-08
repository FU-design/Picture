<script setup lang="ts">
interface PicBtnProps {
  disabled?: boolean
}
withDefaults(defineProps<PicBtnProps>(), {
  disabled: false,
})
</script>

<template>
  <div class="pic-button">
    <button :disabled="$props.disabled">
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
    border: 1px solid transparent;
    background-color: transparent;
    color: #000;
    cursor: pointer;
    font-size: 14px;
    line-height: 1.5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, box-shadow 0.15s;
    &:hover{
      border-color: #00000050;
      color: #00000080;
    }
  }
}

.pic-button button:disabled{
  color: #00000030;
  cursor: not-allowed;
}
.pic-button button:disabled:hover{
  border-color: #00000030;
  color: #00000030;
}
.pic-button button:disabled:focus-visible{
  outline: none;
  box-shadow: none;
}
.pic-button button:focus-visible{
  outline: 0;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
}
.pic-button button:focus{
  outline: 0;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
}
.pic-button button:focus-visible{
  outline: 0;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: 0 0 0 2px rgba(0, 0 , 0.2);
}
</style>
