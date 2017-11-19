import Vue from 'vue'
import store from 'src/vuex.config.js'

Vue.mixin({
  created: function () {
    this.$axiosClient = Vue.axios.create({
      baseURL: window.appConfig.BASE_URL,
      withCredentials: true
    })

    // this.$axiosClient.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    this.$axiosClient.interceptors.request.use(function (config) {
      if (store.getters.isAuthenticated) {
        config.headers['x-auth-token'] = Vue.cookie.get('session')
      } else {
        delete config.headers['x-auth-token']
      }

      return config
    }, function (error) {
      // Do something with request error
      return Promise.reject(error)
    })

    this.$axiosClient.interceptors.response.use(function (response) {
      // this.setToken(response)
      return response
    }, function (error) {
      // Do something with response error
      return Promise.reject(error)
    })
  },
  methods: {
    // getAxiosClient: function (message, icon, type) {
    //   return this.$axiosClient
    // }
  }
})
