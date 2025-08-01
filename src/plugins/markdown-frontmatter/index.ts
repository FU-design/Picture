import type { Plugin } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
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
  }
}
