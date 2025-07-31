<script lang="ts" setup>
import { copyText } from '@/utils/tools'
import hljs from 'highlight.js'
import { Marked, type Tokens } from 'marked'
import { markedHighlight } from 'marked-highlight'
import { computed, nextTick, toRefs } from 'vue'

interface Props {
  markRaw: string
}

const props = withDefaults(defineProps<Props>(), {
  markRaw: '',
})

const { markRaw } = toRefs(props)
const markdownContent = computed(() => parseMDByHighlight(markRaw.value))

const renderer = {
  image(token: Tokens.Image): string {
    return `<div class='img-box'>
              <img src="${getNodeImageUrl(token.href)}" alt=""/>
            </div>
           `
  },
}

function viewImg() {
  console.warn('预览图片')
}

function getNodeImageUrl(name?: string) {
  if (name?.split('.').at(-1) === 'gif') {
    return name
  }
  return `https://raw.githubusercontent.com/FU-design/Picture/refs/heads/main/src/assets/notes-img/${name}`
}

function copyCode(code: string) {
  copyText(code)
    .then(() => {
      console.warn('Copied!')
    })
    .catch((err: Error) => {
      console.warn('Failed!', err)
    })
}

async function upgradeCodeBlock(el: HTMLElement) {
  await nextTick()
  const pres = el.querySelectorAll('pre')
  const imgs = document.querySelectorAll('img')

  for (const imgItem of imgs) {
    imgItem.removeEventListener('click', viewImg)
    imgItem.addEventListener('click', viewImg)
  }

  for (const pre of pres) {
    const code = pre.querySelector('code')
    const langTag = pre.querySelector('#language')
    const copyTag = pre.querySelector('#copy')

    langTag!.textContent = (code?.classList.value.replace('hljs language-', '') as string).toLowerCase()
    copyTag && copyTag.removeEventListener('click', () => copyCode(code?.textContent || ''))
    copyTag?.addEventListener('click', () => copyCode(code?.textContent || ''))
  }
}

function upgradedCodeBlock(parsedMarked: string) {
  const upgradeParts = `<pre style="padding:0"><div class="code-block-head"><label id="language">Code</label><button id="copy">Copy</button></div>`
  return parsedMarked.replace(/<pre>/g, upgradeParts)
}

function getMarkedHighlightOps() {
  return markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  })
}

function parseMDByHighlight(content: string) {
  const marked = new Marked(getMarkedHighlightOps())
  marked.use({ renderer })
  return upgradedCodeBlock(marked.parse(content) as string)
}

const vUpgradeCodeBlock = {
  updated: upgradeCodeBlock,
  mounted: upgradeCodeBlock,
}
</script>

<template>
  <div v-dompurify-html="markdownContent" v-upgradeCodeBlock class="markdown-body" />
</template>

<style lang="scss" scoped></style>
