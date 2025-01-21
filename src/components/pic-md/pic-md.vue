<script setup lang="ts">
import { copyText } from '@/utils/tools'
import hljs from 'highlight.js'
import { Marked } from 'marked'
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

function copyCode(code: string) {
  copyText(code)
    .then(() => {
    })
    .catch((err: Error) => {
      console.error('err :>> ', err)
    })
}

async function upgradeCodeBlock(el: HTMLElement) {
  await nextTick() // 静态 markdown 文件解析时需要添加
  const pres = el.querySelectorAll('pre')
  pres.forEach((pre) => {
    const code = pre.querySelector('code')
    const langTag = pre.querySelector('#language')
    const copyTag = pre.querySelector('#copy')

    langTag!.textContent = (
      code?.classList.value.replace('hljs language-', '') as string
    ).toLowerCase()
    copyTag && copyTag.removeEventListener('click', () => copyCode(code?.textContent || ''))
    copyTag?.addEventListener('click', () => copyCode(code?.textContent || ''))
  })
}

function upgradedCodeBlock(parsedMarked: string) {
  const upgradeParts = `<pre style="padding:0"><div class="code-block-head"><label id="language" :key="${Date.now()}">Code</label><button id="copy">copy</button></div>`
  return parsedMarked.replace(/<pre>/g, upgradeParts)
}

function getMarkedHighlightOps() {
  return markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  })
}

function parseMDByHighlight(content: string) {
  const marked = new Marked(getMarkedHighlightOps())
  return upgradedCodeBlock(marked.parse(content) as string)
}

const vUpgradeCodeBlock = {
  // updated: upgradeCodeBlock,
  mounted: upgradeCodeBlock,
}
</script>

<template>
  <div v-upgradeCodeBlock v-dompurify-html="markdownContent" class="markdown-body" />
</template>

<style lang="scss" scoped></style>
