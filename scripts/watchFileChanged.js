import fs from 'node:fs/promises'
import chokidar from 'chokidar'
import { glob } from 'glob'

let isWriting = false // 防止循环写入

/**
 *
 * @param {string} path
 * @returns matched files
 */
function matchWatchFiles(path) {
  const files = glob.sync(path, { ignore: 'node_modules/**' })
  if (files.length === 0) {
    console.error('No matching file found, please check if the path and file exist')
    return
  }
  return files
}

async function onFileChanged(filePath) {
  if (isWriting)
    return
  try {
    const data = await fs.readFile(filePath, 'utf8')

    isWriting = true

    const currentTime = new Date().toLocaleString()
    const updatedData = data.replace(
      /Updated At: \d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{2}:\d{2}/,
      `Updated At: ${currentTime}`,
    )

    await fs.writeFile(filePath, updatedData, 'utf8')
    console.log(`文件 ${filePath} 的更新时间已更新为: ${currentTime}`)
  }
  catch (err) {
    console.error(`操作文件 ${filePath} 时出错:`, err)
  }
  finally {
    isWriting = false
  }
}

/**
 * @param {string} path
 */
function execWatcher(path = 'src/notes/**/*.md') {
  const watcher = chokidar.watch((matchWatchFiles(path)), {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100, // 文件修改后等待时间，单位毫秒
      pollInterval: 50,
    },
  })
  watcher
    .on('ready', () => console.warn('Listener started'))
    .on('change', onFileChanged)
  console.warn('Listening ...')
}

execWatcher()
