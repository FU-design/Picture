export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // 添加css前缀
    ...(import.meta.env.mode === 'production' ? { cssnano: {} } : {}), // 压缩 css
  },
}
