import Vue from 'vue'
import VueI18n from 'vue-i18n' //
import Locale from 'element-ui/lib/locale'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementCN from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import elementHK from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import elementJA from 'element-ui/lib/locale/lang/ja' // 引入饿了么的日文包
import elementKO from 'element-ui/lib/locale/lang/ko' // 引入饿了么的韩文包
import elementID from 'element-ui/lib/locale/lang/id'
// 引入业务自定义的语言包
const localCN = require('./locale/zh.json') // 简体
const localHK = require('./locale/hk.json') // 繁體
const localEN = require('./locale/en.json') // English
const localJA = require('./locale/ja.json') //
const localID = require('./locale/id.json') //
const localKO = require('./locale/ko.json') // 引入饿了么的印尼语包

// 在这里引入moment了，所以不在main.js引入了
// import Moment from 'moment'
// Vue.prototype.$moment = Moment
Vue.use(VueI18n)

// 语言包的类型合并
const messages = {
  'zh-CN': { ...localCN, ...elementCN },
  'zh-HK': { ...localHK, ...elementHK },
  'en-US': { ...localEN, ...elementEN },
  'ja-JP': { ...localJA, ...elementJA },
  'ko-KR': { ...localKO, ...elementKO },
  'id-ID': { ...localID, ...elementID }
}

// localStorage获取当前语言类型(初次本地不存在'lang'字段存储，默认设置为'zh_CN')
var lang = null;
var language = localStorage.getItem('sys-locale')
if (!language) {
  lang = 'en-US'
}
console.log('语言类型', localStorage.getItem('sys-locale'))
// 初次加载的语言默认设置
Locale.use(lang, messages[lang])
// Locale.i18n((key, value) => i18n.t(key, value))
// 时间类moment语言默认设置
// Moment.locale(lang)

export default new VueI18n({
  locale: lang, // set locale
  messages: messages// set locale messages
})

