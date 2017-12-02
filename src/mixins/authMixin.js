import Vue from 'vue'
import store from 'src/vuex.config.js'

Vue.mixin({
  methods: {
    login (email, password) {
      let self = this
      // let res = {session: 'session_value'}
      this.$auth.login({ email, password }).then((res) => {
        console.log('login successful !', res.headers['x-auth-token'], res.data.data)

        this.$store.dispatch('setUserData', res.data.data)
        // this.$store.dispatch('setTempUserData')
        .then(this.$store.dispatch('getCurrencyData'))
        .then(this.$store.dispatch('login', res.headers['x-auth-token']))
        .then(() => {
          let redirectPath = this.$route.query.redirect == null ? '/' : this.$route.query.redirect
          this.$router.push(redirectPath)
          this.$notify('User Logged In', 'ti-user')
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
