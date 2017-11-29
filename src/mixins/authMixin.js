import Vue from 'vue'

Vue.mixin({
  methods: {
    login (email, password) {
      let self = this

      this.$auth.login({ email, password }).then((res) => {
        console.log('login successful asd!', res.data.user)
        this.$cookie.set('session', res.session, {expires: '1H'}) // , domain: this.$config.BASE_URL

        // this.$store.dispatch('setUserData', res.data.user).then(() => {
        this.$store.dispatch('setTempUserData').then(() => {
          this.$store.dispatch('login')
          let redirectPath = this.$route.query.redirect == null ? '/' : this.$route.query.redirect
          this.$router.push(redirectPath)
          this.$notify('User logged in sucessfully !', 'ti-bank')
        })
      }).catch(function (res) {
        self.$notify('Error in user login. ', 'ti-alert')
      })
    },
    register (userData) {
      let self = this
      this.$auth.register({user: userData}).then(function (res) {
        self.$notify('User registered in sucessfully !', 'ti-bank')
        self.login(userData.email, userData.password)
      }).catch(function (res) {
        self.$notify('Error in user registration. ', 'ti-alert')
      })
    },
    logout () {
      let self = this
      this.$cookie.delete('session') // , {domain: this.$config.BASE_URL}
      this.$store.dispatch('logout').then(() => {
        self.$router.push({ path: '/login' })
        self.$notify('User logged out sucessfully !', 'ti-bank')
      })
    }
  }
})
