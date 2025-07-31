import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, type PluginOption } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('command :>> ', command)
  console.log('mode :>> ', mode)
  return {
    base: '/Picture/', // (当使用 github pages部署的时候，需要配置该 base: '/<仓库>/')
    plugins: [
      visualizer() as PluginOption,
      vue(),
      AutoImport({
        imports: ['vue', 'pinia', 'vue-router'],
        resolvers: [AntDesignVueResolver()],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // v4.x 不在使用 import 'ant-design-vue/es/form/style/css'
            resolveIcons: true,
          }),
        ],
        dts: 'src/types/components.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            console.info(id)
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },

      },
    },
    server: {
      host: '0.0.0.0',
      port: 86, // 项目启动时的自定义端口
      hmr: true, // 开启热更新,更改代码后自动更新页面
      open: true, // 项目启动时，自动在浏览器中打开应用程序（也可以在package.json中的 “script” 选项中配置）
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:86',
          changeOrigin: true,
          ws: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
    },
  }
})
