import type { FormItem } from './types'
import { h } from 'vue'
import { baseFieldReg, getFormItemComponent, selectType } from './config'

export function useComponentItem() {
  const ComponentItem = {
    props: ['item', 'formData'],
    setup({ item, formData }: { item: FormItem, formData: Record<string, any> }) {
      // Filter invalid prop
      const props = Object.keys(item).reduce<Record<string, any>>(
        (prev, key) => {
          if (!baseFieldReg.test(key)) {
            prev[key] = item[key]
          }
          return prev
        },
        { ...item.props },
      )

      // Default placeholder
      if (!('placeholder' in props)) {
        if (typeof item.label != 'function') {
          const prefix = selectType.has((item.type as string) ?? '') ? 'Please select' : 'Please enter'
          props.placeholder = `${prefix} ${item.label?.toLowerCase()}`
        }
      }

      const tag = getFormItemComponent(item.type)
      const slots = item.slots ? { default: () => item.slots } : undefined

      return () =>
        h(
          tag,
          {
            ...props,
            'modelValue': formData[item.field],
            'onUpdate:modelValue': (val: string) => {
              formData[item.field] = val
            },
          },
          slots,
        )
    },
  }
  return { ComponentItem }
}
