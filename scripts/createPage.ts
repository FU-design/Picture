import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import inquirer from 'inquirer'

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get the list of folders
const notesDir = path.join(__dirname, '../src/notes')

// Get the list of folders
function getFolders() {
  return fs.readdirSync(notesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

// Generate Markdown file content
function generateMarkdownContent(fileName) {
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

// Create a file
function createFile(folder, fileName) {
  const filePath = path.join(notesDir, folder, `${fileName}.md`)
  const content = generateMarkdownContent(fileName)
  fs.writeFileSync(filePath, content)
  console.log(`File created${filePath}`)
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const folders = getFolders()
  if (folders.length === 0) {
    console.error('No folders found. Please create folders under ./src/notes.')
    rl.close()
    return
  }

  const { fileName } = await inquirer.prompt({
    type: 'input',
    name: 'fileName',
    message: 'Please enter the file name:',
    validate: (input) => {
      if (!input) {
        return 'File name cannot be empty!'
      }
      return true
    },
  })

  const { selectedFolder } = await inquirer.prompt({
    type: 'list',
    name: 'selectedFolder',
    message: 'Please select a tag:',
    choices: folders,
  })

  createFile(selectedFolder, fileName)
}

main()
