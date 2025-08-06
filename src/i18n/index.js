import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Locale from 'element-ui/lib/locale'
import elementEN from 'element-ui/lib/locale/lang/en'
import elementCN from 'element-ui/lib/locale/lang/zh-CN'
import elementHK from 'element-ui/lib/locale/lang/zh-CN'
import elementJA from 'element-ui/lib/locale/lang/ja'
import elementKO from 'element-ui/lib/locale/lang/ko'
import elementID from 'element-ui/lib/locale/lang/id'
// Introduce custom language packs for business
const localCN = require('./locale/zh.json')
const localHK = require('./locale/hk.json')
const localEN = require('./locale/en.json')
const localJA = require('./locale/ja.json')
const localID = require('./locale/id.json')
const localKO = require('./locale/ko.json')

// import Moment from 'moment'
// Vue.prototype.$moment = Moment
Vue.use(VueI18n)

// Merge language pack types
const messages = {
  'zh-CN': { ...localCN, ...elementCN },
  'zh-HK': { ...localHK, ...elementHK },
  'en-US': { ...localEN, ...elementEN },
  'ja-JP': { ...localJA, ...elementJA },
  'ko-KR': { ...localKO, ...elementKO },
  'id-ID': { ...localID, ...elementID }
}

// LocalStorage retrieves the current language type (initially, there is no 'lang' field stored locally, default setting is' zh_CN ')
var lang = null;
var language = localStorage.getItem('sys-locale')
if (!language) {
  lang = 'en-US'
}
console.log('Language Type', localStorage.getItem('sys-locale'))
// Default language settings for initial loading
Locale.use(lang, messages[lang])
// Locale.i18n((key, value) => i18n.t(key, value))
// Default Settings for Time based Moment Language
// Moment.locale(lang)

export default new VueI18n({
  locale: lang, // set locale
  messages: messages// set locale messages
})

