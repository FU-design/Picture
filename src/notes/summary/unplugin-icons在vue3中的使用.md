---
Created At: 8/14/2025, 2:40:41 PM
Updated At: 8/14/2025, 3:31:19 PM
File Name: unplugin-icons在vue3中的使用
---

# unplugin-icons 在vue3中的使用

[unplugin-icons](https://github.com/unplugin/unplugin-icons/tree/main) 的前身是
`vite-plugin-icons` 。作用是按需访问图标组件，可以将图标作为组件应用到页面中，这里主要讲在 `vue3` 中的如何处理并使用本地的 svg。

## 准备工作

搭建环境：`Node.js` + `pnpm` + `Vite` + `Vue3` + `Typescript`

安装 `unplugin-icons`

```bash
pnpm add -D unplugin-icons
```

## 在 `Vite` 的配置文件中引入

```ts
// vite.config.ts
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    Icons({ /* options */ }),
  ],
})
```
这里官网也有相应的配置 [demo](https://github.com/unplugin/unplugin-icons/blob/main/examples/vite-vue3/vite.config.ts),略。

## 在 `vite.config.ts` 中配置 `Icons` 相关选项

### 基础配置

```ts
// vite.config.ts

// loader helpers
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    Icons({
      compiler: 'vue3', // 转化组件类型
      customCollections: {
        // 自定义图标集合，其中 `svg` 是该集合的标识，集合的标识是可以自己定义的。
        svg: FileSystemIconLoader('src/assets/svg'), // 辅助加载该路径下所有的 svg 文件。
      },
    }),
  ],
})
```

### 按需引入

安装 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 插件

```bash
pnpm add -D unplugin-vue-components
```

配置 `unplugin-icons` 的处理函数

```ts
// vite.config.ts

import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        IconsResolver({
          customCollections: [
            'svg', // 注意这里要和 Icons 中 customCollections 的 key 对应上
          ],
        }),
      ],
      dts: 'src/types/components.d.ts', // Components 自身的配置项
    }),
  ],
})
```

通过以上的配置就可以直接在 `.vue` 文件中直接使用了，无需在导入，且可直接使用 svg 标签的属性

```html
  <template>
    <i-svg-code width="1em" height="1em" />
  </template>
```

为什么是 `i-svg-code` 呢，可以点击 `IconsResolver`，会直接跳转到该配置的类型声明文件 `resolver.d.ts`。

```ts
interface ComponentResolverOption {
  /**
   * Prefix for resolving components name.
   * Set '' to disable prefix.
   *
   * @default 'i'
   */
  prefix?: string | false
  /**
   * Iconify collection names to that enable for resolving.
   *
   * @default [all collections]
   */
  enabledCollections?: string | string[]
  /**
   * Icon collections aliases.
   *
   * The `aliases` keys are the `alias` and the values are the `name` for the collection.
   *
   * Instead using `<i-icon-park-abnormal />` we can use `<i-park-abnormal />` configuring:
   * `alias: { park: 'icon-park' }`
   */
  alias?: Record<string, string>
  // ...
}
```

可以看到组件的前缀为 `i` 是默认的，而且当 `prefix` 设置为 `''` 之后就没有前缀了。

```ts
// vite.config.ts

import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        IconsResolver({
          prefix: '',
        // ...else options
        }),
      ],
    }),
  ],
})
```

加上之后，在使用的时候就可以直接 `<svg-code>` 了，`svg-` 后面接着的是 svg 图片的名字。
