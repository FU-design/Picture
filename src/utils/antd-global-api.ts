import type { MessageInstance } from 'ant-design-vue/es/message/interface'
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm'
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface'
import type { App } from 'vue'

interface AntdGlobalApi {
  message?: MessageInstance
  notification?: NotificationInstance
  modal?: Omit<ModalStaticFunctions, 'warn'>
}

export const antdGlobalApi: AntdGlobalApi = {}

export function installAntdApi(app: App) {
  const ctx = app.config.globalProperties

  antdGlobalApi.message = ctx.$message
  antdGlobalApi.notification = ctx.$notification
}

export const useGlobalMessage = () => antdGlobalApi.message!
export const useGlobalNotification = () => antdGlobalApi.notification!
