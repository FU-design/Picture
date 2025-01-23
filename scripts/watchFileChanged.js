import fs from 'node:fs'
import chokidar from 'chokidar'
import { glob } from 'glob'

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

function onFileChanged(filePath) {
  console.log(`文件 ${filePath} 发生了变化，正在检查是否需要更新...`)
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`读取文件 ${filePath} 时出错:`, err)
      return
    }

    const currentTime = new Date().toLocaleString()
    const updatedData = data.replace(
      /Updated At: \d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}/,
      `Updated At: ${currentTime}`,
    )

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error(`写入文件 ${filePath} 时出错:`, err)
        return
      }
      console.log(`文件 ${filePath} 的更新时间已更新为: ${currentTime}`)
    })
  })
}

/**
 * @param {string} path
 */
function execWatcher(path = 'src/notes/**/*.md') {
  const watcher = chokidar.watch((matchWatchFiles(path)), {
    persistent: true, // 持续监听
    ignoreInitial: true, // 忽略初次监听
  })
  watcher
    .on('ready', () => console.warn('Listener started'))
    .on('change', onFileChanged)
    // .on('all', (event, path) => console.warn(`event: ${event}, filePath: ${path}`))
    // .on('add', path => console.warn(`File add: ${path}`))
    // .on('unlink', path => console.warn(`File delete: ${path}`))
    // .on('error', error => console.error(`error: ${error}`))

  console.warn('Listening ...')
}

execWatcher()
