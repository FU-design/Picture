---
Created At: 8/1/2025, 4:22:20 PM
Updated At: 8/4/2025, 9:33:59 AM
File Name: 在vue组件单测中使用vue-i18n
---

## 在vue组件单测中使用vue-i18n

注：当前的测试工具为 [vitest](https://cn.vitest.dev/guide/)。

1. 创建测试文件 `example.test.ts`

    ```ts
    import Antd from 'ant-design-vue'
    import { createI18n, useI18n } from 'vue-i18n'
    import ExampleForm from '../../src/components/example/index.vue'

    const i18n = createI18n({
      legacy: false, // Use Composition API style
      locale: 'en',
      messages: {
        en: {
          form: {
            name: 'Translated Name'
          },
          common: {
            select_error: 'Please select ',
            enter_error: 'Please enter '
          }
        }
      }
    })

    const wrapper = mount(
      defineComponent({
        components: { ExampleForm },
        setup() {
          const { t } = useI18n()
          const formData = ref({ name: 'xxx' })
          const formRef = ref<InstanceType<typeof ExampleForm>>()

          const formItems = computed(() => [
            {
              field: 'name',
              label: t('form.name'),
              type: 'input',
              required: true
            }
          ])

          return {
            formRef,
            formData,
            formItems
          }
        },
        template: `
          <ExampleForm
            ref="formRef"
            v-model="formData"
            :form-items="formItems"
          />
        `
      }),
      {
        global: {
          plugins: [Antd, i18n]
        }
      }
    )

    it('renders translated labels using vue-i18n', () => {
      const label = wrapper.find('label')

      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Translated Name')
    })
    ```
