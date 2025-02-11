import type { Plugin } from 'vite'
import fs from 'node:fs/promises'

/**
 * Vite 插件：监听文件变化并更新时间戳
 */
export default function updateTimestampPlugin(): Plugin {
  let isWriting = false

  // 更新文件中的时间戳
  async function updateFileTimestamp(filePath: string) {
    if (isWriting)
      return
    try {
      const data = await fs.readFile(filePath, 'utf8')
      const currentTime = new Date().toLocaleString()
      const updatedData = data.replace(
        /Updated At: \d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{2}:\d{2}/,
        `Updated At: ${currentTime}`,
      )
      isWriting = true
      await fs.writeFile(filePath, updatedData, 'utf8')
      console.warn(`文件 ${filePath} 的更新时间已更新为: ${currentTime}`)
    }
    catch (err) {
      console.error(`更新文件 ${filePath} 时出错:`, err)
    }
    finally {
      isWriting = false
    }
  }

  return {
    name: 'vite-plugin-update-timestamp',
    // Vite dev server 启动时调用
    configureServer(server) {
      server.watcher.on('change', async (filePath) => {
        if (filePath.endsWith('.md')) {
          console.warn(`检测到文件 ${filePath} 发生变化，检查内容...`)
          await updateFileTimestamp(filePath)
          const data = await fs.readFile(filePath, 'utf8')
          await fs.writeFile(filePath, data, 'utf8')

          // 强制 Vite 重新加载文件
          server.ws.send({
            type: 'full-reload',
            path: filePath,
          })
        }
      })
    },
  }
}
