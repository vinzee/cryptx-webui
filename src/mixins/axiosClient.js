import Vue from 'vue'
import store from 'src/vuex.config.js'

Vue.mixin({
  created: function () {
    let self = this

    this.$axiosClient = Vue.axios.create({
      baseURL: window.appConfig.BASE_URL,
      withCredentials: true
    })

    // this.$axiosClient.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    this.$axiosClient.interceptors.request.use(function (config) {
      window.vue.$blockUI()

      if (store.getters.isSessionPresent) {
        config.headers['x-auth-token'] = store.getters.session
      } else {
        delete config.headers['x-auth-token']
      }

      return config
    }, function (error) {
      // Do something with request error
      return Promise.reject(error)
    })

    this.$axiosClient.interceptors.response.use(function (response) {
      window.vue.$unblockUI()
      return response
    }, function (error) {
      window.vue.$unblockUI()
      console.log('axiosClient error', error)

      if (error.response && error.response.status === 401) {
        self.$notify('Unauthorized User. ', 'ti-alert', 'danger')
        self.logout()
        return
      }

      return Promise.reject(error)
    })
  },
  methods: {
    // getAxiosClient: function (message, icon, type) {
    //   return this.$axiosClient
    // }
  }
})
