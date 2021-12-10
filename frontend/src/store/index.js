import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import filter from './modules/filter'
import offers from './modules/offers'
import applications from './modules/applications'
import recruiters from './modules/recruiters'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { user, offers, filter, applications, recruiters },
  strict: debug
})
