import type { ArgsProps as NotificationConfig } from 'ant-design-vue/es/notification/interface'
import { useGlobalMessage, useGlobalNotification } from '@/utils/antd-global-api.ts'

export const useGlobalStore = defineStore('global', () => {
  const info = (content: string) => {
    useGlobalMessage().info(content)
  }

  const success = (content: string) => {
    useGlobalMessage().success(content)
  }

  const error = (content: string) => {
    useGlobalMessage().error(content)
  }

  const notify = (options: NotificationConfig) => {
    useGlobalNotification().open(options)
  }

  return {
    info,
    success,
    error,
    notify,
  }
})
