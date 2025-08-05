export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {}, // 添加css前缀
    'postcss-pxtorem': { // 使用 PostCSS 自动将 px 转为 rem
      rootValue: 16,
      propList: ['*'],
      exclude: /node_modules/i,
      selectorBlackList: [],
      minPixelValue: 1,
    },
  },
}
