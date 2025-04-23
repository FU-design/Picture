export type CreateType = 'tag' | 'text'
export type TagChangeCommad = 'add' | 'remove'

export interface ContentItem {
  type: CreateType
  text: string
  [propName: string]: unknown
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
  (event: 'change', commad: TagChangeCommad, tag: ContentItem): void
  (event: 'update:contents', contents: ContentItem[]): void
}
