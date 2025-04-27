import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
// import updateTimestampPlugin from './src/plugins/plugin-update-times'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('command :>> ', command)
  console.log('mode :>> ', mode)
  return {
    base: '/pic/', // (当使用 github pages部署的时候，需要配置该 base)
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // server: {
    //   host: '0.0.0.0',
    //   port: 86,
    //   hmr: true,
    //   // open: true,
    //   proxy: {
    //     '/api': {
    //       target: 'http://127.0.0.1:86',
    //       changeOrigin: true,
    //       ws: true,
    //       rewrite: path => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
    css: {
    },
  }
})
