import type { VNodeRef } from 'vue'

export type CreateType = 'tag' | 'text'

export interface ContentItem {
  type: CreateType
  text: string
  [propKey: string]: unknown
}

export interface TagTextEditorProps {
  contents: ContentItem[]
  type?: 'textarea' | 'select'
  disabled?: boolean
  placeholder?: string
}

export interface TagTextEditorEmits {
  (event: 'focus', $ref?: VNodeRef, e?: Event, ...args: any[]): void
  (event: 'blur', ...args: any[]): void
  (event: 'update:contents', ...args: any[]): void
}
