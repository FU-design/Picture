import type { VNode } from 'vue'

export interface StepItem {
  key: string
  title: string | number
  subTitle?: string | number
  icon?: VNode | string
}
