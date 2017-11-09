import Vue from 'vue'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/UIComponents/NotificationPlugin'
import SideBar from './components/UIComponents/SidebarPlugin'
import App from './App'

import { sync } from 'vuex-router-sync'
import store from './vuex.config.js'
// router setup
import router from './routes/index'

// library imports
import VeeValidate from 'vee-validate'
import VueConfig from 'vue-config'
import configs from './vue.configs.js'
import Chartist from 'chartist'

import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/paper-dashboard.scss'
import 'es6-promise/auto'

// plugin setup
Vue.use(VueConfig, configs)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)
Vue.use(SideBar)
Vue.use(VeeValidate)

sync(store, router)

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
  data: {
    Chartist: Chartist
  },
  render: h => h(App)
})
