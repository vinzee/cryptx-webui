import Vue from 'vue'
import store from 'src/vuex.config.js'

Vue.mixin({
  methods: {
    login (email, password) {
      let self = this

      this.$auth.login({ email, password }).then((res) => {
        console.log('login successful !', res.headers['x-auth-token'], res.data.data)

        this.$store.dispatch('setUserData', res.data.data).then(() => {
          self.$store.dispatch('getCurrencyData').then(() => {
            self.$store.dispatch('login', res.headers['x-auth-token']).then(() => {
              let redirectPath = self.$route.query.redirect == null ? '/' : self.$route.query.redirect
              self.$router.push(redirectPath)
              self.$notify('User Logged In', 'ti-user')
            })
          })
        })
      }).catch(function (error) {
        self.$notify('User Login failed! ' + error.response.data.message, 'ti-alert', 'danger')
      })
    },
    register (userData) {
      let self = this
      this.$auth.register({user: userData}).then(function (res) {
        self.$notify('User Registered', 'ti-user')
        self.login(userData.email, userData.password)
      }).catch(function (res) {
        self.$notify('User Registration failed', 'ti-alert', 'danger')
      })
    },
    logout () {
      let self = this
      store.dispatch('logout').then(() => {
        self.$router.push({ path: '/login' })
        self.$notify('User Logged Out', 'ti-user')
      })
    }
  }
})
