import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie)
Vue.use(VueAxios, axios)

Vue.use(VueAuthenticate, {
  baseUrl: window.appConfig.BASE_URL, // Your API domain
  loginUrl: window.appConfig.LOGIN_URL,
  registerUrl: window.appConfig.REGISTER_URL,

  bindRequestInterceptor: function () {
    this.$http.interceptors.request.use((config) => {
      if (config.url === window.appConfig.BASE_URL + window.appConfig.LOGIN_URL) {
        config.headers['Authorization'] = 'Basic ' + btoa(config.data.email + ':' + config.data.password)
      } else {
        delete config.headers['Authorization']
      }
      return config
    })
  },

  bindResponseInterceptor: function () {
    this.$http.interceptors.response.use((response) => {
      this.setToken(response)
      return response
    })
  }
})
