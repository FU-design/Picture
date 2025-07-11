export interface IFormItem<T extends object = Record<string, any>> {
  label?: string | (() => VNode) // 表单项 label
  field: string // 表单项绑定字段
  placeholder?: any // 占位符
  disabled?: boolean // 禁用标识
  props?: T // 表单属性，组件会将所有的 props 传递给 type 绑定的组件
  type?: string | Component // 组件类型，根据所传递的类型，动态渲染表单项，默认显示为 input 输入框
  span?: number // 表单项栅格数
  key?: string // 表单项唯一标识，未传递时会使用 field 作为唯一标识，若表单项中存在相同的 field 则必须传递 key
  hidden?: boolean // 隐藏标识
  required?: boolean // 是否必填
  [key: string]: any // 栅格配置
}
