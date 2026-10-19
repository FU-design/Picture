// Prettier 选项类型：让编辑器提示可配置项，并在类型检查时发现无效值。
import type { PrettierOptions } from 'eslint-plugin-format/rule-options'
// antfu 的 ESLint 预设配置。
import antfu from '@antfu/eslint-config'
// ESLint 格式化插件；该插件依赖 Prettier，并提供 format/prettier 规则。
import format from 'eslint-plugin-format'

// CSS 文件使用 Prettier 时的选项。
const cssPrettierOptions = {
  // 告诉 Prettier 按 CSS 语法解析。
  parser: 'css',
} satisfies Omit<PrettierOptions, 'parser'> & { parser: 'css' }

// https://github.com/antfu/eslint-config
export default antfu({
  rules: {
    // 不把 debugger 语句作为 ESLint 错误报告。
    'no-debugger': 'off',
    // 允许在 TypeScript 中使用 this 别名。
    'ts/no-this-alias': 'off',
    // 不检查字符串中是否包含未插值的模板字符串语法。
    'no-template-curly-in-string': 'off',
  },
}, {
  // 以下配置只应用于 CSS 文件。
  files: ['**/*.css'],
  languageOptions: {
    // 使用纯文本解析器，让格式插件接管 CSS 文本。
    parser: format.parserPlain,
  },
  plugins: {
    // 注册格式化插件，使其 format/* 规则可用。
    format,
  },
  rules: {
    // 用 Prettier 检查并自动修复 CSS 格式问题。
    'format/prettier': ['error', cssPrettierOptions],
  },
})
