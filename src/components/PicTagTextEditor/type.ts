export type CreateType = 'tag' | 'text'

export interface ContentItem {
  type: CreateType
  text: string
  [propKey: string]: unknown
}

export interface TagTextEditorProps {
  uid: string
  contents: ContentItem[]
  type?: 'textarea' | 'select'
  disabled?: boolean
  placeholder?: string
}

export interface TagTextEditorEmits {
  (event: 'focus', e?: Event,): void
  (event: 'blur', e?: Event,): void
  (event: 'clickTag', e?: Event,): void
  (event: 'update:contents', contents: ContentItem): void
}
