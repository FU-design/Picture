1. 安装 `piniaPluginPersistedstate`

   ```cmd
   pnpm install pinia-plugin-persistedstate
   ```

2. 在`main.ts` 引入 `piniaPluginPersistedstate`

   ```ts
   import { createPinia } from 'pinia'
   // pinia 持久化插件引入
   import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
   const pinia = createPinia()
   pinia.use(piniaPluginPersistedstate)

   app.use(pinia)
   app.mount('#app')
   ```

3. 在 `store` 中使用`persist` 为配置项

   ```ts
   import { defineStore } from 'pinia'
   import { ref } from 'vue'

   // options store
   // export default defineStore("side", {
   //   state: () => ({ fold: true }),
   //   getters: {},
   //   actions: {
   //     setSideFoldState(state: boolean) {
   //       this.fold = state;
   //     },
   //   },
   // persist: {
   // ...配置
   // },
   // });

   // setup store
   export default defineStore(
     'aside',
     () => {
       const fold = ref(false)

       function setSideFoldState(state: boolean) {
         fold.value = state
       }

       return { fold, setSideFoldState }
     },
     // 持久化配置
     {
       persist: {
         key: 'aside', // 指定需要持久化变量
         storage: sessionStorage // 指定存储位置
       }
     }
   )
   ```

4. [具体细节见官方文档](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/)
