import Vue from 'vue'
import VueRouter from 'vue-router'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/UIComponents/NotificationPlugin'
import SideBar from './components/UIComponents/SidebarPlugin'
import App from './App'

import store from './vuex.config.js'
import VeeValidate from 'vee-validate'
import VueKindergarten from 'vue-kindergarten'
import profilePerimeter from './perimeters/profilePerimeter.js'
import VueCookie from 'vue-cookie'
import VueResource from 'vue-resource'

import VueConfig from 'vue-config'
import configs from './vue.configs.js'

// router setup
import routes from './routes/routes'

// library imports
import Chartist from 'chartist'

import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/paper-dashboard.scss'
import 'es6-promise/auto'

// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)
Vue.use(SideBar)

Vue.use(VeeValidate)
Vue.use(VueKindergarten, {
  child: (store) => {
    return store.state.user
  }
})
Vue.use(VueCookie)
Vue.use(VueResource)
Vue.use(VueConfig, configs)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
  get () {
    return this.$root.Chartist
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  router: router,
  store,
  perimeters: [
    profilePerimeter
  ],
  data: {
    Chartist: Chartist
  },
  render: h => h(App)
})
