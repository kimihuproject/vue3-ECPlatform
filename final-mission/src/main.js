import { createApp } from 'vue'

// plugin
import axios from 'axios'
import VueAxios from 'vue-axios'
// import { createPinia } from 'pinia'

// 文章編輯器
import CKEditor from '@ckeditor/ckeditor5-vue';

// 表單驗證
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

// style
import '@/style/all.scss'

// 進入點
import App from '@/App.vue'
import router from '@/router'

// 表單驗證
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})
setLocale('zh_TW')


const app = createApp(App)

// app.use(createPinia())
app.use(VueAxios, axios)
app.use(router)
app.use(CKEditor)

app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)



// 掛載
app.mount('#app')




