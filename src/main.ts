import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './i18n/i18n'


const app = createApp(App)
app.use(i18n);
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// const locale = i18n.global.locale; // Lấy ngôn ngữ từ i18n
// app.component('el-config-provider', { props: ['locale'], template: `<el-config-provider :locale="locale"><slot /></el-config-provider>` });
app.use(ElementPlus)

app.mount('#app')


