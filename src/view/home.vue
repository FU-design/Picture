<script setup lang="ts">
import TypeWriter from '@/components/hoc/typeWriter'
import { ref } from 'vue'

const textContent = ref('Welcome Fdefined\'s world !')
</script>

<template>
  <div class="home">
    <div class="hello-msg">
      <TypeWriter :full-text="textContent" />
    </div>
    <div class="drivier-wrp">
      <div class="drivier" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home{
  padding: 24px;
  height: 100%;
  background-color: #f6f7f8;
  position: relative;
  display: flex;
  flex-direction: column;
}

.drivier-wrp{
  width: 100%;
  height: 2px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #000;
  position: relative;
}

.drivier{
  position: absolute;
  height: 100%;
  width: 100%;
  background: linear-gradient(70deg, #000, #fff,#000);
  animation: drivier 1.6s infinite linear;
}

@keyframes drivier {
  0% {transform: translateX(-100%)}
  50% { transform: translateX(50%); }
  100% { transform: translateX(100%); }
}
</style>
