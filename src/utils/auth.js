import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios'
import VueCookie from 'vue-cookie'

axios.defaults.withCredentials = true

Vue.use(VueCookie)
Vue.use(VueAxios, axios)

Vue.use(VueAuthenticate, {
  baseUrl: 'http://localhost:8080', // Your API domain
  bindRequestInterceptor: function () {
    this.$http.interceptors.request.use((config) => {
      console.log('this.$http.interceptors', this.getToken(), config)
      if (this.isAuthenticated()) {
        config.headers['Authorization'] = [
          this.options.tokenType, this.getToken()
        ].join(' ')
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
