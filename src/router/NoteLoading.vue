<script setup lang="ts">
import { useDynamicRoutes } from '@/stores/dynamic-routes'

const route = useRoute()
const router = useRouter()
const dynamicRoutesStore = useDynamicRoutes()
const dotCounts = ref(0)
const timerId = ref<NodeJS.Timeout | null>(null)

function routeParamsMatchedError() {
  router.replace({ name: 'NotFound' })
  dynamicRoutesStore.setLoadedState(false)
}

function checkDynamicRoutes() {
// 判断是否已加载了动态路由，若未加载，则重新加载，并通过路由参数匹配当前动态路由页面。
  if (!dynamicRoutesStore.hasLoadedDynamicRoutes) {
    dynamicRoutesStore.setupNotes(router)
    const params = route.params
    router.replace({ path: `/notes/${params.tag}/${params.filename}` })
  }

  // 判断路由参数是否正确，若不正确则跳转到 404 页面
  const { tag, filename } = route.params
  const tagList = dynamicRoutesStore.noteMap[`${tag}`]

  if (!tagList) {
    routeParamsMatchedError()
    return
  }

  const hasFilename = tagList.filter(v => v['File Name'] === filename).length > 0
  if (!hasFilename) {
    routeParamsMatchedError()
  }
}

function triggerDotCounts() {
  const el = document.querySelector('.loading-dot') as HTMLElement
  const frames = ['.', '. .', '. . .', '. . . .', '. . . . .']
  let frameIndex = 0
  let lastTime = performance.now()

  function loop(now: any) {
    if (now - lastTime >= 500) {
      el.textContent = frames[frameIndex]
      frameIndex = (frameIndex + 1) % frames.length
      lastTime = now
    }
    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

onBeforeUnmount(() => {
  timerId.value && clearInterval(timerId.value)
})

onMounted(() => {
  checkDynamicRoutes()
  triggerDotCounts()
})
</script>

<template>
  <div class="note-loading">
    <section class="loading_text">
      <div v-for="(num, index) in 'Loading'.split('')" :key="index">
        {{ num }}
      </div>
      <div class="loading-dot">
        <div v-for="i in dotCounts" :key="i" class="dot" :style="{ animationDelay: `${i * 0.2}s` }" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.note-loading{
  width: 100vw;
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 30vh;

  .loading_text{
    display: flex;
    gap: 40px;
    font-size: 60px;
    justify-content: center;
      & > span{
        text-shadow: -12px 5px 15px #000000;
    }
  }

  .loading-dot{
    display: flex;
    gap: 50px;
    align-items: flex-end;
    & > span{
      transition: all 0.5s;
      animation: bounce 1s infinite;
    }
  }
}

.dot{
  width: 8px;
  height: 8px;
  padding: 8px;
  background-color: #000000;
  border-radius: 9999px;

  display: flex;
  flex-direction: column-reverse;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}
</style>
