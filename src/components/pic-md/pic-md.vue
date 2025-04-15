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
      console.warn('Copied!')
    })
    .catch((err: Error) => {
      console.warn('Failed!', err)
    })
}

async function upgradeCodeBlock(el: HTMLElement) {
  await nextTick()
  const pres = el.querySelectorAll('pre')
  pres.forEach((pre) => {
    const code = pre.querySelector('code')
    const langTag = pre.querySelector('#language')
    const copyTag = pre.querySelector('#copy')

    langTag!.textContent = (code?.classList.value.replace('hljs language-', '') as string).toLowerCase()
    copyTag && copyTag.removeEventListener('click', () => copyCode(code?.textContent || ''))
    copyTag?.addEventListener('click', () => copyCode(code?.textContent || ''))
  })
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
  return upgradedCodeBlock(marked.parse(content) as string)
}

const vUpgradeCodeBlock = {
  updated: upgradeCodeBlock,
  mounted: upgradeCodeBlock,
}
</script>

<template>
  <div v-upgradeCodeBlock v-dompurify-html="markdownContent" class="markdown-body" />
</template>

<style lang="scss" scoped></style>
