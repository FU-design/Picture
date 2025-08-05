<script setup lang="ts">
const rotuer = useRouter()

function goHome() {
  rotuer.replace({ name: 'Notes' })
}
</script>

<template>
  <div class="not-found">
    <section class="error-404">
      <section class="error-404_text">
        <span v-for="(num, index) in '404'.split('')" :key="index">{{ num }}</span>
      </section>
      <PicButton @click="goHome">
        返回主页
      </PicButton>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.not-found{
  width: 100vw;
  height: 100vh;
  position: relative;
}
.error-404{
  position: absolute;
  top: 30%;
  left: 50%;

  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 24px;
  font-size: 24px;
}

.error-404_text{
  display: flex;
  gap: 20%;
  font-size: 100px;
  justify-content: center;
  & > span{
    text-shadow: -12px 5px 15px #000000;
  }
}
</style>
