import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import fg from 'fast-glob'
import matter from 'gray-matter'

// 目标输出文件
const META_JSON_PATH = path.resolve(process.cwd(), 'src', 'records', 'note-meta.json')

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  if (!match)
    return {}

  const fmText = match[1]
  const createdAtMatch = fmText.match(/Created At: (.+)/)
  const updatedAtMatch = fmText.match(/Updated At: (.+)/)
  const fileNameMatch = fmText.match(/File Name: (.+)/)

  return {
    createdAt: createdAtMatch ? createdAtMatch[1].trim() : '',
    updatedAt: updatedAtMatch ? updatedAtMatch[1].trim() : '',
    fileName: fileNameMatch ? fileNameMatch[1].trim() : '',
  }
}

async function generateMetaMap() {
  const entries = await fg('src/notes/**/*.md')

  const metaMap = new Map()

  for (const filePath of entries) {
    const content = await fs.readFile(filePath, 'utf-8')
    const fm = await parseFrontmatter(content)
    const fileName = path.basename(filePath, '.md')
    const tag = path.basename(path.dirname(filePath))

    // 如果 File Name 缺失，用文件名补充
    const finalFileName = fm.fileName || fileName

    const parsed = matter(content)
    metaMap.set(finalFileName, { ...parsed, data: (Object.assign(parsed.data, { Path: filePath, Tag: tag })) })
  }

  await ensureDir(path.dirname(META_JSON_PATH))
  const obj = Object.fromEntries(metaMap)
  await fs.writeFile(META_JSON_PATH, JSON.stringify(obj, null, 2), 'utf-8')
  console.log(`Generated meta.json with ${metaMap.size} entries at ${META_JSON_PATH}`)
}

generateMetaMap().catch((err) => {
  console.error(err)
  process.exit(1)
})
