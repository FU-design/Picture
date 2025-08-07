import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import fg from 'fast-glob'
import matter from 'gray-matter'

// 目标输出文件
const META_JSON_PATH = path.resolve(process.cwd(), 'src', 'utils', 'note-map.ts')

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function parseFrontmatter(content: string) {
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

export async function generateMetaMap() {
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

  const content = `// Auto-generated, DO NOT EDIT MANUALLY

export const notesData = ${JSON.stringify(obj, null, 2)} as const
\n
export type NoteKey = keyof typeof notesData
\n
export type Note = typeof notesData[NoteKey]
`

  await fs.writeFile(META_JSON_PATH, content, 'utf-8')
}
