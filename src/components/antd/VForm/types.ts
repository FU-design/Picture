import type { Component, VNode } from 'vue'

export interface FormItem<T extends object = Record<string, any>> {
  label?: string | (() => VNode)
  field: string
  placeholder?: any
  disabled?: boolean
  props?: T
  type?: string | Component
  span?: number
  key?: string
  hidden?: boolean
  required?: boolean
  [key: string]: any
}
