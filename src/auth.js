import Vue from 'vue'
import VueAxios from 'vue-axios'
import { VueAuthenticate } from 'vue-authenticate'
import axios from 'axios'
import VueCookie from 'vue-cookie'
// import store from 'src/vuex.config.js'

// axios.defaults.withCredentials = true

Vue.use(VueCookie)
Vue.use(VueAxios, axios)

export default new VueAuthenticate(Vue.prototype.$http, {
  baseUrl: 'http://localhost:4000',
  storageType: 'cookieStorage'
  // tokenName: 'access_token',
})
