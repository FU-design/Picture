---
Created At: 2026/10/19 08:39:21
Updated At: 2026/10/19 08:53:40
File Name: eslint 作为唯一代码规范
---

# eslint 作为唯一代码规范

目前常见的配合方式：

- Prettier 负责格式化。
- ESLint 负责代码质量检查和自动修复。
  - 用 `eslint-config-prettier` 关闭 ESLint 中与 Prettier 冲突的格式规则。
- 保存时让 Prettier 格式化，并运行 ESLint 的修复动作

除此之外，若想减少使用工具，可以直接让 ESLint 全权负责

在  `.vscode/setting.json` 中：

```json
{
  // 禁用 Prettier 扩展；不影响 ESLint 插件内部调用 Prettier 规则。
  "prettier.enable": false,
  // 保存文件时调用该语言指定的默认格式化器。
  "editor.formatOnSave": true,
  // 将 ESLint 注册为 VS Code 可用的格式化器。
  "eslint.format.enable": true,
  // 以下语言使用 ESLint 作为 VS Code 的默认格式化器。
  "[javascript]": {
    // JavaScript
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascriptreact]": {
    // JavaScript React (JSX)
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescript]": {
    // TypeScript
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescriptreact]": {
    // TypeScript React (TSX)
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[vue]": {
    // Vue single-file components
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[markdown]": {
    // Markdown
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  // 保存时运行代码操作。
  "editor.codeActionsOnSave": {
    // 仅在显式保存时运行 ESLint 可自动修复的规则。
    "source.fixAll.eslint": "explicit",
    // 不自动整理 import。
    "source.organizeImports": "never"
  },
  // 调整 ESLint 规则在 VS Code 问题面板中的显示方式。
  "eslint.rules.customizations": [
    {
      // 匹配规则 ID 以 format/ 开头的 ESLint 规则。
      "rule": "format/*",
      // 在编辑器问题列表中隐藏匹配规则的诊断；不禁用规则本身。
      "severity": "off",
      // 只对支持自动修复的匹配规则应用此显示设置。
      "fixable": true
    }
  ],
  // 指定 ESLint 扩展要检查的语言；是否能检查还取决于 ESLint 配置和插件支持。
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ],
  // 为 VS Code CSS 语言服务加载项目自定义 CSS 数据（Tailwind 指令说明）。
  "css.customData": [
    "./tailwindcss.json"
  ],
  // 忽略 SCSS 中未知 at-rule 的内置校验提示。
  "scss.lint.unknownAtRules": "ignore",
  // 关闭 VS Code 内置 CSS 校验（CSS 诊断由其他工具提供时可避免重复提示）。
  "css.validate": false,
  // 关闭 VS Code 内置 Less 校验。
  "less.validate": false,
  // 关闭 VS Code 内置 SCSS 校验。
  "scss.validate": false
}
```

在 `eslint.config.ts` 配置文件中（ESLint 从 9.9.0 开始支持 TypeScript 配置文件）:

```ts
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
```
