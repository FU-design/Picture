---
Created At: 8/1/2025, 4:22:41 PM
Updated At: 8/1/2025, 4:22:41 PM
File Name: ci error
---

# ci error

This is the content of ci error.

# Vite - Adding auto-imports.d.ts to gitignore, generates error building for production

from
```json
{
  "build": "vue-tsc --noEmit && vite build"
}
```

to
```json
{
  "build": "vite build && vue-tsc --noEmit"
}
```

`vue-tsc --noEmit`

- vue-tsc 是 Vue 官方提供的一个 TypeScript 类型检查工具，基于 tsc，但更适配 .vue 文件。
- --noEmit 表示只进行类型检查，不输出任何文件（不会编译生成 js 或 d.ts）。
- 这个命令用于在构建后严格检查代码类型是否正确。
