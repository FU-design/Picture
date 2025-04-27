import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
// import updateTimestampPlugin from './src/plugins/plugin-update-times'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('command :>> ', command)
  console.log('mode :>> ', mode)
  return {
    base: '/Picture/', // (当使用 github pages部署的时候，需要配置该 base: '/<仓库>/')
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
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
