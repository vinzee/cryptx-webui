import Vue from 'vue'
import VueConfig from 'vue-config'
import configs from './vue.configs.js'
import './utils/auth.js'

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
import Chartist from 'chartist'
// import 'chartist-plugin-legend'
// import './assets/chartist.scss'

import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/paper-dashboard.scss'
import 'es6-promise/auto'
import 'mixins/index.js'

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

function initializeApp () {
  /* eslint-disable no-new */
  window.vue = new Vue({
    el: '#app',
    router: router,
    store,
    data: {
      Chartist: Chartist
    },
    beforeCreate () {
      console.log('starting app...')
    },
    render: h => h(App)
  })
}

let session = Vue.cookie.get('session') // {domain: Vue.config.baseURL}
let isSessionPresent = session !== null && session !== undefined
console.log('appInit: ', isSessionPresent, session)

if (isSessionPresent) {
  store.dispatch('sessionAuthenticate').then(() => {
    initializeApp()
  })
} else {
  initializeApp()
}
