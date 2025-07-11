import {
  Cascader,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
  TimePicker,
  TreeSelect,
} from 'ant-design-vue'
import { isString } from 'lodash-es'
import { type Component, h } from 'vue'

/**
 * 由于 ant-design-vue 组件许多都是 v-model:value 绑定的，为了统一处理，使用这个函数将组件转换为支持 v-model 的组件。
 * 将传入的组件转换为支持 v-model 双向绑定的组件。
 * @param component 要转换为支持 v-model 的 Vue 组件
 * @param key 绑定属性的名称，默认为 'value'
 * @returns 返回一个新的包装组件，支持 v-model 绑定
 */
export function transformModelValue(component: Component, key = 'value'): Component {
  return defineComponent({
    setup(props: any, { attrs, slots, emit }) {
      return () => {
        const { modelValue, ..._props } = { ...props, ...attrs }
        return h(
          component,
          {
            ..._props,
            [key]: modelValue,
            [`onUpdate:${key}`]: emit.bind(null, 'update:modelValue'),
          },
          slots,
        )
      }
    },
  })
}

const formItemMap = new Map<string, Component>([
  ['input', transformModelValue(Input)],
  ['textarea', transformModelValue(Textarea)],
  ['number', transformModelValue(InputNumber)],
  ['time', transformModelValue(TimePicker)],
  ['date', transformModelValue((props, { slots, attrs }) => h(DatePicker, { valueFormat: 'YYYY-MM-DD', ...attrs, ...props }, slots))],
  ['cascader', Cascader],
  ['slider', Slider],
  ['checkbox', transformModelValue(Checkbox, 'checked')],
  ['checkboxGroup', CheckboxGroup],
  ['radio', Radio],
  ['radioGroup', transformModelValue(RadioGroup)],
  ['switch', Switch],
  ['treeSelect', TreeSelect],
  ['select', transformModelValue(Select)],
])

export function getFormItemComponent(type?: string | Component): Component {
  if (type && !isString(type))
    return type
  return (type && formItemMap.get(type)) || formItemMap.get('input') || Input
}
