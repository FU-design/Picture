import antfu from '@antfu/eslint-config'

// https://github.com/antfu/eslint-config
export default antfu({
  rules: {
    'no-debugger': 'off',
    'ts/no-this-alias': 'off', // 可在 ts 中使用 this 关键字
  },
})
