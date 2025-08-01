import path from 'node:path'
import process from 'node:process'
import micromatch from 'micromatch'

export function getFileNameAndRelativePath(filePath: string) {
  const relative = path.relative(process.cwd(), filePath)
  const fileName = path.basename(relative, '.md')
  // const dirName = path.basename(path.dirname(filePath)) // tag

  return {
    relative,
    fileName,
  }
}

export function isTargetMarkdown(filePath: string, matchPath: string): boolean {
  const { relative } = getFileNameAndRelativePath(filePath)
  return micromatch.isMatch(relative, matchPath)
}

/**
 * Generate front description for markdown file
 *
 * @param fileName
 * @returns md description
 */
export function generateFrontmatter(fileName: string) {
  const currentTime = new Date().toLocaleString()
  return `---
Created At: ${currentTime}
Updated At: ${currentTime}
File Name: ${fileName}
---

# ${fileName}

This is the content of ${fileName}.
`
}

/**
 * Update front description for markdown file
 *
 * @param content
 * @param fileName
 * @returns md description
 */
export function updateOrInsertFrontmatter(content: string, fileName: string) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const now = new Date().toLocaleString()

  const match = content.match(frontmatterRegex)

  if (!match) {
    return `${generateFrontmatter(fileName)}\n${content}`
  }

  const frontmatterContent = match[1]

  const hasCreated = /Created At: .+/.test(frontmatterContent)
  const hasUpdated = /Updated At: .+/.test(frontmatterContent)
  const hasFileName = /File Name: .+/.test(frontmatterContent)

  if (!(hasCreated && hasUpdated && hasFileName)) {
    const rest = content.slice(match[0].length)
    return `${generateFrontmatter(fileName)}\n${rest.trimStart()}`
  }

  const newFrontmatter = frontmatterContent.replace(
    /Updated At: .+/,
    `Updated At: ${now}`,
  )

  return content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`)
}
