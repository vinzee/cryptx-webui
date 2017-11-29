import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes.js'
import store from 'src/vuex.config.js'

Vue.use(VueRouter)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  console.log('isSessionPresent: ', store.getters.isSessionPresent)

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isSessionPresent) {
      next({path: 'login', query: { redirect: to.fullPath }})
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresNoAuth)) {
    if (store.getters.isSessionPresent) {
      next({path: '/'})
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
