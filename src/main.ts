import { installAntdApi } from '@/utils/antd-global-api'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(VueDOMPurifyHTML)
app.use(pinia)
app.use(Antd)
app.use(router)
app.mount('#app')

installAntdApi(app)
