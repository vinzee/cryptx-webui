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
  console.log('router.beforeEach')
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isAuthenticated) {
    console.log('user not authenticated, redirecting to login')
    next({path: 'login', query: { redirect: to.fullPath }})
  } else {
    console.log('user authenticated')
    next()
  }
})

export default router
