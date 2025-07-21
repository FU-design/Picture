<script lang="ts" setup>
import type { FormInstance, FormProps } from 'ant-design-vue'
import type { FormItem } from './types'

import { isString } from 'lodash-es'
import { computed, ref } from 'vue'
import { selectType } from './config'
import { useComponentItem } from './useComponentItem'

interface Props {
  formItems: FormItem[]
  formConfig?: FormProps
  span?: number
  rules?: Record<string, any>
  gutter?: number[] | number | Record<string, any>
}

defineOptions({ name: 'FormBuilder' })

const props = withDefaults(defineProps<Props>(), {
  formItems: () => [],
  formConfig: () => ({ colon: false, labelAlign: 'left' }),
  rules: () => ({}),
  gutter: () => [8, 8],
  span: 24,
})

const { ComponentItem } = useComponentItem()

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
const formData = defineModel<Record<string, any>>({ default: () => ({}) })

const formRef = ref<FormInstance>()
const labelRefs = ref<HTMLElement[]>()

// Filter hidden form item
const formItemsComputed = computed(() => props.formItems.filter(item => item.hidden !== true))

// Calculate the max width of the label
const defaultLabelCol = computed(() => {
  let defaultLabelWidth = 60
  labelRefs.value?.forEach((label: HTMLElement) => {
    const newWidth = label!.offsetWidth + 20
    if (defaultLabelWidth < newWidth) {
      defaultLabelWidth = newWidth
    }
  })

  return `${defaultLabelWidth}px`
})

// Merge rules
const requiredRules = computed(() => {
  return props.formItems.reduce((pre, item) => {
    const { type = 'input', label, required = false } = item
    if (!pre[`${item.field}`] && isString(type) && isString(label) && required) {
      // If the item is required, add a validation rule
      const errorMsg = `${selectType.has(type) ? 'Please select' : 'Please enter'}`

      // If rules are provided, use them; otherwise, create a default rule
      pre[item.field] = props.rules[item.field] ?? [
        {
          required: true,
          message: `${errorMsg} ${label.toLowerCase()}`,
          trigger: 'blur',
        },
      ]
    }
    return pre
  }, {} as Record<string, any>)
})

/**
 * Get form item props
 * @param formItem
 */
function getFormItemProps(formItem: FormItem) {
  const { formProps = {} } = formItem
  const mergedProps = {
    ...formProps, // else props
  }
  // do something...

  return mergedProps
}

function validate() {
  return formRef.value?.validate()
}

function resetForm(name?: string) {
  formRef.value?.resetFields(name)
}

defineExpose({
  validate,
  resetForm,
})
</script>

<template>
  <a-form
    ref="formRef"
    :model="formData"
    :rules="requiredRules"
    v-bind="{ labelCol: { style: { width: defaultLabelCol } }, ...formConfig }"
  >
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
          <slot :name="item.field" :item="item" :record="formData">
            <component :is="ComponentItem" :item="item" :form-data="formData" />
          </slot>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
