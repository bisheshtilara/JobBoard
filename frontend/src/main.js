import Vue from 'vue'

import VueSweetalert2 from 'vue-sweetalert2'
import VueLazyload from 'vue-lazyload'
import Skeleton from 'vue-loading-skeleton'
import VueTippy, { TippyComponent } from 'vue-tippy'
import VueHead from 'vue-head'
import { Locale, Rate, Cell, CellGroup } from 'vant'
import enUS from 'vant/lib/locale/lang/en-US'
import clampy from '@clampy-js/vue-clampy'

import router from './router'
import store from './store'
import i18n from './i18n'
import App from './App.vue'

import Unicon from 'vue-unicons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFacebookF,
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter,
  faApple,
  faGoogle,
  faMicrosoft,
  faLinkedin,
  faGithub
} from '@fortawesome/free-brands-svg-icons'

import {
  faChevronDown,
  faTimes,
  faCheck,
  faGlobe,
  faBars,
  faCheckCircle,
  faCameraRetro,
  faSearch,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons'

import {
  uniCheck,
  uniCheckCircle,
  uniPlusCircle,
  uniAngleLeftB,
  uniAngleRightB,
  uniAngleUp,
  uniAngleDown,
  uniArrowLeft,
  uniWallet,
  uniUser,
  uniCog,
  uniLifeRing,
  uniTwitter,
  uniFacebookF,
  uniFacebook,
  uniInstagram,
  uniLinkedin,
  uniLinkedinAlt,
  uniHomeAlt,
  uniBoltAlt,
  uniHeart,
  uniUsersAlt,
  uniBell,
  uniHeartRate,
  uniSchedule,
  uniCommentAltDots,
  uniLockAltMonochrome,
  uniPen,
  uniEuro,
  uniGlobe,
  uniPlus,
  uniFire,
  uniSearch,
  uniShareAlt,
  uniStar,
  uniCopy,
  uniSignOutAlt,
  uniChartLine,
  uniFile,
  uniFileAlt,
  uniGift,
  uniMegaphone,
  uniInfoCircle,
  uniYinYang,
  uniTicket
} from 'vue-unicons/src/icons'

library.add(
  faFacebookF,
  faFacebook,
  faInstagram,
  faTwitter,
  faChevronDown,
  faTimes,
  faCheck,
  faYoutube,
  faGlobe,
  faBars,
  faCheckCircle,
  faApple,
  faGoogle,
  faMicrosoft,
  faCameraRetro,
  faSearch,
  faLinkedin,
  faFilePdf,
  faGithub
)

Unicon.add([
  uniCheck,
  uniCheckCircle,
  uniPlusCircle,
  uniAngleLeftB,
  uniAngleRightB,
  uniAngleUp,
  uniAngleDown,
  uniArrowLeft,
  uniWallet,
  uniLifeRing,
  uniTwitter,
  uniFacebookF,
  uniInstagram,
  uniLinkedinAlt,
  uniHomeAlt,
  uniBoltAlt,
  uniHeart,
  uniUsersAlt,
  uniBell,
  uniHeartRate,
  uniSchedule,
  uniCommentAltDots,
  uniLockAltMonochrome,
  uniCheck,
  uniCheckCircle,
  uniPlusCircle,
  uniAngleLeftB,
  uniAngleRightB,
  uniAngleUp,
  uniAngleDown,
  uniArrowLeft,
  uniFacebookF,
  uniFacebook,
  uniTwitter,
  uniInstagram,
  uniLinkedin,
  uniPen,
  uniEuro,
  uniGlobe,
  uniCog,
  uniUser,
  uniPlus,
  uniFire,
  uniSearch,
  uniShareAlt,
  uniStar,
  uniCopy,
  uniSignOutAlt,
  uniChartLine,
  uniFile,
  uniFileAlt,
  uniGift,
  uniMegaphone,
  uniInfoCircle,
  uniYinYang,
  uniTicket
])
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Unicon)
Vue.config.productionTip = false
Vue.use(require('vue-moment'))
Vue.use(require('v-click-outside'))
Vue.use(VueSweetalert2, {
  confirmButtonColor: '#4285F4',
  cancelButtonColor: '#ff7674'
})
Vue.use(VueLazyload)
Vue.use(Skeleton)
Vue.use(VueTippy)
Vue.component('tippy', TippyComponent)
Vue.use(VueHead, {
  complement: 'JobBoard'
})

Vue.use(Rate)
Vue.use(CellGroup).use(Cell)
Locale.use('en-US', enUS)
Vue.use(clampy)

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
