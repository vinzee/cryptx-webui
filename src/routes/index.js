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
  console.log('beforeEach: ', to, from, next, store.getters)
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isAuthenticated()) {
    next({path: '/login', query: { redirect: to.fullPath }})
  } else {
    next()
  }
})

export default router
