<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import type { IFormItem } from './types'

import { h } from 'vue'
import { getFormItemComponent } from './config'

interface Props {
  formItems: IFormItem[]
  formConfig?: Record<string, any>
  span?: number
  rules?: Record<string, any>
  gutter?: number[] | number | Record<string, any>
}

defineOptions({
  name: 'VFormBuilder',
})

const props = withDefaults(defineProps<Props>(), {
  formItems: () => [],
  formConfig: () => ({ colon: false }),
  gutter: () => [8, 8],
  span: 24,
})

/**
 *
 * Form data
 *
 * @extends
 *   defineProps<{ modelValue: Record<string, any> }>()
 *   defineEmits(['update:modelValue'])
 *
 *   const formData = computed({
 *    get: () => props.modelValue,
 *    set: (val) => emit('update:modelValue', val),
 *   })
 */
const formData = defineModel<Record<string, any>>({
  default: () => ({}),
})

const selectType = new Set(['select', 'date', 'time', 'treeSelect'])
const baseFieldReg = /^(?:type|label|props|on|span|key|hidden|required|rules|col|formProps)$/

const formRef = ref<FormInstance>()
const labelRefs = ref<HTMLElement[]>()

// Filter hidden form item
const formItemsComputed = computed(() => (props.formItems.filter(item => item.hidden !== true)))

// Calculate the max width of the label
const defaultLabelCol = computed(() => {
  let defaultLabelWidth = '60px'
  labelRefs.value?.forEach((label: HTMLElement) => {
    if (Number.parseInt(defaultLabelWidth) < label!.offsetWidth) {
      defaultLabelWidth = `${Number.parseFloat(`${label!.offsetWidth + 20}`).toFixed(2)}px`
    }
  })

  return defaultLabelWidth
})

// /**
//  * Calculate the pixel length of the text.
//  * @param text
//  * @param font
//  */
// function calcTextWidth(text: string, font = '14px sans-serif'): number {
//   const canvas = document.createElement('canvas')
//   const context = canvas.getContext('2d')!
//   context.font = font
//   return context.measureText(text).width
// }

/**
 * Get form item props
 */
function getFormItemProps(formItem: IFormItem) {
  const { formProps = {} } = formItem
  const mergedProps = {
    ...formProps, // else props
  }

  return mergedProps
}

const ComponentItem = {
  props: ['item'],
  setup({ item }: { item: IFormItem }) {
    // Filter invalid prop
    const props = Object.keys(item).reduce<Record<string, any>>(
      (prev, key) => {
        if (!baseFieldReg.test(key)) {
          prev[key] = item[key]
        }
        return prev
      },
      { ...item.props, formData: formData.value },
    )

    // Add default placeholder
    if (!('placeholder' in props)) {
      if (typeof item.label != 'function') {
        const text = selectType.has(item.type as string ?? '') ? 'Please select' : 'Please enter'
        props.placeholder = `${text} ${item.label?.toLowerCase()}`
      }
    }

    const tag = getFormItemComponent(item.type)
    const slots = item.slots ? { default: () => item.slots } : undefined

    return () =>
      h(
        tag,
        {
          ...props,
          'modelValue': formData.value[item.field],
          'onUpdate:modelValue': (val: string) => {
            formData.value[item.field] = val
          },
        },
        slots,
      )
  },
}

function validate() {
  return formRef.value?.validate()
}

defineExpose({
  validate,
})
</script>

<template>
  <a-form ref="formRef" :model="formData" :rules="rules" v-bind="{ labelCol: { style: { width: defaultLabelCol } }, ...formConfig }">
    <a-row :gutter="props.gutter as any">
      <a-col v-for="item of formItemsComputed" :key="item.field" :span="item.span || span">
        <a-form-item :name="item.field" v-bind="getFormItemProps(item)">
          <template #label>
            <div ref="labelRefs">
              <span v-if="typeof item.label === 'function'">
                <component :is="item.label as Function" />
              </span>
              <span v-else>{{ item.label }}</span>
            </div>
          </template>
          <slot :name="item.field" :item="item">
            <component :is="ComponentItem" :item="item" />
          </slot>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
