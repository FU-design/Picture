import type { Plugin } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { generateMetaMap } from './generate'
import { generateFrontmatter, getFileNameAndRelativePath, isTargetMarkdown, updateOrInsertFrontmatter } from './helper'

interface PluginPayload {
  matchPath: string // watch target path
}

export default function updateMarkdownFrontmatterPlugin(pluginPayload: PluginPayload): Plugin {
  return {
    name: 'markdown-frontmatter',
    apply(_config, env) {
      return env.command === 'serve'
    },

    configureServer(server) {
      server.watcher.on('add', filePath => onAdd(filePath, pluginPayload))
      server.watcher.on('change', filePath => onChange(filePath, pluginPayload))
      server.watcher.on('unlink', filePath => onUnlink(filePath, pluginPayload))
    },

  }
}

// --------------- watcher actions -----------------

function onAdd(filePath: string, payload: PluginPayload) {
  // filter ***.md
  if (isTargetMarkdown(filePath, payload.matchPath)) {
    const { fileName } = getFileNameAndRelativePath(filePath)
    const mdContext = generateFrontmatter(fileName)

    writeFile(filePath, mdContext)
    updateNoteMeta()
  }
}

function onUnlink(filePath: string, payload: PluginPayload) {
  // filter ***.md
  if (isTargetMarkdown(filePath, payload.matchPath)) {
    const { fileName } = getFileNameAndRelativePath(filePath)
    const mdContext = generateFrontmatter(fileName)

    writeFile(filePath, mdContext)
    updateNoteMeta()
  }
}

async function onChange(filePath: string, payload: PluginPayload) {
  // filter ***.md
  if (isTargetMarkdown(filePath, payload.matchPath)) {
    const { relative, fileName } = getFileNameAndRelativePath(filePath)
    const content = await readFile(relative, 'utf-8')
    const updated = updateOrInsertFrontmatter(content, fileName)

    if (content === updated)
      return

    await writeFile(filePath, updated, 'utf-8')
    updateNoteMeta()
  }
}

function updateNoteMeta() {
  generateMetaMap().catch((err) => {
    console.error(err)
    process.exit(1)
  })

  // const scriptPath = path.resolve('scripts/node-map.js')
  // execFile('tsx', [scriptPath], (error, _stdout, stderr) => {
  //   if (error) {
  //     console.error('[note-meta] 脚本执行失败:', error)
  //     return
  //   }
  //   if (stderr)
  //     console.error('[note-meta] 脚本错误输出:', stderr)
  // })
}
