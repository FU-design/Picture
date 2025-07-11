<script setup lang="ts">
import { type IFormItem, VForm } from '@/components/antd/VForm/index'

const formData = ref<any>({})

const formRules = computed(() => ({
  name: [{ required: true, message: `Name is required`, trigger: ['blur', 'change'] }],
  generatedAt: [{ required: true, message: `Generated At is required`, trigger: ['blur', 'change'] }],
}))

const formItems = ref<IFormItem[]>([
  {
    field: 'name',
    label: 'Name',
    placeholder: 'Please enter name',
    required: true,
  },
  {
    field: 'generatedAt',
    label: 'Generated At',
    required: true,
  },
  {
    field: 'totalUsers',
    label: 'Total Users',
  },
  {
    type: 'select',
    field: 'colors',
    label: 'Colors',
    props: {
      options: [
        { label: '选项 1', value: '1' },
        { label: '选项 2', value: '2' },
      ],
    },
  },
  {
    type: 'select',
    field: 'cities',
    placeholder: 'Please select email address',
    label: () => h('div', null, [h('div', null, h('span', 'Email Address'))]),
    props: {
      options: [
        { label: '选项 1', value: '1' },
        { label: '选项 2', value: '2' },
      ],
    },
  },
  {
    type: 'radioGroup',
    field: 'status',
    label: 'Status',
    props: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' },
      ],
    },
  },
])
</script>

<template>
  <div class="v-form-test">
    <PicCard>
      <VForm v-model="formData" :form-items="formItems" :form-data="formData" :rules="formRules" :gutter="[16, 8]">
        <template #name="{ item }">
          <a-input v-model:value="formData[item.field]" :placeholder="item.placeholder" />
        </template>
      </VForm>
      <div>
        {{ formData }}
      </div>
    </PicCard>
  </div>
</template>

<style scoped>
.v-form-test{
  /* width: 20vw; */
}
</style>
