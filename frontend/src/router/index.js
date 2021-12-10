import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import store from '@/store'
import { routes } from './routes'

const progressShowDelay = 100
let routeResolved = false

const cancelTopProgress = () => {
  routeResolved = true
  NProgress.done()
}

const tryInitProgress = () => {
  routeResolved = false
  setTimeout(() => {
    if (!routeResolved) {
      NProgress.start()
    }
  }, progressShowDelay)
}

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    else return { x: 0, y: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  tryInitProgress()
  const isLoggedIn = await store.dispatch('user/getCurrentUser')
  if (to.matched.some((record) => record.meta.redirectsIfAuth)) {
    if (isLoggedIn) next({ path: '/jobs' })
    else next()
  } else if (to.matched.some((record) => record.meta.public)) {
    next()
  } else {
    if (isLoggedIn) next()
    else
      next({
        path: '/',
        query: { redirectFrom: to.fullPath }
      })
  }
})
router.afterEach(cancelTopProgress)

export default router
