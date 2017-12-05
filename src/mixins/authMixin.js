import Vue from 'vue'
import store from 'src/vuex.config.js'

Vue.mixin({
  methods: {
    login (email, password) {
      let self = this

      this.$auth.login({ email, password }).then((res) => {
        this.$store.dispatch('setUserData', res.data.data).then(() => {
          self.$store.dispatch('login', res.headers['x-auth-token'])
          Promise.all([
            self.$store.dispatch('getCurrencyData'),
            self.$store.dispatch('getCurrencyHistoricData'),
            self.$store.dispatch('getPortfolioHistoricData')
          ]).then(() => {
            let redirectPath = self.$route.query.redirect == null ? '/' : self.$route.query.redirect
            self.$router.push(redirectPath)
            self.$notify('User Logged In', 'ti-user')
          })
        })
      }).catch(function (error) {
        if (error && error.response && error.response.data) {
          self.$notify('User Login failed! ' + error.response.data.message, 'ti-alert', 'danger')
        } else {
          console.error(error)
        }
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
        if (self.$router) {
          self.$router.push({ path: '/login' })
        }
        self.$notify('User Logged Out', 'ti-user')
      })
    }
  }
})
