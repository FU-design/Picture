<script setup lang="ts">
import { type FormItem, VForm } from '@/components/antd/VForm/index'
// interface FormData {
//   name?: string
//   generatedAt?: string
//   totalUsers?: number
//   colors?: string[]
//   cities?: string[]
//   status?: string
// }

const formData = ref<any>({})

const formItems = ref<FormItem[]>([
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
    type: 'select',
    field: 'colors',
    label: 'Colors',
    placeholder: 'Please select colors',
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
    <VForm v-model="formData" :form-items="formItems" :form-data="formData" :gutter="[16, 8]">
      <template #name="{ item, record }">
        <a-input v-model:value="record[item.field]" :placeholder="item.placeholder" />
      </template>
      <template #colors="{ item, record }">
        <a-select v-model:value="record[item.field]" :placeholder="item.placeholder">
          <a-select-option v-for="option in [2, 1] " :key="option" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
      </template>
    </VForm>
    <div>
      {{ formData }}
    </div>
  </div>
</template>ƒ

<style scoped>
.v-form-test{
  /* width: 20vw; */
}
</style>
